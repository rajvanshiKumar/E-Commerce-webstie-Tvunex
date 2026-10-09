import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import formatPrice from '../../utils/formatPrice';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Rating } from '../review/ReviewCard';
import { imageProps } from '../../utils/imageFallback';

/** Product preview dialog opened from a ProductCard. Animated by Modal (Framer Motion). */
export default function QuickView({ product, open, onClose }) {
  const { addToCart, maxQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [variant, setVariant] = useState(product.variants?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  // Reset the selection each time the dialog is opened.
  useEffect(() => {
    if (open) {
      setVariant(product.variants?.[0] ?? null);
      setQuantity(1);
    }
  }, [open, product]);

  const wished = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, quantity, variant);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} label={`Quick view: ${product.name}`} className="border">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="glass absolute top-4 right-4 z-10 flex size-10 bg-ink-950/55 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <div className="grid overflow-y-auto md:grid-cols-2">
        <div className="relative aspect-square bg-ink-800 md:aspect-auto md:min-h-[32rem]">
          <img
            {...imageProps(product.image, product.imageSource)}
            alt={product.imageAlt ?? product.name}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 rounded-full bg-ember px-3 py-1 text-[0.6875rem] font-extrabold tracking-wider text-white uppercase">
              {product.discount}% off
            </span>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <p className="eyebrow">
            {product.brand} · {product.category}
          </p>
          <h2 className="mt-3 pr-10 font-display text-xl leading-tight font-semibold text-white sm:text-2xl">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-mist">
            <Rating value={product.rating} />
            <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
            <span>({product.reviews.toLocaleString('en-IN')} reviews)</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base text-mist line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-bold text-volt">
                  You save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-mist">{product.description}</p>

          {product.variants?.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                {product.variantLabel}: <span className="text-white">{variant}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setVariant(option)}
                    aria-pressed={variant === option}
                    className={`min-w-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                      variant === option
                        ? 'border-volt bg-volt text-ink-950'
                        : 'border-white/15 text-white hover:border-white/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-center gap-4">
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">Quantity</span>
            <div className="flex items-center rounded-full border border-white/15">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button onClick={handleAdd} disabled={!product.inStock} size="lg" className="flex-1">
              <ShoppingBag className="size-4" aria-hidden="true" />
              {product.inStock ? 'Add to cart' : 'Sold out'}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`flex size-13 shrink-0 items-center justify-center rounded-full border transition-colors ${
                wished ? 'border-ember bg-ember/10 text-ember' : 'border-white/20 text-white hover:border-ember hover:text-ember'
              }`}
            >
              <Heart className={`size-5 ${wished ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          </div>

          <Link
            to={`/product/${product.id}`}
            onClick={onClose}
            className="mt-5 self-start border-b border-white/30 pb-0.5 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:border-volt hover:text-volt"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
