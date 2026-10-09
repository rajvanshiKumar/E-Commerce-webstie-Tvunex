import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/** Access the Cart context. Must be used inside <CartProvider>. */
export default function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
