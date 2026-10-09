import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import logoMark from "../../assets/icons/logo-mark.svg";
import { getCategories } from "../../api/categoryApi";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import Modal from "../common/Modal";
import SearchOverlay from "../search/SearchOverlay";
import { imageProps } from "../../utils/imageFallback";

const NAV_LINKS = [
  { label: "Home", to: "/", isActive: (path) => path === "/" },
  {
    label: "Shop",
    to: "/shop",
    isActive: (path) => path.startsWith("/shop") || path.startsWith("/product"),
  },
  { label: "Categories", menu: true },
  {
    label: "New Arrivals",
    to: "/new-arrivals",
    isActive: (path) => path === "/new-arrivals",
  },
  { label: "Deals", to: "/deals", isActive: (path) => path === "/deals" },
];

function Badge({ count }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 16 }}
      aria-hidden="true"
      className="absolute -top-0.5 -right-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-volt px-1 text-[0.625rem] font-extrabold text-ink-950"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

const iconButton =
  "relative flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10";

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="PraharX home"
      className="flex items-center gap-2.5"
    >
      <img
        src={logoMark}
        alt=""
        width="30"
        height="30"
        className="size-[1.875rem] bg-transparent"
      />
      <span className="font-display text-base font-bold tracking-[0.08em] text-white sm:text-lg">
        Techvune<span className="text-volt">X</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { totals, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'categories' | 'account' | null
  const [categories, setCategories] = useState([]);
  const navRef = useRef(null);

  useEffect(() => {
    let active = true;
    getCategories().then((data) => active && setCategories(data));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every menu when the route changes.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const toggleMenu = (name) =>
    setOpenMenu((current) => (current === name ? null : name));
  const firstName = currentUser?.name?.split(" ")[0];

  const handleLogout = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    logout();
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-ink-950/75 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.9)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-transparent bg-ink-950/20 backdrop-blur-md"
        }`}
      >
        <nav
          aria-label="Main"
          className={`shell flex items-center justify-between gap-4 transition-[height] duration-300 ${
            scrolled ? "h-16" : "h-[4.5rem]"
          }`}
        >
          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className={`${iconButton} -ml-2 lg:hidden`}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo />
          </div>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              if (link.menu) {
                const open = openMenu === "categories";
                return (
                  <li key={link.label} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu("categories")}
                      aria-expanded={open}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 rounded-full px-4 py-2 text-[0.8125rem] font-semibold transition-colors hover:text-white ${
                        open ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className="glass absolute top-full left-1/2 mt-3 w-[30rem] -translate-x-1/2 rounded-3xl bg-ink-900/95 p-3 shadow-card"
                        >
                          <ul className="grid grid-cols-2 gap-1">
                            {categories.map((category) => (
                              <li key={category.slug}>
                                <Link
                                  to={`/shop/${category.slug}`}
                                  className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5"
                                >
                                  <img
                                    {...imageProps(
                                      category.image,
                                      category.imageSource,
                                    )}
                                    alt=""
                                    width="48"
                                    height="48"
                                    loading="lazy"
                                    decoding="async"
                                    className="size-12 rounded-xl object-cover"
                                  />
                                  <span>
                                    <span className="block text-sm font-bold text-white group-hover:text-volt">
                                      {category.name}
                                    </span>
                                    <span className="block text-xs text-mist">
                                      {category.tagline}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              const active = link.isActive(pathname);
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[0.8125rem] font-semibold transition-colors hover:text-white ${
                      active ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-volt"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={iconButton}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={openWishlist}
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? "item" : "items"}`}
              className={`${iconButton} hidden lg:flex`}
            >
              <Heart className="size-5" aria-hidden="true" />
              <Badge count={wishlistCount} />
            </button>

            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => toggleMenu("account")}
                aria-expanded={openMenu === "account"}
                aria-haspopup="true"
                aria-label={
                  isAuthenticated
                    ? `Account menu for ${firstName}`
                    : "Account menu"
                }
                className={`${iconButton} ${isAuthenticated ? "w-auto gap-2 px-3" : ""}`}
              >
                <User className="size-5" aria-hidden="true" />
                {isAuthenticated && (
                  <span className="max-w-24 truncate text-[0.8125rem] font-semibold">
                    {firstName}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {openMenu === "account" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="glass absolute top-full right-0 mt-3 w-60 rounded-3xl bg-ink-900/95 p-2 shadow-card"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="border-b px-4 py-3">
                          <p className="truncate text-sm font-bold text-white">
                            {currentUser.name}
                          </p>
                          <p className="truncate text-xs text-mist">
                            {currentUser.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="mt-1 flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                        >
                          <User className="size-4" aria-hidden="true" /> Account
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-white transition-colors hover:bg-white/5"
                        >
                          <LogOut className="size-4" aria-hidden="true" />{" "}
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 p-2">
                        <Link
                          to="/login"
                          className="flex h-10 items-center justify-center rounded-full bg-volt text-xs font-bold tracking-[0.14em] text-ink-950 uppercase transition-colors hover:bg-white"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="flex h-10 items-center justify-center rounded-full border border-white/20 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:border-white/50"
                        >
                          Signup
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Cart, ${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}`}
              className={`${iconButton} -mr-2 lg:mr-0`}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              <Badge count={totals.itemCount} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu drawer */}
      <Modal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        label="Menu"
        position="left"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Logo onClick={() => setMobileOpen(false)} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto px-5 py-5"
          onClick={(event) => {
            if (event.target.closest("a")) setMobileOpen(false);
          }}
        >
          <ul>
            {NAV_LINKS.filter((link) => !link.menu).map((link, index) => {
              const active = link.isActive(pathname);
              return (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-b py-4 font-display text-lg font-semibold uppercase ${
                      active ? "text-volt" : "text-white"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="size-1.5 rounded-full bg-volt"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          <p className="mt-7 text-[0.6875rem] font-bold tracking-[0.24em] text-mist uppercase">
            Categories
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/shop/${category.slug}`}
                  className="block rounded-xl border px-3 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-volt hover:text-volt"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openWishlist();
            }}
            className="mt-7 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-white"
          >
            <span className="flex items-center gap-3">
              <Heart className="size-4" aria-hidden="true" /> Wishlist
            </span>
            <span className="text-mist">{wishlistCount}</span>
          </button>
        </nav>

        <div className="border-t p-5">
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="mb-3 truncate text-sm text-mist">
                Signed in as{" "}
                <span className="font-bold text-white">{currentUser.name}</span>
              </p>
              <Link
                to="/account"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-volt text-xs font-bold tracking-[0.14em] text-ink-950 uppercase"
              >
                <User className="size-4" aria-hidden="true" /> Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold tracking-[0.14em] text-white uppercase"
              >
                <LogOut className="size-4" aria-hidden="true" /> Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="flex h-11 items-center justify-center rounded-full bg-volt text-xs font-bold tracking-[0.14em] text-ink-950 uppercase"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex h-11 items-center justify-center rounded-full border border-white/20 text-xs font-bold tracking-[0.14em] text-white uppercase"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </Modal>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
