import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

/* ------------------------------------------------------------------
   Tiny toast store. Any module (components, contexts, plain functions)
   can call toast.success("…") — <Toast /> is rendered once in Layout.
------------------------------------------------------------------- */
let toasts = [];
let nextId = 1;
const listeners = new Set();
const MAX_VISIBLE = 4;

const emit = () => listeners.forEach((listener) => listener());

function dismiss(id) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

function push(type, message, duration = 3200) {
  const id = nextId++;
  toasts = [...toasts, { id, type, message }].slice(-MAX_VISIBLE);
  emit();
  window.setTimeout(() => dismiss(id), duration);
  return id;
}

export const toast = {
  success: (message, duration) => push('success', message, duration),
  error: (message, duration) => push('error', message, duration ?? 4200),
  info: (message, duration) => push('info', message, duration),
  dismiss,
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => toasts;

const STYLES = {
  success: { icon: CircleCheck, tone: 'text-volt' },
  error: { icon: CircleAlert, tone: 'text-ember' },
  info: { icon: Info, tone: 'text-sky-300' },
};

export default function Toast() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start"
    >
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const { icon: Icon, tone } = STYLES[item.type] ?? STYLES.info;
          return (
            <motion.div
              key={item.id}
              layout
              role={item.type === 'error' ? 'alert' : 'status'}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink-800/90 px-4 py-3 shadow-card"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${tone}`} aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-white">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="-mr-1 rounded-full p-1 text-mist transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
