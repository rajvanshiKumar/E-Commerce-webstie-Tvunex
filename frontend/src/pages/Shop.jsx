import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { getCategories } from '../api/categoryApi';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import FilterSidebar from '../components/product/FilterSidebar';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/product/SortDropdown';
import useProducts from '../hooks/useProducts';
import filterProducts, { DEFAULT_FILTERS, countActiveFilters } from '../utils/filterProducts';
import sortProducts from '../utils/sortProducts';

/**
 * The ONE shop page. /shop shows everything, /shop/:category shows a category.
 * The UI never changes — only the data requested from the mock API does.
 */
export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = category ? '' : (searchParams.get('q') ?? '').trim();

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { products, loading } = useProducts({ category, query: query || undefined });

  useEffect(() => {
    let active = true;
    getCategories().then((data) => {
      if (!active) return;
      setCategories(data);
      setCategoriesLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // A different category or search is a fresh browse: reset filters and sorting.
  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setSortBy('featured');
    setMobileFiltersOpen(false);
  }, [category, query]);

  const currentCategory = categories.find((item) => item.slug === category);
  const unknownCategory = Boolean(category) && categoriesLoaded && !currentCategory;

  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort(), [products]);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 1000 };
    const prices = products.map((product) => product.price);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [products]);

  const visibleProducts = useMemo(
    () => sortProducts(filterProducts(products, filters), sortBy),
    [products, filters, sortBy],
  );

  const activeFilterCount = countActiveFilters(filters);
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const title = query ? `Results for “${query}”` : (currentCategory?.name ?? (category ? 'Shop' : 'All products'));
  const subtitle = query
    ? 'Products matching your search.'
    : (currentCategory?.tagline ?? 'Everything in the PraharX store, in one place.');

  useEffect(() => {
    document.title = `${query ? `Search: ${query}` : (currentCategory?.name ?? 'Shop')} — PRAHARX`;
  }, [query, currentCategory]);

  if (unknownCategory) {
    return (
      <div className="shell">
        <EmptyState
          icon={SearchX}
          title="Category not found"
          description={`We could not find a category called “${category}”.`}
          action={<Button to="/shop">Browse all products</Button>}
        />
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <header className="relative overflow-hidden border-b">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 size-[32rem] rounded-full bg-volt/10 blur-[120px]" />
        <div className="shell relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-mist">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                {category || query ? (
                  <Link to="/shop" className="transition-colors hover:text-white">
                    Shop
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    Shop
                  </span>
                )}
              </li>
              {(category || query) && (
                <>
                  <li aria-hidden="true">
                    <ChevronRight className="size-3.5" />
                  </li>
                  <li aria-current="page" className="text-white">
                    {query ? 'Search' : (currentCategory?.name ?? category)}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <p className="eyebrow mt-6">{query ? 'Search' : category ? 'Category' : 'The full store'}</p>
          <h1 className="display mt-3 text-3xl text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm text-mist sm:text-base">{subtitle}</p>
          {query && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-ember hover:text-ember"
            >
              <X className="size-3.5" aria-hidden="true" /> Clear search
            </button>
          )}
        </div>
      </header>

      <div className="shell py-8 sm:py-10">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            categories={categories}
            activeCategory={category}
            brands={brands}
            priceBounds={priceBounds}
            resultCount={visibleProducts.length}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <div className="min-w-0 flex-1">
            {/* Toolbar: filter (mobile) + count + sort */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-xs font-bold tracking-wide text-white transition-colors hover:border-white/40 lg:hidden"
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-volt text-[0.625rem] font-extrabold text-ink-950">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-mist" role="status">
                  {loading ? (
                    'Loading products…'
                  ) : (
                    <>
                      <span className="font-bold text-white">{visibleProducts.length}</span>{' '}
                      {visibleProducts.length === 1 ? 'product' : 'products'}
                    </>
                  )}
                </p>
              </div>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {!loading && visibleProducts.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No products found"
                description={
                  activeFilterCount > 0
                    ? 'No products match these filters. Try removing one or two.'
                    : 'There is nothing here yet. Try another category.'
                }
                action={
                  activeFilterCount > 0 ? (
                    <Button onClick={resetFilters}>Clear filters</Button>
                  ) : (
                    <Button to="/shop">Browse all products</Button>
                  )
                }
              />
            ) : (
              <ProductGrid products={visibleProducts} loading={loading} skeletonCount={12} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
