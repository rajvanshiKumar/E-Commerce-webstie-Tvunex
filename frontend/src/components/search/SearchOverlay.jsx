import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Search, SearchX, TrendingUp, X } from 'lucide-react';
import { searchProducts } from '../../api/productApi';
import useDebounce from '../../hooks/useDebounce';
import formatPrice from '../../utils/formatPrice';
import { STORAGE_KEYS, getItem, setItem } from '../../utils/localStorage';
import EmptyState from '../common/EmptyState';
import Modal from '../common/Modal';
import { imageProps } from '../../utils/imageFallback';

const POPULAR_SEARCHES = ['Sneakers', 'Headphones', 'Phone', 'Gaming', 'Leather', 'Lamp'];
const MAX_RECENT = 6;
const MAX_RESULTS = 8;

export default function SearchOverlay({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState(() => getItem(STORAGE_KEYS.RECENT_SEARCHES, []));

  // Only hit the (mock) API once the user pauses typing.
  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setResults([]);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    let active = true;
    setSearching(true);
    searchProducts(debouncedQuery).then((data) => {
      if (!active) return;
      setResults(data);
      setSearching(false);
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const remember = (term) => {
    const clean = term.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    setItem(STORAGE_KEYS.RECENT_SEARCHES, next);
  };

  const clearRecent = () => {
    setRecent([]);
    setItem(STORAGE_KEYS.RECENT_SEARCHES, []);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    remember(term);
    onClose();
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  const handleResultClick = () => {
    remember(query);
    onClose();
  };

  const typing = query.trim().length > 0;
  const waiting = typing && (searching || debouncedQuery !== query.trim());

  return (
    <Modal open={open} onClose={onClose} label="Search products" position="top" className="bg-ink-900/95 backdrop-blur-2xl">
      <div className="shell flex max-h-[100svh] flex-col py-5 sm:py-8">
        <form onSubmit={handleSubmit} role="search" className="flex items-center gap-3 border-b border-white/15 pb-4">
          <Search className="size-6 shrink-0 text-volt" aria-hidden="true" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, categories…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-display text-lg font-medium text-white placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-mist/60 focus:outline-none sm:text-2xl [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="glass flex size-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto pt-6 pb-2" aria-live="polite">
          {!typing && (
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                  <TrendingUp className="size-4" aria-hidden="true" /> Popular searches
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-volt hover:text-volt"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                    <Clock className="size-4" aria-hidden="true" /> Recent searches
                  </h3>
                  {recent.length > 0 && (
                    <button type="button" onClick={clearRecent} className="text-xs font-bold text-mist underline underline-offset-4 hover:text-white">
                      Clear
                    </button>
                  )}
                </div>
                {recent.length === 0 ? (
                  <p className="mt-4 text-sm text-mist">Your recent searches will appear here.</p>
                ) : (
                  <ul className="mt-3">
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/5"
                        >
                          <Clock className="size-4 text-mist" aria-hidden="true" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {waiting && (
            <ul aria-label="Searching" className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <li key={index} aria-hidden="true" className="flex items-center gap-4 rounded-2xl p-2">
                  <div className="shimmer size-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-3 w-2/3 rounded-full" />
                    <div className="shimmer h-3 w-1/3 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {typing && !waiting && results.length === 0 && (
            <EmptyState
              compact
              icon={SearchX}
              title="No search results"
              description={`Nothing matched “${query.trim()}”. Try a different word or browse a category.`}
            />
          )}

          {typing && !waiting && results.length > 0 && (
            <>
              <p className="mb-3 text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {results.slice(0, MAX_RESULTS).map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={handleResultClick}
                      className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5"
                    >
                      <img
                        {...imageProps(product.image, product.imageSource)}
                        alt=""
                        width="64"
                        height="64"
                        loading="lazy"
                        decoding="async"
                        className="size-16 shrink-0 rounded-xl object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white group-hover:text-volt">{product.name}</span>
                        <span className="block text-xs text-mist capitalize">
                          {product.brand} · {product.category}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-white">{formatPrice(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {results.length > MAX_RESULTS && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-volt uppercase hover:text-white"
                >
                  See all {results.length} results <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
