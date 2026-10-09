#!/usr/bin/env node
// Downloads every photo in the image manifest into public/images/.
//
//   npm run images            download anything that is missing
//   npm run images -- --force re-download everything
//   npm run images:check      verify the local files only (no network)
//
// The manifest lives in src/data (products.js, categories.js, banners.js, images.js),
// so this script never needs editing when a photo changes.
// Requires Node 18+ (built-in fetch). No dependencies.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const CHECK_ONLY = args.has('--check');
const CONCURRENCY = 6;
const RETRIES = 2;
const TIMEOUT_MS = 30_000;
const MIN_BYTES = 15_000; // anything smaller is almost certainly an error page or a blank image

const load = async (file) => (await import(pathToFileURL(path.join(ROOT, 'src/data', file)).href));

async function buildManifest() {
  const [products, categories, banners, images] = await Promise.all([
    load('products.js'),
    load('categories.js'),
    load('banners.js'),
    load('images.js'),
  ]);
  return [
    ...banners.default.map((banner) => ({ label: `Banner: ${banner.eyebrow}`, ...banner.photo })),
    ...categories.default.map((category) => ({ label: `Category: ${category.name}`, ...category.photo })),
    ...Object.entries(images.siteImages).map(([key, photo]) => ({ label: `Site: ${key}`, ...photo })),
    ...products.default.flatMap((product) =>
      product.images.map((photo) => ({ label: `Product #${product.id}: ${product.name}`, ...photo })),
    ),
  ];
}

/** Reads width/height from a JPEG buffer. Returns null if it is not a valid JPEG. */
export function jpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  return null;
}

function validate(buffer, entry) {
  if (buffer.length < MIN_BYTES) return `file is only ${buffer.length} bytes`;
  const size = jpegSize(buffer);
  if (!size) return 'not a valid JPEG';
  if (size.width < entry.width * 0.9 || size.height < entry.height * 0.9) {
    return `too small: ${size.width}×${size.height}, expected ${entry.width}×${entry.height}`;
  }
  return null;
}

async function readLocal(entry) {
  try {
    return await readFile(path.join(PUBLIC_DIR, entry.src));
  } catch {
    return null;
  }
}

async function download(entry) {
  let lastError = 'unknown error';
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(entry.remote, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'follow' });
      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        if (response.status === 404) break; // the photo does not exist: retrying will not help
        continue;
      }
      const type = response.headers.get('content-type') ?? '';
      if (!type.startsWith('image/')) {
        lastError = `unexpected content-type "${type}"`;
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const problem = validate(buffer, entry);
      if (problem) {
        lastError = problem;
        continue;
      }
      const target = path.join(PUBLIC_DIR, entry.src);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, buffer);
      return { ok: true, bytes: buffer.length };
    } catch (error) {
      lastError = error.cause?.code ?? error.name ?? String(error);
    }
  }
  return { ok: false, error: lastError };
}

async function processEntry(entry) {
  const local = await readLocal(entry);
  const localProblem = local ? validate(local, entry) : 'missing';

  if (CHECK_ONLY) return localProblem ? { status: 'failed', error: localProblem } : { status: 'ok' };
  if (!localProblem && !FORCE) return { status: 'skipped' };

  const result = await download(entry);
  return result.ok ? { status: 'downloaded', bytes: result.bytes } : { status: 'failed', error: result.error };
}

async function main() {
  const manifest = await buildManifest();

  const duplicates = manifest.filter((entry, index) => manifest.findIndex((other) => other.photoId === entry.photoId) !== index);
  if (duplicates.length) {
    console.warn(`Warning: ${duplicates.length} photo(s) are used more than once:`);
    duplicates.forEach((entry) => console.warn(`  ${entry.photoId}  ${entry.label}`));
  }

  console.log(`${CHECK_ONLY ? 'Checking' : 'Downloading'} ${manifest.length} images${FORCE ? ' (forced)' : ''}…\n`);

  const results = new Array(manifest.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < manifest.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await processEntry(manifest[index]);
      const { status, error } = results[index];
      const mark = status === 'failed' ? '✗' : status === 'skipped' ? '·' : '✓';
      console.log(`${mark} ${manifest[index].src}${error ? `  — ${error}` : ''}`);
    }
  };
  await Promise.all(Array.from({ length: CHECK_ONLY ? 1 : CONCURRENCY }, worker));

  const count = (status) => results.filter((result) => result.status === status).length;
  const failed = manifest.map((entry, index) => ({ entry, result: results[index] })).filter(({ result }) => result.status === 'failed');

  console.log(
    CHECK_ONLY
      ? `\n${count('ok')} valid, ${failed.length} missing or invalid.`
      : `\n${count('downloaded')} downloaded, ${count('skipped')} already present, ${failed.length} failed.`,
  );

  if (failed.length) {
    console.log('\nNeeds attention (the site shows the Unsplash CDN copy or a placeholder for these):');
    for (const { entry, result } of failed) {
      console.log(`  ${entry.label}\n    file:  public${entry.src}\n    photo: ${entry.remote}\n    error: ${result.error}`);
    }
    console.log('\nTo replace a photo, change its "photo-…" ID in src/data and run this script again.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
