import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

/**
 * Responsive grid: 2 columns on mobile, 3 on tablet, 4 on desktop.
 * Shows shimmer skeletons while `loading` is true.
 */
export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  const gridClasses = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4';

  if (loading) {
    return (
      <div className={gridClasses} role="status" aria-label="Loading products">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <ul className={gridClasses}>
      {products.map((product, index) => (
        <motion.li
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.45, delay: Math.min(index % 4, 3) * 0.06 }}
        >
          <ProductCard product={product} />
        </motion.li>
      ))}
    </ul>
  );
}
