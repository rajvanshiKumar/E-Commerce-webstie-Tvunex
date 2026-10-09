import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useCart from '../../hooks/useCart';
import formatPrice from '../../utils/formatPrice';
import { imageProps } from '../../utils/imageFallback';

/** One cart line. Used by both the cart drawer and the cart page. */
export default function CartItem({ item, onNavigate }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart, maxQuantity } = useCart();

  return (
    <div className="flex gap-4">
      <Link to={`/product/${item.id}`} onClick={onNavigate} className="shrink-0" aria-label={item.name}>
        <img
          {...imageProps(item.image, item.imageSource)}
          alt={`${item.name} by ${item.brand}`}
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
          className="size-24 rounded-xl object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-bold tracking-[0.2em] text-mist uppercase">{item.brand}</p>
            <Link
              to={`/product/${item.id}`}
              onClick={onNavigate}
              className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-white transition-colors hover:text-volt"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="mt-1 text-xs text-mist">
                {item.variantLabel}: {item.variant}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.key)}
            aria-label={`Remove ${item.name} from cart`}
            className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-ember/15 hover:text-ember"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-center rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.key)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="flex size-8 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <span className="w-7 text-center text-sm font-bold text-white" aria-live="polite">
              <span className="sr-only">Quantity </span>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => increaseQuantity(item.key)}
              disabled={item.quantity >= maxQuantity}
              aria-label={`Increase quantity of ${item.name}`}
              className="flex size-8 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-extrabold text-white">{formatPrice(item.price * item.quantity)}</p>
            {item.originalPrice > item.price && (
              <p className="text-xs text-mist line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
