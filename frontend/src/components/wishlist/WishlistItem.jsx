import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import formatPrice from '../../utils/formatPrice';
import { imageProps } from '../../utils/imageFallback';

export default function WishlistItem({ product, onNavigate }) {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  return (
    <div className="flex gap-4">
      <Link to={`/product/${product.id}`} onClick={onNavigate} className="shrink-0" aria-label={product.name}>
        <img
          {...imageProps(product.image, product.imageSource)}
          alt={product.imageAlt ?? product.name}
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
          className="size-24 rounded-xl object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[0.625rem] font-bold tracking-[0.2em] text-mist uppercase">{product.brand}</p>
        <Link
          to={`/product/${product.id}`}
          onClick={onNavigate}
          className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-white transition-colors hover:text-volt"
        >
          {product.name}
        </Link>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-white">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-mist line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-volt px-4 text-[0.6875rem] font-bold tracking-[0.12em] text-ink-950 uppercase transition-colors hover:bg-white disabled:border disabled:bg-transparent disabled:text-mist"
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
            {product.inStock ? 'Add to cart' : 'Sold out'}
          </button>
          <button
            type="button"
            onClick={() => removeFromWishlist(product.id)}
            aria-label={`Remove ${product.name} from wishlist`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-mist transition-colors hover:border-ember hover:text-ember"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
