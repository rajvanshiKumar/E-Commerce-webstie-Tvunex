import { IMAGE_SIZES, localImage } from './images.js';

// Category catalogue. `slug` is the URL segment used by /shop/:category.
const rows = [
  ['fashion', 'Fashion', 'Tailored, relaxed, considered.', 'fashion-clothes-rail', 'photo-1567401893414-76b7b1e5a7a5', 'Assorted clothes hanging on a rail'],
  ['shoes', 'Shoes', 'Built for every stride.', 'shoes-sneaker-lineup', 'photo-1495555961986-6d4c1ecb7be3', 'A line-up of sneakers'],
  ['electronics', 'Electronics', 'Sound, screens and smart gear.', 'electronics-headphones-laptop', 'photo-1498049794561-7780e7231661', 'Wireless headphones beside a laptop and a smartphone'],
  ['mobiles', 'Mobiles', 'Phones and everything around them.', 'mobiles-phone-in-hand', 'photo-1592890288564-76628a30a657', 'A person holding a black smartphone'],
  ['home', 'Home & Living', 'Pieces that make a room.', 'home-living-room', 'photo-1600210492493-0946911123ea', 'A living room with a brown sofa by a large window'],
  ['beauty', 'Beauty', 'Skin, scent and colour.', 'beauty-makeup-flatlay', 'photo-1522335789203-aabd1fc54bc9', 'Assorted makeup products on a grey surface'],
  ['gaming', 'Gaming', 'Gear that keeps up with you.', 'gaming-neon-setup', 'photo-1616588589676-62b3bd4ff6d2', 'A gaming desk with a computer and neon signs in purple light'],
  ['bags', 'Bags & Accessories', 'Carry it well.', 'bags-accessories-flatlay', 'photo-1511556820780-d912e42b4980', 'A bag, sneakers and sunglasses laid out on a beige surface'],
];

const categories = rows.map(([slug, name, tagline, file, photoId, alt], index) => {
  const photo = localImage(`/images/categories/${file}.jpg`, photoId, IMAGE_SIZES.category, alt);
  return { id: index + 1, slug, name, tagline, image: photo.src, imageSource: photo.remote, imageAlt: photo.alt, photo };
});

export default categories;
