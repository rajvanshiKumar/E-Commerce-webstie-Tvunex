export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
];

const comparators = {
  featured: (a, b) =>
    Number(b.isFeatured) - Number(a.isFeatured) ||
    Number(b.isTrending) - Number(a.isTrending) ||
    a.id - b.id,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  popular: (a, b) => b.reviews - a.reviews,
};

/** Pure function: returns a new sorted array. */
export default function sortProducts(products, sortBy = 'featured') {
  const compare = comparators[sortBy] ?? comparators.featured;
  return [...products].sort(compare);
}
