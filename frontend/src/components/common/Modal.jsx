import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/* One overlay primitive for the whole app: centred dialogs (Quick View),
   side drawers (cart, wishlist, mobile menu, filters) and the top search sheet. */
const POSITIONS = {
  center: {
    wrap: 'items-end justify-center sm:items-center sm:p-6',
    panel: 'w-full max-w-4xl max-h-[92svh] rounded-t-3xl sm:rounded-3xl',
    initial: { opacity: 0, y: 32, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  right: {
    wrap: 'justify-end',
    panel: 'h-full w-full max-w-md border-l',
    initial: { x: '100%' },
    animate: { x: 0 },
  },
  left: {
    wrap: 'justify-start',
    panel: 'h-full w-[88%] max-w-sm border-r',
    initial: { x: '-100%' },
    animate: { x: 0 },
  },
  top: {
    wrap: 'items-start justify-center',
    panel: 'w-full max-h-[100svh] border-b',
    initial: { opacity: 0, y: -32 },
    animate: { opacity: 1, y: 0 },
  },
};

export default function Modal({ open, onClose, label, position = 'center', className = '', children }) {
  const panelRef = useRef(null);
  const config = POSITIONS[position] ?? POSITIONS.center;

  // Lock page scroll, close on Escape, and return focus to the trigger on close.
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const focusTimer = window.setTimeout(() => {
      if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
        panelRef.current.focus();
      }
    }, 30);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[70] flex ${config.wrap}`}>
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={config.initial}
            animate={config.animate}
            exit={config.initial}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className={`relative flex flex-col overflow-hidden bg-ink-900 shadow-card outline-none ${config.panel} ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
