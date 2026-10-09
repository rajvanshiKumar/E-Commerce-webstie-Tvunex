/** Shimmer placeholder shown while banner data loads. Mirrors HeroBanner's layout. */
export default function HeroSkeleton() {
  return (
    <section aria-hidden="true" className="relative overflow-hidden bg-ink-900">
      <div className="shimmer absolute inset-0 opacity-60" />
      <div className="shell relative flex min-h-[36rem] flex-col justify-end pt-24 pb-10 sm:min-h-[40rem] lg:min-h-[44rem] lg:justify-center lg:py-20">
        <div className="max-w-2xl space-y-5">
          <div className="h-3 w-36 rounded-full bg-white/10" />
          <div className="h-12 w-11/12 rounded-2xl bg-white/10 sm:h-16" />
          <div className="h-12 w-8/12 rounded-2xl bg-white/10 sm:h-16" />
          <div className="h-4 w-7/12 rounded-full bg-white/10" />
          <div className="flex gap-3 pt-3">
            <div className="h-13 w-40 rounded-full bg-white/10" />
            <div className="h-13 w-36 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
