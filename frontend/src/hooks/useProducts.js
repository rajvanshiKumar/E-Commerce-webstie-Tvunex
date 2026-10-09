import { useEffect, useState } from 'react';
import {
  getDeals,
  getFeaturedProducts,
  getNewArrivals,
  getProducts,
  getProductsByCategory,
  getRelatedProducts,
  getTrendingProducts,
  searchProducts,
} from '../api/productApi';

function request({ category, collection, query, relatedTo }) {
  if (relatedTo) return getRelatedProducts(relatedTo);
  if (query) return searchProducts(query, { delay: 650 });
  if (collection === 'featured') return getFeaturedProducts();
  if (collection === 'trending') return getTrendingProducts();
  if (collection === 'new') return getNewArrivals();
  if (collection === 'deals') return getDeals();
  if (category) return getProductsByCategory(category);
  return getProducts();
}

/**
 * Loads a product list through the mock API.
 *
 *   useProducts()                          -> every product
 *   useProducts({ category: 'shoes' })     -> one category
 *   useProducts({ collection: 'trending' }) -> featured | trending | new | deals
 *   useProducts({ query: 'phone' })        -> search results
 *   useProducts({ relatedTo: 12 })         -> same-category products
 *
 * Returns { products, loading, error }.
 */
export default function useProducts({ category, collection, query, relatedTo, limit } = {}) {
  const [state, setState] = useState({ products: [], loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    request({ category, collection, query, relatedTo })
      .then((data) => {
        if (active) setState({ products: limit ? data.slice(0, limit) : data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ products: [], loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [category, collection, query, relatedTo, limit]);

  return state;
}
