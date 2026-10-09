import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CartDrawer from '../cart/CartDrawer';
import Loader from '../common/Loader';
import Toast from '../common/Toast';
import WishlistDrawer from '../wishlist/WishlistDrawer';
import Footer from './Footer';
import Navbar from './Navbar';

/**
 * Shared shell for every route: Navbar → page (<Outlet />) → Footer.
 * The global drawers and the toast container are mounted here once.
 */
export default function Layout() {
  const { pathname, hash } = useLocation();

  // New page: start at the top. Hash link (e.g. /#categories): scroll to it.
  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash]);

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-volt focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-ink-950"
      >
        Skip to content
      </a>

      <Navbar />

      {/* Keyed by path so each page fades in as a transition */}
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        {/* Pages are lazy-loaded; the navbar and footer stay visible while one loads */}
        <Suspense fallback={<Loader fullPage />}>
          <Outlet />
        </Suspense>
      </motion.main>

      <Footer />

      <CartDrawer />
      <WishlistDrawer />
      <Toast />
    </div>
  );
}
