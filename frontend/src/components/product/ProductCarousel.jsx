import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

/**
 * Horizontal product rail. Native scroll-snap gives touch swiping on mobile;
 * the arrow buttons page the rail on desktop.
 */
export default function ProductCarousel({ products = [], loading = false, label = 'Products' }) {
  const trackRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ prev: false, next: false });

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanScroll({ prev: track.scrollLeft > 4, next: track.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, products.length, loading]);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: 'smooth' });
  };

  const slideClasses = 'w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.4%]';

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={updateArrows}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pt-2 pb-4 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0"
      >
        {loading
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index} className={slideClasses}>
                <ProductSkeleton />
              </li>
            ))
          : products.map((product) => (
              <li key={product.id} className={slideClasses}>
                <ProductCard product={product} />
              </li>
            ))}
      </ul>

      {!loading && (
        <div className="mt-2 hidden justify-end gap-2 lg:flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScroll.prev}
            aria-label={`Previous ${label}`}
            className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScroll.next}
            aria-label={`Next ${label}`}
            className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
