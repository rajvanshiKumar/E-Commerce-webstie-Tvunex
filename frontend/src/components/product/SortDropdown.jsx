import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/sortProducts';

/** Native <select> for full keyboard and screen-reader support, styled to match. */
export default function SortDropdown({ value, onChange }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="mr-3 hidden text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase sm:inline">
        Sort by
      </span>
      <span className="sr-only sm:hidden">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 appearance-none rounded-full border border-white/15 bg-ink-900 pr-10 pl-5 text-xs font-bold tracking-wide text-white transition-colors hover:border-white/40 focus:border-volt focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 size-4 text-mist" aria-hidden="true" />
    </label>
  );
}
