import { useEffect } from 'react';
import { Heart, LogOut, Mail, Package, ShoppingBag, User } from 'lucide-react';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Account() {
  const { currentUser, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { totals } = useCart();

  useEffect(() => {
    document.title = 'Account — PRAHARX';
  }, []);

  const initials = currentUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="shell py-10 sm:py-14">
      <p className="eyebrow">Your account</p>
      <h1 className="display mt-3 text-3xl text-white sm:text-5xl">Hello, {currentUser.name.split(' ')[0]}</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* User information */}
        <section aria-labelledby="profile-title" className="glass h-fit rounded-3xl p-6 sm:p-8">
          <h2 id="profile-title" className="sr-only">
            Profile
          </h2>
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-volt font-display text-xl font-bold text-ink-950">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-white">{currentUser.name}</p>
              <p className="text-xs text-mist">
                Member since {currentUser.createdAt ? dateFormatter.format(new Date(currentUser.createdAt)) : 'today'}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t pt-6 text-sm">
            <div className="flex items-center gap-3">
              <User className="size-4 shrink-0 text-volt" aria-hidden="true" />
              <dt className="sr-only">Name</dt>
              <dd className="truncate text-white">{currentUser.name}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-volt" aria-hidden="true" />
              <dt className="sr-only">Email</dt>
              <dd className="truncate text-white">{currentUser.email}</dd>
            </div>
          </dl>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <dt className="flex items-center gap-2 text-xs text-mist">
                <Heart className="size-3.5" aria-hidden="true" /> Wishlist
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">{wishlist.length}</dd>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <dt className="flex items-center gap-2 text-xs text-mist">
                <ShoppingBag className="size-3.5" aria-hidden="true" /> In cart
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">{totals.itemCount}</dd>
            </div>
          </dl>

          <Button variant="danger" fullWidth className="mt-6" onClick={logout}>
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
        </section>

        <div className="space-y-6">
          {/* Orders placeholder */}
          <section aria-labelledby="orders-title" className="rounded-3xl border bg-ink-900 p-6 sm:p-8">
            <h2 id="orders-title" className="font-display text-sm font-semibold tracking-tight text-white uppercase">
              Orders
            </h2>
            <EmptyState
              compact
              icon={Package}
              title="No orders yet"
              description="Order history will appear here once checkout is connected to a backend."
              action={<Button to="/shop">Start shopping</Button>}
            />
          </section>

          {/* Wishlist */}
          <section aria-labelledby="account-wishlist-title" className="rounded-3xl border bg-ink-900 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="account-wishlist-title" className="font-display text-sm font-semibold tracking-tight text-white uppercase">
                Wishlist
              </h2>
              {wishlist.length > 0 && (
                <Button to="/wishlist" variant="ghost" size="sm">
                  View all
                </Button>
              )}
            </div>
            {wishlist.length === 0 ? (
              <EmptyState
                compact
                icon={Heart}
                title="No wishlist items"
                description="Save products you like and find them here on any visit."
              />
            ) : (
              <ProductGrid products={wishlist.slice(0, 4)} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
