import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Eye, Heart, ShoppingBag } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import formatPrice from '../../utils/formatPrice';
import { Rating } from '../review/ReviewCard';
import QuickView from './QuickView';
import { imageProps } from '../../utils/imageFallback';

/**
 * The single product card used everywhere: grids, carousels, wishlist,
 * new arrivals, deals and related products.
 */
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef(null);

  const wished = isInWishlist(product.id);
  const href = `/product/${product.id}`;

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  const handleAdd = () => {
    addToCart(product);
    setJustAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-ink-900 transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-card sm:rounded-3xl"
    >
      {/* Media */}
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        <Link to={href} aria-label={product.name} className="block size-full">
          <img
            {...imageProps(product.image, product.imageSource)}
            alt={product.imageAlt ?? product.name}
            loading="lazy"
            decoding="async"
            width="1000"
            height="1000"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.discount > 0 && (
            <span className="rounded-full bg-ember px-2.5 py-1 text-[0.625rem] font-extrabold tracking-wider text-white uppercase">
              {product.discount}% off
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[0.625rem] font-extrabold tracking-wider text-ink-950 uppercase">
              New
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-ink-950/80 px-2.5 py-1 text-[0.625rem] font-extrabold tracking-wider text-mist uppercase backdrop-blur">
              Sold out
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            type="button"
            onClick={() => toggleWishlist(product)}
            whileTap={{ scale: 0.8 }}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`glass flex size-9 items-center justify-center rounded-full bg-ink-950/55 transition-colors ${
              wished ? 'text-ember' : 'text-white hover:text-ember'
            }`}
          >
            <motion.span
              key={wished ? 'on' : 'off'}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              className="flex"
            >
              <Heart className={`size-4 ${wished ? 'fill-current' : ''}`} aria-hidden="true" />
            </motion.span>
          </motion.button>

          {/* Touch devices have no hover, so Quick View also lives here as an icon */}
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            aria-label={`Quick view ${product.name}`}
            className="glass flex size-9 items-center justify-center rounded-full bg-ink-950/55 text-white lg:hidden"
          >
            <Eye className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop: Quick View slides up on hover / keyboard focus */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-4 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="glass flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink-950/75 text-[0.6875rem] font-bold tracking-[0.16em] text-white uppercase transition-colors hover:bg-white hover:text-ink-950"
          >
            <Eye className="size-4" aria-hidden="true" />
            Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[0.625rem] font-bold tracking-[0.2em] text-mist uppercase">
          {product.brand} · {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm leading-tight font-semibold text-white sm:text-[0.9375rem]">
          <Link to={href} className="transition-colors hover:text-volt">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-mist">
          <Rating value={product.rating} size={12} />
          <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
          <span>
            {product.reviews.toLocaleString('en-IN')} <span className="hidden sm:inline">reviews</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-extrabold text-white sm:text-lg">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-mist line-through">
              <span className="sr-only">Original price </span>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <motion.button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          whileTap={{ scale: 0.96 }}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[0.6875rem] font-bold tracking-[0.14em] uppercase transition-colors disabled:border disabled:bg-transparent disabled:text-mist ${
            justAdded ? 'bg-white text-ink-950' : 'bg-volt text-ink-950 hover:bg-white'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={justAdded ? 'added' : 'add'}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              {!product.inStock ? (
                'Sold out'
              ) : justAdded ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" aria-hidden="true" /> Add to cart
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <QuickView product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </motion.article>
  );
}

export default memo(ProductCard);
