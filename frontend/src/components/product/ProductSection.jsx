import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import ProductCarousel from './ProductCarousel';
import ProductGrid from './ProductGrid';

/**
 * Titled product block used across the home page and product pages.
 * layout="grid" renders ProductGrid, layout="carousel" renders ProductCarousel.
 */
export default function ProductSection({
  id,
  eyebrow,
  title,
  subtitle,
  products = [],
  loading = false,
  layout = 'grid',
  skeletonCount = 8,
  viewAllTo,
  viewAllLabel = 'View all',
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10"
        >
          <div className="max-w-xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={id ? `${id}-title` : undefined} className="display mt-3 text-2xl text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-sm text-mist sm:text-base">{subtitle}</p>}
          </div>
          {viewAllTo && (
            <Link
              to={viewAllTo}
              className="group inline-flex items-center gap-1.5 border-b border-white/30 pb-1 text-xs font-bold tracking-[0.16em] text-white uppercase transition-colors hover:border-volt hover:text-volt"
            >
              {viewAllLabel}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          )}
        </motion.header>

        {!loading && products.length === 0 ? (
          <EmptyState compact title="No products found" description="Check back soon — new products land every week." />
        ) : layout === 'carousel' ? (
          <ProductCarousel products={products} loading={loading} label={title} />
        ) : (
          <ProductGrid products={products} loading={loading} skeletonCount={skeletonCount} />
        )}
      </div>
    </section>
  );
}
