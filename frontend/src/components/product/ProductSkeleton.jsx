/** Shimmer placeholder with the same footprint as ProductCard. */
export default function ProductSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-2xl border bg-ink-900 sm:rounded-3xl">
      <div className="shimmer aspect-square w-full" />
      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
        <div className="shimmer h-2.5 w-1/3 rounded-full" />
        <div className="shimmer h-4 w-4/5 rounded-full" />
        <div className="shimmer h-3 w-1/2 rounded-full" />
        <div className="shimmer mt-1 h-5 w-2/5 rounded-full" />
        <div className="shimmer mt-2 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
