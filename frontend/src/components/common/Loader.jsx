/** Spinner. `fullPage` centres it in the viewport (used as the route fallback). */
export default function Loader({ fullPage = false, label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 ${fullPage ? 'min-h-[70svh]' : 'py-16'}`}
    >
      <span className="relative flex size-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-volt" />
        <span className="size-2 rounded-full bg-volt" />
      </span>
      <span className="text-[0.6875rem] font-bold tracking-[0.3em] text-mist uppercase">{label}</span>
    </div>
  );
}
