import { BadgeCheck, Quote, Star } from 'lucide-react';
import { imageProps } from '../../utils/imageFallback';

/** Five-star rating row, shared by product cards, Quick View, product details and reviews. */
export function Rating({ value, size = 14, className = '' }) {
  const rounded = Math.round(value);
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          width={size}
          height={size}
          aria-hidden="true"
          className={star <= rounded ? 'fill-volt text-volt' : 'fill-white/10 text-white/10'}
        />
      ))}
    </span>
  );
}

export default function ReviewCard({ review }) {
  return (
    <figure className="glass group relative flex h-full flex-col rounded-3xl p-6 transition-colors duration-300 hover:border-white/25 sm:p-7">
      <Quote className="absolute top-6 right-6 size-8 text-white/10 transition-colors group-hover:text-volt/40" aria-hidden="true" />
      <Rating value={review.rating} size={16} />
      <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-zinc-200">
        “{review.text}”
      </blockquote>
      {review.product && (
        <p className="mt-4 text-[0.6875rem] font-bold tracking-[0.18em] text-mist uppercase">
          Purchased: <span className="text-white">{review.product}</span>
        </p>
      )}
      <figcaption className="mt-5 flex items-center gap-3 border-t pt-5">
        <img
          {...imageProps(review.avatar)}
          alt=""
          loading="lazy"
          decoding="async"
          width="44"
          height="44"
          className="size-11 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{review.name}</p>
          <p className="truncate text-xs text-mist">{review.location}</p>
        </div>
        {review.verified && (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-volt/10 px-2.5 py-1 text-[0.625rem] font-bold tracking-wider text-volt uppercase">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Verified
          </span>
        )}
      </figcaption>
    </figure>
  );
}
