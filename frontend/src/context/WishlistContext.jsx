import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { refreshStoredProducts } from '../api/productApi';
import { toast } from '../components/common/Toast';
import { STORAGE_KEYS, getItem, setItem } from '../utils/localStorage';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Full product objects are stored so wishlist views can reuse ProductCard.
  const [wishlist, setWishlist] = useState(() =>
    refreshStoredProducts(getItem(STORAGE_KEYS.WISHLIST, []), { replace: true }),
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    setItem(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  const isInWishlist = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist],
  );

  const addToWishlist = useCallback((product) => {
    setWishlist((items) => (items.some((item) => item.id === product.id) ? items : [...items, product]));
    toast.success(`${product.name} saved to wishlist.`);
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((items) => {
      const removed = items.find((item) => item.id === id);
      if (removed) toast.info(`${removed.name} removed from wishlist.`);
      return items.filter((item) => item.id !== id);
    });
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      if (wishlist.some((item) => item.id === product.id)) removeFromWishlist(product.id);
      else addToWishlist(product);
    },
    [wishlist, addToWishlist, removeFromWishlist],
  );

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
    }),
    [wishlist, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlistOpen, openWishlist, closeWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
