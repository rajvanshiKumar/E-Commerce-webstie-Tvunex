// Image manifest helpers.
//
// Every photo on the site is a free-licence Unsplash photo (https://unsplash.com/license).
// Each one is described by:
//   src    – the local file in public/images/ (created by `npm run images`)
//   remote – the same photo on Unsplash's CDN, used automatically if the local file is missing
//   alt    – meaningful alternative text
//
// The download script (scripts/download-images.mjs) reads this manifest, so adding
// or changing a photo here is all that is needed.

const UNSPLASH_CDN = 'https://images.unsplash.com/';

// [width, height] each kind of image is cropped to.
export const IMAGE_SIZES = {
  product: [1000, 1000], // square product photography
  category: [800, 1000], // 4:5 portrait cards
  banner: [1920, 1080], // cinematic hero slides
  collection: [1920, 1080],
  portrait: [1000, 1300], // login / signup side panel
};

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/["'%]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** CDN URL for an Unsplash photo, cropped to the given size as a JPEG. */
export function remoteImage(photoId, [width, height]) {
  return `${UNSPLASH_CDN}${photoId}?fm=jpg&fit=crop&w=${width}&h=${height}&q=80`;
}

export function localImage(src, photoId, size, alt) {
  return { src, photoId, remote: remoteImage(photoId, size), width: size[0], height: size[1], alt };
}

// Standalone images used directly by components.
export const siteImages = {
  featuredCollection: localImage(
    '/images/collections/studio-edit-coat-rail.jpg',
    'photo-1604882767135-b41fac508fff',
    IMAGE_SIZES.collection,
    'A brown and white coat hanging on a clothes rail',
  ),
  authPanel: localImage(
    '/images/collections/boutique-mannequins.jpg',
    'photo-1767334010488-83cdb8539273',
    IMAGE_SIZES.portrait,
    'Mannequins displaying clothing in a dimly lit boutique',
  ),
};

// Shown when both the local file and the CDN copy fail to load.
export const FALLBACK_IMAGE = '/images/fallback.svg';
