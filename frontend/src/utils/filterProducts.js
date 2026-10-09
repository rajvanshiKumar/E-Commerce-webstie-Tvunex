export const DEFAULT_FILTERS = {
  maxPrice: null, // null = no upper limit
  brands: [],
  minRating: 0,
  minDiscount: 0,
  inStockOnly: false,
};

export function countActiveFilters(filters) {
  let count = 0;
  if (filters.maxPrice !== null) count += 1;
  if (filters.brands.length) count += 1;
  if (filters.minRating > 0) count += 1;
  if (filters.minDiscount > 0) count += 1;
  if (filters.inStockOnly) count += 1;
  return count;
}

/** Pure function: returns the products matching every active filter. */
export default function filterProducts(products, filters = DEFAULT_FILTERS) {
  return products.filter((product) => {
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
    if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    if (filters.minDiscount && product.discount < filters.minDiscount) return false;
    if (filters.inStockOnly && !product.inStock) return false;
    return true;
  });
}
