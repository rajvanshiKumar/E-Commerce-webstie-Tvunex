import { Link } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import { countActiveFilters } from '../../utils/filterProducts';
import formatPrice from '../../utils/formatPrice';
import Button from '../common/Button';
import Modal from '../common/Modal';

const RATING_OPTIONS = [4.5, 4, 3];
const DISCOUNT_OPTIONS = [10, 25, 40];

function Group({ title, children }) {
  return (
    <fieldset className="border-t py-5 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 w-full text-[0.6875rem] font-bold tracking-[0.2em] text-white uppercase">
        {title}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Choice({ type = 'checkbox', name, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm text-mist transition-colors hover:text-white has-checked:text-white">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-volt"
      />
      <span className="flex flex-1 items-center gap-1.5">{children}</span>
    </label>
  );
}

function FilterControls({ filters, onChange, onReset, categories, activeCategory, brands, priceBounds, idPrefix }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const priceValue = filters.maxPrice ?? priceBounds.max;
  const activeCount = countActiveFilters(filters);

  const toggleBrand = (brand) =>
    set({
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((item) => item !== brand)
        : [...filters.brands, brand],
    });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight text-white uppercase">
          Filters{activeCount > 0 && <span className="ml-2 text-volt">({activeCount})</span>}
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-xs font-bold text-mist underline underline-offset-4 transition-colors hover:text-white disabled:opacity-40 disabled:hover:text-mist"
        >
          Clear all
        </button>
      </div>

      {/* Category — navigates, so the URL stays the single source of truth */}
      <Group title="Category">
        <ul className="space-y-0.5">
          <li>
            <Link
              to="/shop"
              aria-current={!activeCategory ? 'page' : undefined}
              className={`flex justify-between rounded-lg py-1.5 text-sm transition-colors hover:text-white ${
                !activeCategory ? 'font-bold text-volt' : 'text-mist'
              }`}
            >
              All products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/shop/${category.slug}`}
                aria-current={activeCategory === category.slug ? 'page' : undefined}
                className={`flex justify-between rounded-lg py-1.5 text-sm transition-colors hover:text-white ${
                  activeCategory === category.slug ? 'font-bold text-volt' : 'text-mist'
                }`}
              >
                {category.name}
                <span className="text-xs opacity-60">{category.productCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Price">
        <label htmlFor={`${idPrefix}-price`} className="flex justify-between text-sm text-mist">
          <span>Up to</span>
          <span className="font-bold text-white">{formatPrice(priceValue)}</span>
        </label>
        <input
          id={`${idPrefix}-price`}
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={Math.max(100, Math.round((priceBounds.max - priceBounds.min) / 50 / 100) * 100)}
          value={priceValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            set({ maxPrice: next >= priceBounds.max ? null : next });
          }}
          className="mt-3 w-full accent-volt"
        />
        <div className="mt-1 flex justify-between text-xs text-mist/70">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
      </Group>

      {brands.length > 0 && (
        <Group title="Brand">
          <div className="max-h-52 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <Choice key={brand} checked={filters.brands.includes(brand)} onChange={() => toggleBrand(brand)}>
                {brand}
              </Choice>
            ))}
          </div>
        </Group>
      )}

      <Group title="Rating">
        <Choice type="radio" name={`${idPrefix}-rating`} checked={filters.minRating === 0} onChange={() => set({ minRating: 0 })}>
          Any rating
        </Choice>
        {RATING_OPTIONS.map((rating) => (
          <Choice
            key={rating}
            type="radio"
            name={`${idPrefix}-rating`}
            checked={filters.minRating === rating}
            onChange={() => set({ minRating: rating })}
          >
            {rating}
            <Star className="size-3.5 fill-volt text-volt" aria-hidden="true" />
            <span>&amp; up</span>
          </Choice>
        ))}
      </Group>

      <Group title="Discount">
        <Choice type="radio" name={`${idPrefix}-discount`} checked={filters.minDiscount === 0} onChange={() => set({ minDiscount: 0 })}>
          Any discount
        </Choice>
        {DISCOUNT_OPTIONS.map((discount) => (
          <Choice
            key={discount}
            type="radio"
            name={`${idPrefix}-discount`}
            checked={filters.minDiscount === discount}
            onChange={() => set({ minDiscount: discount })}
          >
            {discount}% off or more
          </Choice>
        ))}
      </Group>

      <Group title="Availability">
        <Choice checked={filters.inStockOnly} onChange={() => set({ inStockOnly: !filters.inStockOnly })}>
          In stock only
        </Choice>
      </Group>
    </div>
  );
}

/**
 * Product filters. Desktop: sticky sidebar. Mobile/tablet: slide-in drawer.
 * Filtering itself is done by the parent with utils/filterProducts.
 */
export default function FilterSidebar({ mobileOpen, onMobileClose, resultCount, ...controls }) {
  return (
    <>
      <aside aria-label="Product filters" className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto rounded-3xl border bg-ink-900 p-6">
          <FilterControls {...controls} idPrefix="desktop-filter" />
        </div>
      </aside>

      <Modal open={mobileOpen} onClose={onMobileClose} label="Product filters" position="left">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="eyebrow">Refine</span>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close filters"
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterControls {...controls} idPrefix="mobile-filter" />
        </div>
        <div className="border-t p-5">
          <Button fullWidth onClick={onMobileClose}>
            Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
