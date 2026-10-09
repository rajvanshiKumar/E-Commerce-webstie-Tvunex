import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — PRAHARX';
  }, []);

  return (
    <div className="shell relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/10 blur-[120px]" />
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        className="relative font-display text-[7rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_var(--color-volt)] sm:text-[12rem]"
      >
        404
      </motion.p>
      <h1 className="display relative mt-4 text-2xl text-white sm:text-4xl">Page not found</h1>
      <p className="relative mt-4 max-w-md text-base text-mist">
        The page you are looking for has moved, or never existed. Let’s get you back to the good stuff.
      </p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" size="lg">
          Back to home
        </Button>
        <Button to="/shop" size="lg" variant="secondary">
          Browse the shop
        </Button>
      </div>
    </div>
  );
}
