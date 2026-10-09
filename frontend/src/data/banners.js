import { IMAGE_SIZES, localImage } from './images.js';

const photo = (file, photoId, alt) => localImage(`/images/banners/${file}.jpg`, photoId, IMAGE_SIZES.banner, alt);

// Hero carousel slides. Photos are wide (1920×1080) and sit behind the text.
const banners = [
  {
    id: 1,
    eyebrow: 'New Collection',
    title: 'Next Generation Shopping',
    subtitle: 'Discover products made for you.',
    photo: photo('new-collection-shopping-bags', 'photo-1483985988355-763728e1935b', 'A woman carrying black and white shopping bags'),
    accent: '#d6ff3f',
    primaryCta: { label: 'Shop Now', to: '/shop' },
    secondaryCta: { label: 'Explore', to: '/new-arrivals' },
    stat: { value: '80+', label: 'curated products' },
  },
  {
    id: 2,
    eyebrow: 'Tech Collection',
    title: 'Sound. Screens. Speed.',
    subtitle: 'Headphones, displays and devices built to keep up.',
    photo: photo('tech-collection-headphones', 'photo-1599669454699-248893623440', 'Black wireless headphones on a black surface'),
    accent: '#5ad7ff',
    primaryCta: { label: 'Shop Now', to: '/shop/electronics' },
    secondaryCta: { label: 'Explore', to: '/shop/mobiles' },
    stat: { value: '4.7★', label: 'average rating' },
  },
  {
    id: 3,
    eyebrow: 'Fashion Collection',
    title: 'Wear The Next Era',
    subtitle: 'Sharp tailoring and easy layers for the new season.',
    photo: photo('fashion-collection-black-jacket', 'photo-1612986568842-42f75cc9e36a', 'A man in a black jacket and trousers'),
    accent: '#ff8a5b',
    primaryCta: { label: 'Shop Now', to: '/shop/fashion' },
    secondaryCta: { label: 'Explore', to: '/shop/bags' },
    stat: { value: '50%', label: 'off selected styles' },
  },
];

export default banners;
