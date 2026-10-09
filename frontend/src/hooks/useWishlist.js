import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';

/** Access the Wishlist context. Must be used inside <WishlistProvider>. */
export default function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
