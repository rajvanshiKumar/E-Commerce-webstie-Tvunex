import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import useWishlist from '../../hooks/useWishlist';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import Modal from '../common/Modal';
import WishlistItem from './WishlistItem';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, closeWishlist } = useWishlist();

  return (
    <Modal open={isWishlistOpen} onClose={closeWishlist} label="Wishlist" position="right">
      <header className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
        <div>
          <p className="eyebrow">Wishlist</p>
          <p className="mt-1 text-sm text-mist">
            {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          type="button"
          onClick={closeWishlist}
          aria-label="Close wishlist"
          className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      {wishlist.length === 0 ? (
        <div className="flex flex-1 items-center px-6">
          <EmptyState
            compact
            icon={Heart}
            title="No wishlist items"
            description="Tap the heart on any product to save it for later."
            action={
              <Button to="/shop" onClick={closeWishlist}>
                Discover products
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <AnimatePresence initial={false}>
              {wishlist.map((product) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <WishlistItem product={product} onNavigate={closeWishlist} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <footer className="border-t bg-ink-800/60 px-5 py-5 sm:px-6">
            <Button fullWidth variant="secondary" to="/wishlist" onClick={closeWishlist}>
              View full wishlist
            </Button>
          </footer>
        </>
      )}
    </Modal>
  );
}
