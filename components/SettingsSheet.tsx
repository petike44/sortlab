'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SettingsSheet({ open, onClose, children }: SettingsSheetProps) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="absolute inset-0 bg-[var(--ink)]/30 backdrop-blur-[2px]"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto bg-[var(--card)] border-t border-[var(--line)] rounded-t-3xl px-4 pt-3 pb-8 shadow-[0_-12px_40px_-20px_rgba(23,23,27,0.4)]"
          >
            <div className="sticky top-0 -mx-4 -mt-3 px-4 pt-3 pb-3 bg-[var(--card)] z-10 flex flex-col items-center border-b border-[var(--line)]">
              <span className="h-1.5 w-12 rounded-full bg-[var(--line-strong)]" />
              <div className="mt-3 w-full flex items-center justify-between">
                <h2 className="text-sm font-semibold font-display">Settings</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="btn-icon h-8 w-8 text-base"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="mt-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
