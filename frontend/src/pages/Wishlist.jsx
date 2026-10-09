import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import useWishlist from '../hooks/useWishlist';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  useEffect(() => {
    document.title = 'Wishlist — PRAHARX';
  }, []);

  return (
    <div className="shell py-10 sm:py-14">
      <p className="eyebrow">Saved for later</p>
      <h1 className="display mt-3 text-3xl text-white sm:text-5xl">Wishlist</h1>
      <p className="mt-3 text-sm text-mist sm:text-base">
        {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}
      </p>

      <div className="mt-10">
        {wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No wishlist items"
            description="Tap the heart on any product to save it here."
            action={<Button to="/shop">Discover products</Button>}
          />
        ) : (
          <ProductGrid products={wishlist} />
        )}
      </div>
    </div>
  );
}
