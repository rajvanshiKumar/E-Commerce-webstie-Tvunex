import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '../../api/mockApi';
import ReviewCard from './ReviewCard';

/** Customer reviews carousel (swipe on touch, arrows on desktop). */
export default function Reviews({ title = 'Loved by shoppers', eyebrow = 'Customer reviews', limit }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    let active = true;
    getReviews().then((data) => {
      if (!active) return;
      setReviews(limit ? data.slice(0, limit) : data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [limit]);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  };

  const slideClasses = 'w-[86%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]';

  return (
    <section aria-labelledby="reviews-title" className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-end justify-between gap-4 sm:mb-10"
        >
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="reviews-title" className="display mt-3 text-2xl text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Previous reviews"
              className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Next reviews"
              className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </motion.header>

        <ul
          ref={trackRef}
          aria-label="Customer reviews"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0"
        >
          {loading
            ? Array.from({ length: 3 }, (_, index) => (
                <li key={index} className={slideClasses} aria-hidden="true">
                  <div className="shimmer h-64 rounded-3xl" />
                </li>
              ))
            : reviews.map((review) => (
                <li key={review.id} className={slideClasses}>
                  <ReviewCard review={review} />
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
