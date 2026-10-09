import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { refreshStoredProducts } from '../api/productApi';
import { toast } from '../components/common/Toast';
import { STORAGE_KEYS, getItem, setItem } from '../utils/localStorage';

export const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;
const MAX_QUANTITY = 10;

const lineKey = (id, variant) => `${id}::${variant ?? 'default'}`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => refreshStoredProducts(getItem(STORAGE_KEYS.CART, [])));
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist on every change so the cart survives a refresh.
  useEffect(() => {
    setItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1, variant = null) => {
    if (!product.inStock) {
      toast.error(`${product.name} is out of stock.`);
      return;
    }
    const chosenVariant = variant ?? product.variants?.[0] ?? null;
    const key = lineKey(product.id, chosenVariant);

    setCart((items) => {
      const existing = items.find((item) => item.key === key);
      if (existing) {
        return items.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
            : item,
        );
      }
      return [
        ...items,
        {
          key,
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image: product.image,
          imageSource: product.imageSource,
          price: product.price,
          originalPrice: product.originalPrice,
          variantLabel: product.variantLabel,
          variant: chosenVariant,
          quantity: Math.min(MAX_QUANTITY, quantity),
        },
      ];
    });
    toast.success(`${product.name} added to cart.`);
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((items) => {
      const removed = items.find((item) => item.key === key);
      if (removed) toast.info(`${removed.name} removed from cart.`);
      return items.filter((item) => item.key !== key);
    });
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setCart((items) =>
      items.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) }
          : item,
      ),
    );
  }, []);

  const increaseQuantity = useCallback(
    (key) =>
      setCart((items) =>
        items.map((item) =>
          item.key === key ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) } : item,
        ),
      ),
    [],
  );

  const decreaseQuantity = useCallback(
    (key) =>
      setCart((items) =>
        items.map((item) =>
          item.key === key ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
        ),
      ),
    [],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    toast.info('Cart cleared.');
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totals = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Subtotal is at list price; discount is what the sale prices take off.
    const subtotal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const payable = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal - payable;
    const shipping = payable === 0 || payable >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return {
      itemCount,
      subtotal,
      discount,
      shipping,
      total: payable + shipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      totals,
      maxQuantity: MAX_QUANTITY,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [cart, totals, addToCart, removeFromCart, updateQuantity, increaseQuantity, decreaseQuantity, clearCart, isCartOpen, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
