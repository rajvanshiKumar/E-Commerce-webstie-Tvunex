import useCart from '../../hooks/useCart';
import formatPrice from '../../utils/formatPrice';

/** Subtotal / discount / shipping / total. `children` is the action area. */
export default function CartSummary({ children, showProgress = true }) {
  const { totals } = useCart();
  const payable = totals.total - totals.shipping;
  const remaining = Math.max(0, totals.freeShippingThreshold - payable);
  const progress = Math.min(100, (payable / totals.freeShippingThreshold) * 100);

  return (
    <div>
      {showProgress && totals.itemCount > 0 && (
        <div className="mb-5">
          <p className="text-xs text-mist">
            {remaining > 0 ? (
              <>
                Add <span className="font-bold text-white">{formatPrice(remaining)}</span> more for free delivery.
              </>
            ) : (
              <span className="font-bold text-volt">You have unlocked free delivery.</span>
            )}
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full rounded-full bg-volt transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-mist">
          <dt>
            Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
          </dt>
          <dd className="text-white">{formatPrice(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-mist">
          <dt>Discount</dt>
          <dd className="text-volt">− {formatPrice(totals.discount)}</dd>
        </div>
        <div className="flex justify-between text-mist">
          <dt>Delivery</dt>
          <dd className="text-white">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t pt-3.5">
          <dt className="text-sm font-bold tracking-[0.14em] text-white uppercase">Total</dt>
          <dd className="text-2xl font-extrabold text-white">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {children && <div className="mt-5 space-y-3">{children}</div>}
    </div>
  );
}
