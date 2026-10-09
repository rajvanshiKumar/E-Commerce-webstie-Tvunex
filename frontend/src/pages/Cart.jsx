import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { toast } from '../components/common/Toast';
import useCart from '../hooks/useCart';

export default function Cart() {
  const { cart, totals, clearCart } = useCart();

  useEffect(() => {
    document.title = 'Cart — PRAHARX';
  }, []);

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Almost yours</p>
          <h1 className="display mt-3 text-3xl text-white sm:text-5xl">Cart</h1>
          <p className="mt-3 text-sm text-mist sm:text-base">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        {cart.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearCart}>
            Clear cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Cart is empty"
          description="Add a few things you love and they will show up here."
          action={<Button to="/shop">Start shopping</Button>}
        />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.li
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border bg-ink-900 p-4 sm:p-5"
                >
                  <CartItem item={item} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside aria-label="Order summary" className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 font-display text-sm font-semibold tracking-tight text-white uppercase">Order summary</h2>
            <CartSummary>
              <Button fullWidth size="lg" onClick={() => toast.info('Checkout is a demo here — no payment is taken.')}>
                Checkout
              </Button>
              <Button fullWidth variant="secondary" to="/shop">
                Continue shopping
              </Button>
            </CartSummary>
          </aside>
        </div>
      )}
    </div>
  );
}
