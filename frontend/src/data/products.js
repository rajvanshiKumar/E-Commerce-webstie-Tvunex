// ALL product data for PRAHARX lives in this file.
//
// Each row below is: [name, brand, price, originalPrice, rating, reviews, flags, photo]
// flags: T = trending, N = new arrival, F = featured, X = out of stock
// photo: the Unsplash photo ID for this product (every product has its own photo).
// The rows are expanded into full product objects at the bottom of the file.

import { IMAGE_SIZES, localImage, slugify } from './images.js';

const catalogue = {
  fashion: {
    variantLabel: 'Size',
    variants: ['S', 'M', 'L', 'XL'],
    blurb: 'Cut from premium fabric with a considered fit, it layers easily and holds its shape wash after wash.',
    rows: [
      ['Oversized Heavyweight Tee', 'Kairo', 899, 1499, 4.6, 312, 'TF', 'photo-1620799139652-715e4d5b232d'],
      ['Tailored Wool Blend Blazer', 'Vanta Studio', 4999, 7999, 4.7, 88, 'F', 'photo-1592343516109-362f7bd871aa'],
      ['Relaxed Fit Denim Jacket', 'Northline', 2799, 3999, 4.5, 204, 'T', 'photo-1611312449408-fcece27cdbb7'],
      ['Merino Crewneck Sweater', 'Loomhaus', 2499, 3299, 4.8, 141, 'N', 'photo-1631541909061-71e349d1f203'],
      ['Pleated Wide Leg Trousers', 'Vanta Studio', 1999, 2999, 4.4, 97, 'N', 'photo-1594633312681-425c7b97ccd1'],
      ['Linen Resort Shirt', 'Loomhaus', 1499, 1999, 4.3, 176, '', 'photo-1713881587420-113c1c43e28a'],
      ['Fleece Zip Hoodie', 'Kairo', 1799, 2999, 4.7, 421, 'T', 'photo-1556821840-3a63f95609a7'],
      ['Quilted Puffer Vest', 'Northline', 3299, 5499, 4.5, 63, '', 'photo-1577910473180-55de54e7ff30'],
      ['Ribbed Knit Midi Dress', 'Vanta Studio', 2299, 3499, 4.6, 118, 'N', 'photo-1789110520279-49e8a3a6fb91'],
      ['Classic Trench Coat', 'Northline', 6499, 9999, 4.9, 54, 'X', 'photo-1633821879282-0c4e91f96232'],
    ],
  },
  shoes: {
    variantLabel: 'Size',
    variants: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    blurb: 'A cushioned midsole and durable outsole keep it comfortable from the first wear to the thousandth step.',
    rows: [
      ['Premium Sneakers', 'Stridr', 1499, 1999, 4.8, 125, 'TNF', 'photo-1608231387042-66d1773070a5'],
      ['Aero Knit Runners', 'Aerofoam', 3499, 4999, 4.7, 289, 'T', 'photo-1562183241-b937e95585b6'],
      ['Court Classic Low', 'Stridr', 2799, 3499, 4.5, 164, 'F', 'photo-1600269452121-4f2416e55c28'],
      ['Trail Grip Hikers', 'Northline', 4299, 5999, 4.6, 92, '', 'photo-1575987116913-e96e7d490b8a'],
      ['Leather Chelsea Boots', 'Kairo', 3999, 5999, 4.7, 73, 'N', 'photo-1788478963160-1c38139e2932'],
      ['Slip-On Canvas Loafers', 'Stridr', 1299, 1799, 4.2, 211, '', 'photo-1615979474401-8a6a344de5bd'],
      ['High-Top Street Kicks', 'Kairo', 2999, 4499, 4.6, 187, 'T', 'photo-1512374382149-233c42b6a83b'],
      ['Cloud Recovery Slides', 'Aerofoam', 799, 1299, 4.4, 356, '', 'photo-1764471444628-51c4189ec183'],
      ['Suede Desert Boots', 'Northline', 3299, 4299, 4.5, 58, 'N', 'photo-1608629601270-a0007becead3'],
      ['Carbon Race Flats', 'Aerofoam', 7999, 9999, 4.9, 41, 'X', 'photo-1542291026-7eec264c27ff'],
    ],
  },
  electronics: {
    variantLabel: 'Colour',
    variants: ['Graphite', 'Silver', 'Midnight'],
    blurb: 'Engineered for everyday performance, with long battery life and a finish that feels as good as it looks.',
    rows: [
      ['Noise Cancelling Headphones', 'Sonara', 6999, 9999, 4.8, 512, 'TF', 'photo-1505740420928-5e560c06d30e'],
      ['Wireless Earbuds Pro', 'Sonara', 3499, 4999, 4.6, 874, 'T', 'photo-1606220588913-b3aacb4d2f46'],
      ['4K Smart Monitor 27"', 'Lumen', 18999, 24999, 4.7, 133, 'N', 'photo-1666771410140-0573b232426e'],
      ['Mechanical Keyboard 75%', 'Voltic', 4499, 5999, 4.7, 246, '', 'photo-1618384887929-16ec33fab9ef'],
      ['Portable Bluetooth Speaker', 'Sonara', 2499, 3999, 4.5, 398, 'T', 'photo-1589003077984-894e133dabab'],
      ['Smart Watch Series X', 'Orbit', 8999, 12999, 4.6, 327, 'NF', 'photo-1579586337278-3befd40fd17a'],
      ['Mirrorless Camera Kit', 'Lumen', 54999, 64999, 4.9, 67, '', 'photo-1516035069371-29a1b244cc32'],
      ['Ultra Slim Laptop 14', 'Voltic', 62999, 74999, 4.8, 152, 'N', 'photo-1496181133206-80ce9b88a853'],
      ['4K Streaming TV 43"', 'Lumen', 27999, 39999, 4.5, 208, '', 'photo-1593359677879-a4bb92f829d1'],
      ['Tablet Air 10"', 'Orbit', 21999, 26999, 4.6, 119, 'X', 'photo-1561154464-82e9adf32764'],
    ],
  },
  mobiles: {
    variantLabel: 'Variant',
    variants: ['Standard', 'Plus', 'Max'],
    blurb: 'Fast, dependable and designed to last the day, with the details that make a phone easy to live with.',
    rows: [
      ['Orbit X Pro 5G Phone', 'Orbit', 54999, 64999, 4.8, 643, 'TF', 'photo-1598327105666-5b89351aff97'],
      ['Nexa One 5G Phone', 'Nexa', 24999, 29999, 4.6, 918, 'T', 'photo-1511707171634-5f897ff02aa9'],
      ['Orbit Fold Mini Phone', 'Orbit', 79999, 94999, 4.7, 86, 'N', 'photo-1640936343842-268f9d87e764'],
      ['Nexa Lite Phone', 'Nexa', 11999, 14999, 4.3, 1204, '', 'photo-1585060544812-6b45742d762f'],
      ['Armor Shield Phone Case', 'Voltic', 699, 1299, 4.5, 532, '', 'photo-1623393884989-cb3663e431c5'],
      ['65W Fast Charger', 'Voltic', 1299, 1999, 4.6, 771, 'T', 'photo-1583863788434-e58a36330cf0'],
      ['Braided USB-C Cable 2m', 'Voltic', 399, 799, 4.4, 1433, '', 'photo-1595756630452-736bc8ef3693'],
      ['Magnetic Power Bank 10K', 'Nexa', 2199, 3499, 4.5, 264, 'N', 'photo-1566554738544-d962991c3fee'],
      ['Tempered Glass Screen Guard', 'Voltic', 299, 599, 4.2, 989, '', 'photo-1695048132853-026f93f40f7f'],
      ['Phone Gimbal Stabiliser', 'Orbit', 5999, 7999, 4.6, 74, 'NX', 'photo-1559861796-cc4eb7e3cf01'],
    ],
  },
  home: {
    variantLabel: 'Finish',
    variants: ['Oat', 'Charcoal', 'Walnut'],
    blurb: 'Honest materials and clean lines make it an easy fit for any room, and sturdy enough for daily life.',
    rows: [
      ['Arc Floor Lamp', 'Casa Nord', 5499, 7999, 4.7, 96, 'TF', 'photo-1494438639946-1ebd1d20bf85'],
      ['Bouclé Accent Armchair', 'Casa Nord', 14999, 19999, 4.8, 61, 'N', 'photo-1586023492125-27b2c045efd7'],
      ['Modular 3-Seat Sofa', 'Hearth', 42999, 59999, 4.7, 38, 'F', 'photo-1555041469-a586c61ea9bc'],
      ['Linen Bedding Set', 'Hearth', 3999, 5999, 4.6, 214, 'T', 'photo-1606855637183-ea2a00b6f15f'],
      ['Minimal Wall Clock', 'Casa Nord', 1299, 1999, 4.4, 147, '', 'photo-1563861826100-9cb868fdbe1c'],
      ['Pour-Over Coffee Set', 'Hearth', 2499, 3499, 4.8, 183, 'N', 'photo-1522675397120-8cb88c83ac16'],
      ['Ceramic Flower Vase', 'Casa Nord', 999, 1499, 4.5, 126, '', 'photo-1612196808214-b8e1d6145a8c'],
      ['Stoneware Dinnerware Set', 'Hearth', 3499, 4999, 4.6, 89, '', 'photo-1551807306-4bcd16b92a41'],
      ['Scented Soy Candle Trio', 'Hearth', 899, 1299, 4.7, 302, 'T', 'photo-1643122966676-29e8597257f7'],
      ['Smart Table Lamp', 'Lumen', 2299, 2999, 4.3, 77, 'X', 'photo-1570974802254-4b0ad1a755f5'],
    ],
  },
  beauty: {
    variantLabel: 'Size',
    variants: ['30 ml', '50 ml', '100 ml'],
    blurb: 'A gentle, dermatologist-tested formula made without parabens or sulphates. Suitable for daily use.',
    rows: [
      ['Vitamin C Glow Serum', 'Dewlab', 899, 1299, 4.7, 684, 'TF', 'photo-1723951174326-2a97221d3b7f'],
      ['Hydra Gel Moisturiser', 'Dewlab', 749, 999, 4.6, 451, '', 'photo-1629732047847-50219e9c5aef'],
      ['Velvet Matte Lip Colour', 'Aurae', 599, 899, 4.5, 392, 'T', 'photo-1586495777744-4413f21062fa'],
      ['Eau de Parfum Noir', 'Aurae', 3499, 4999, 4.8, 143, 'N', 'photo-1594035910387-fea47794261f'],
      ['Pro Makeup Brush Set', 'Aurae', 1299, 1999, 4.6, 228, '', 'photo-1620464003286-a5b0d79f32c2'],
      ['12-Shade Eyeshadow Palette', 'Aurae', 1499, 2199, 4.5, 176, 'N', 'photo-1583931537180-7d26921260e4'],
      ['Rose Petal Face Mist', 'Botanic Co.', 499, 699, 4.4, 317, '', 'photo-1595425959632-34f2822322ce'],
      ['Overnight Repair Cream', 'Dewlab', 1199, 1599, 4.7, 205, 'F', 'photo-1708477199100-e4d5f56a8eb2'],
      ['Mineral Sunscreen SPF 50', 'Botanic Co.', 599, 799, 4.6, 538, 'T', 'photo-1698906821280-34072d3ac1be'],
      ['Silk Finish Hair Oil', 'Botanic Co.', 699, 999, 4.3, 164, 'X', 'photo-1608571423539-e951b9b3871e'],
    ],
  },
  gaming: {
    variantLabel: 'Edition',
    variants: ['Standard', 'Pro'],
    blurb: 'Low latency, tournament-grade components and a build made for long sessions.',
    rows: [
      ['Pro Wireless Controller', 'Hexcore', 4999, 6499, 4.8, 426, 'TF', 'photo-1612287230202-1ff1d85d1bdf'],
      ['RGB Gaming Headset', 'Nyx', 3999, 5999, 4.6, 353, 'T', 'photo-1610041321327-b794c052db27'],
      ['Ultralight Gaming Mouse', 'Hexcore', 2999, 4499, 4.7, 512, 'N', 'photo-1615663245857-ac93bb7c39e7'],
      ['Hall-Effect Gaming Keyboard', 'Hexcore', 7999, 10999, 4.8, 139, 'N', 'photo-1634554423386-494bc98e26a8'],
      ['240Hz Gaming Monitor 27"', 'Nyx', 29999, 39999, 4.7, 94, 'F', 'photo-1593305841991-05c297ba4575'],
      ['Arcade Fight Joystick', 'Nyx', 8999, 11999, 4.5, 47, '', 'photo-1625675742564-07701bfbd753'],
      ['Ergonomic Gaming Chair', 'Hexcore', 15999, 22999, 4.4, 168, '', 'photo-1770195483917-b3bb444b7a29'],
      ['XL Desk Mat Mousepad', 'Nyx', 799, 1299, 4.6, 731, 'T', 'photo-1587749091716-f7b291a87f87'],
      ['USB Streaming Microphone', 'Voltic', 5499, 7499, 4.6, 202, '', 'photo-1588800347304-ec7e6f353327'],
      ['Handheld Console Dock', 'Hexcore', 3499, 4999, 4.3, 58, 'X', 'photo-1618397360795-952a13220a66'],
    ],
  },
  bags: {
    variantLabel: 'Colour',
    variants: ['Black', 'Tan', 'Olive'],
    blurb: 'Full-grain materials, reinforced stitching and hardware chosen to age well with use.',
    rows: [
      ['Everyday Leather Tote', 'Atlas & Co.', 3999, 5999, 4.7, 174, 'TF', 'photo-1624687943971-e86af76d57de'],
      ['Commuter Backpack 22L', 'Northline', 2999, 4499, 4.8, 396, 'T', 'photo-1553062407-98eeb64c6a62'],
      ['Slim Leather Briefcase', 'Atlas & Co.', 6999, 9999, 4.6, 65, '', 'photo-1473188588951-666fce8e7c68'],
      ['Cabin Luggage Spinner 55cm', 'Northline', 7499, 11999, 4.7, 121, 'N', 'photo-1568571959361-3bffbad07499'],
      ['Bifold Leather Wallet', 'Atlas & Co.', 1299, 1999, 4.5, 448, '', 'photo-1601592996763-f05c9c80a7f1'],
      ['Polarised Aviator Sunglasses', 'Vanta Studio', 1999, 2999, 4.4, 233, 'N', 'photo-1567473810954-507d59716c25'],
      ['Minimalist Steel Watch', 'Vanta Studio', 5999, 8499, 4.8, 157, 'F', 'photo-1620625515032-6ed0c1790c75'],
      ['Woven Leather Belt', 'Atlas & Co.', 999, 1499, 4.3, 102, '', 'photo-1624222247344-550fb60583dc'],
      ['Crossbody Sling Bag', 'Northline', 1799, 2499, 4.6, 287, 'T', 'photo-1620786514684-ff35b5aae55e'],
      ['Weekender Duffle Bag', 'Atlas & Co.', 4499, 6499, 4.7, 83, 'X', 'photo-1525103504173-8dc1582c7430'],
    ],
  },
};

