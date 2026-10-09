import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { imageProps } from '../../utils/imageFallback';

const MotionLink = motion.create(Link);

export default function CategoryCard({ category }) {
  return (
    <MotionLink
      to={`/shop/${category.slug}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border sm:rounded-3xl"
    >
      <img
        {...imageProps(category.image, category.imageSource)}
        alt={category.imageAlt}
        loading="lazy"
        decoding="async"
        width="800"
        height="1000"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/5" />

      <span className="glass absolute top-3 right-3 flex size-10 bg-ink-950/55 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-volt group-hover:text-ink-950 sm:top-4 sm:right-4">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>

      <span className="absolute inset-x-4 bottom-4 block sm:inset-x-5 sm:bottom-5">
        <span className="block text-[0.625rem] font-bold tracking-[0.22em] text-volt uppercase">
          {category.productCount} products
        </span>
        <span className="mt-1.5 block font-display text-sm leading-tight font-semibold text-white uppercase sm:text-lg">
          {category.name}
        </span>
        <span className="mt-1 hidden text-xs text-zinc-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
          {category.tagline}
        </span>
      </span>
    </MotionLink>
  );
}
