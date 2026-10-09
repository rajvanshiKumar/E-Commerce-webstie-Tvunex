import products from '../data/products';
import { ApiError, mockRequest } from './mockApi';

const DEAL_THRESHOLD = 30; // % off required to appear on the Deals page

export function getProducts() {
  return mockRequest(() => products);
}

export function getProductsByCategory(category) {
  return mockRequest(() => products.filter((product) => product.category === category));
}

export function getProductById(id) {
  return mockRequest(() => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) throw new ApiError('Product not found.', 404);
    return product;
  });
}

export function getFeaturedProducts() {
  return mockRequest(() => products.filter((product) => product.isFeatured));
}

export function getTrendingProducts() {
  return mockRequest(() => products.filter((product) => product.isTrending === true));
}

export function getNewArrivals() {
  return mockRequest(() => products.filter((product) => product.isNew === true));
}

export function getDeals() {
  return mockRequest(() =>
    products
      .filter((product) => product.discount >= DEAL_THRESHOLD)
      .sort((a, b) => b.discount - a.discount),
  );
}

export function getRelatedProducts(id, limit = 8) {
  return mockRequest(() => {
    const current = products.find((item) => item.id === Number(id));
    if (!current) return [];
    return products
      .filter((item) => item.category === current.category && item.id !== current.id)
      .slice(0, limit);
  });
}

/** Case-insensitive search across name, brand and category. Every word must match. */
export function searchProducts(query, { delay = 350 } = {}) {
  return mockRequest(
    () => {
      const terms = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (!terms.length) return [];
      return products.filter((product) => {
        const haystack = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    },
    { delay },
  );
}

/**
 * Synchronous helper for data restored from localStorage (cart, wishlist).
 * Stored entries can be older than the catalogue, so image fields are refreshed
 * from the current product and entries for removed products are dropped.
 */
export function refreshStoredProducts(items, { replace = false } = {}) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return [];
    if (replace) return [{ ...product }];
    return [{ ...item, image: product.image, imageSource: product.imageSource }];
  });
}
