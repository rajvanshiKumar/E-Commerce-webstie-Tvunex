import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

/** Friendly placeholder for empty lists (cart, wishlist, search, filters…). */
export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action = null,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mx-auto flex max-w-md flex-col items-center text-center ${compact ? 'py-10' : 'py-20'}`}
    >
      <div className="relative mb-6 flex size-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-volt/10 blur-xl" aria-hidden="true" />
        <span className="glass relative flex size-20 items-center justify-center rounded-full text-volt">
          <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
      <h2 className="font-display text-lg font-semibold tracking-tight text-white uppercase">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-mist">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
