import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

const BASE =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none';

const VARIANTS = {
  primary: 'bg-volt text-ink-950 hover:bg-white',
  secondary: 'border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/50 hover:bg-white/10',
  light: 'bg-white text-ink-950 hover:bg-volt',
  dark: 'bg-ink-950 text-white hover:bg-ink-700',
  ghost: 'text-white hover:bg-white/10',
  danger: 'border border-ember/40 text-ember hover:bg-ember hover:text-white',
};

const SIZES = {
  sm: 'h-9 px-4 text-[0.6875rem]',
  md: 'h-11 px-6 text-xs',
  lg: 'h-13 px-8 text-[0.8125rem]',
};

const MotionLink = motion.create(Link);

/**
 * Shared button. Renders a router <Link> when `to` is passed, otherwise a <button>.
 */
export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button',
  disabled,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;
  const motionProps = { whileHover: { y: -2 }, whileTap: { scale: 0.97 } };

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...motionProps} {...rest}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...motionProps}
      {...rest}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  );
}
