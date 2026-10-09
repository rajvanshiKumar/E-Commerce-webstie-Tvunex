import { FALLBACK_IMAGE } from '../data/images.js';

/**
 * Props for an <img> that degrades gracefully:
 *   1. the local file in public/images/
 *   2. the same photo on the Unsplash CDN (if a `remote` URL is given)
 *   3. a neutral placeholder tile
 *
 * Usage: <img {...imageProps(product.image, product.imageSource)} alt="…" />
 */
export function imageProps(src, remote) {
  return { src, 'data-remote': remote || undefined, onError: handleImageError };
}

export function handleImageError(event) {
  const img = event.currentTarget;

  if (img.dataset.remote && img.dataset.triedRemote !== 'true') {
    img.dataset.triedRemote = 'true';
    img.src = img.dataset.remote;
    return;
  }

  if (img.dataset.failed === 'true') return; // the placeholder itself failed: stop
  img.dataset.failed = 'true';
  img.src = FALLBACK_IMAGE;
}
