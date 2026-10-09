import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import useCart from '../../hooks/useCart';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import Modal from '../common/Modal';
import { toast } from '../common/Toast';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { cart, totals, isCartOpen, closeCart, clearCart } = useCart();

  const handleCheckout = () => {
    toast.info('Checkout is a demo here — no payment is taken.');
  };

  return (
    <Modal open={isCartOpen} onClose={closeCart} label="Shopping cart" position="right">
      <header className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
        <div>
          <p className="eyebrow">Your cart</p>
          <p className="mt-1 text-sm text-mist">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full px-3 py-2 text-xs font-bold text-mist underline underline-offset-4 transition-colors hover:text-ember"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {cart.length === 0 ? (
        <div className="flex flex-1 items-center px-6">
          <EmptyState
            compact
            icon={ShoppingBag}
            title="Cart is empty"
            description="Add a few things you love and they will show up here."
            action={
              <Button to="/shop" onClick={closeCart}>
                Start shopping
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.li
                  key={item.key}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <CartItem item={item} onNavigate={closeCart} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <footer className="border-t bg-ink-800/60 px-5 py-5 sm:px-6">
            <CartSummary>
              <Button fullWidth size="lg" onClick={handleCheckout}>
                Checkout
              </Button>
              <Button fullWidth variant="secondary" to="/cart" onClick={closeCart}>
                View cart
              </Button>
            </CartSummary>
          </footer>
        </>
      )}
    </Modal>
  );
}
