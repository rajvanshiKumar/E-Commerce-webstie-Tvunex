import categories from '../data/categories';
import products from '../data/products';
import { ApiError, mockRequest } from './mockApi';

const withCount = (category) => ({
  ...category,
  productCount: products.filter((product) => product.category === category.slug).length,
});

export function getCategories() {
  return mockRequest(() => categories.map(withCount), { delay: 450 });
}

export function getCategoryBySlug(slug) {
  return mockRequest(
    () => {
      const category = categories.find((item) => item.slug === slug);
      if (!category) throw new ApiError('Category not found.', 404);
      return withCount(category);
    },
    { delay: 200 },
  );
}