const DAY = 24 * 60 * 60 * 1000;
const CATALOGUE_DATE = new Date('2026-10-01T00:00:00Z').getTime();

let nextId = 1;

const products = Object.entries(catalogue).flatMap(([category, group]) =>
  group.rows.map(([name, brand, price, originalPrice, rating, reviews, flags, photoId]) => {
    const id = nextId++;
    const isNew = flags.includes('N');
    const inStock = !flags.includes('X');
    // Local file: /images/products/<category>-<product-name>.jpg (see scripts/download-images.mjs)
    const photo = localImage(
      `/images/products/${category}-${slugify(name)}.jpg`,
      photoId,
      IMAGE_SIZES.product,
      `${name} by ${brand}`,
    );

    return {
      id,
      name,
      brand,
      category,
      price,
      originalPrice,
      discount: Math.round((1 - price / originalPrice) * 100),
      rating,
      reviews,
      image: photo.src,
      imageSource: photo.remote,
      imageAlt: photo.alt,
      images: [photo],
      description: `${name} by ${brand}. ${group.blurb}`,
      variantLabel: group.variantLabel,
      variants: group.variants,
      inStock,
      stock: inStock ? 5 + ((id * 7) % 40) : 0,
      isTrending: flags.includes('T'),
      isNew,
      isFeatured: flags.includes('F'),
      // New arrivals were added in the last few weeks, everything else earlier.
      createdAt: new Date(CATALOGUE_DATE - (isNew ? id % 20 : 60 + id * 3) * DAY).toISOString(),
    };
  }),
);

export default products;
