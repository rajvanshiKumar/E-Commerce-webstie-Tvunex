import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { getBanners } from '../../api/mockApi';
import { imageProps } from '../../utils/imageFallback';
import Button from '../common/Button';
import HeroSkeleton from './HeroSkeleton';

const AUTOPLAY_MS = 6000;

const textVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Subtle pointer parallax on the visual
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const imageX = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const chipX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const chipY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    let active = true;
    getBanners().then((data) => {
      if (!active) return;
      setBanners(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const count = banners.length;
  const goTo = useCallback((next) => setIndex((next + count) % count), [count]);
  const next = useCallback(() => setIndex((current) => (current + 1) % count), [count]);
  const previous = useCallback(() => setIndex((current) => (current - 1 + count) % count), [count]);

  // Auto-slide; the timer restarts whenever the slide changes and stops while paused.
  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count, next]);

  if (loading) return <HeroSkeleton />;
  if (!count) return null;

  const banner = banners[index];

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    setPaused(false);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-ink-900"
    >
      {/* Cinematic full-bleed photo. Loaded eagerly: it is the page's main image. */}
      <motion.div style={{ x: imageX, y: imageY }} className="absolute -inset-4 -z-10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={banner.id}
            {...imageProps(banner.photo.src, banner.photo.remote)}
            alt={banner.photo.alt}
            width={banner.photo.width}
            height={banner.photo.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
      </motion.div>

      {/* Contrast layers so the headline stays readable on any photo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/35 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/80 lg:to-ink-950/10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      <motion.div
        aria-hidden="true"
        animate={{ backgroundColor: banner.accent }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-[-30%] left-[-10%] -z-10 size-[38rem] rounded-full opacity-[0.14] blur-[130px]"
      />

      <div className="shell relative flex min-h-[36rem] flex-col justify-end pt-24 pb-10 sm:min-h-[40rem] lg:min-h-[44rem] lg:justify-center lg:py-20">
        <div className="max-w-2xl" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={banner.id} initial="hidden" animate="visible" exit="exit">
              <motion.p custom={0} variants={textVariants} className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-volt" aria-hidden="true" />
                {banner.eyebrow}
              </motion.p>
              <motion.h1
                custom={1}
                variants={textVariants}
                className="display mt-5 text-[2.1rem] text-balance text-white drop-shadow-[0_2px_24px_rgb(0_0_0/0.5)] sm:text-5xl xl:text-[4.25rem]"
              >
                {banner.title}
              </motion.h1>
              <motion.p custom={2} variants={textVariants} className="mt-5 max-w-md text-base text-zinc-200 sm:text-lg">
                {banner.subtitle}
              </motion.p>
              <motion.div custom={3} variants={textVariants} className="mt-8 flex flex-wrap gap-3">
                <Button to={banner.primaryCta.to} size="lg">
                  {banner.primaryCta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button to={banner.secondaryCta.to} size="lg" variant="secondary">
                  {banner.secondaryCta.label}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-5 lg:mt-14">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous slide"
              className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="glass flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-ink-950"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
            {banners.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}: ${item.eyebrow}`}
                aria-current={dotIndex === index ? 'true' : undefined}
                className="group flex h-6 items-center"
              >
                <span
                  className={`relative block h-1 overflow-hidden rounded-full transition-all duration-500 ${
                    dotIndex === index ? 'w-12 bg-white/25' : 'w-4 bg-white/25 group-hover:bg-white/60'
                  }`}
                >
                  {dotIndex === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-0 origin-left bg-volt"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <span className="font-display text-xs tracking-widest text-zinc-300 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>

          <p className="ml-auto hidden text-right sm:block">
            <span className="block font-display text-3xl font-bold text-white">{banner.stat.value}</span>
            <span className="mt-1 block text-[0.6875rem] font-semibold tracking-[0.18em] text-zinc-300 uppercase">
              {banner.stat.label}
            </span>
          </p>
        </div>

        {/* Floating glass chips */}
        <motion.div style={{ x: chipX, y: chipY }} className="absolute top-28 right-10 hidden xl:block">
          <div className="glass float-slow flex items-center gap-3 rounded-2xl bg-ink-900/60 px-4 py-3 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink-950">
              <Truck className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-bold text-white">Free delivery</span>
              <span className="block text-[0.6875rem] text-zinc-300">on orders over ₹999</span>
            </span>
          </div>
        </motion.div>
        <motion.div style={{ x: chipX, y: chipY }} className="absolute right-40 bottom-44 hidden xl:block">
          <div className="glass float-fast flex items-center gap-3 rounded-2xl bg-ink-900/60 px-4 py-3 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-ink-950">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-bold text-white">Secure checkout</span>
              <span className="block text-[0.6875rem] text-zinc-300">7-day easy returns</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
