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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto glass-panel rounded-b-none rounded-t-3xl border-b-0 px-4 pt-3 pb-8"
          >
            <div className="sticky top-0 -mx-4 -mt-3 px-4 pt-3 pb-3 bg-gradient-to-b from-[#14172480] to-transparent backdrop-blur-md z-10 flex flex-col items-center">
              <span className="h-1.5 w-12 rounded-full bg-white/20" />
              <div className="mt-3 w-full flex items-center justify-between">
                <h2 className="text-sm font-semibold">Settings</h2>
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
