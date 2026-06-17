'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SortingAlgorithm } from '@/types/sorting';
import { ALGORITHMS } from '@/lib/algorithms';
import { AlgorithmPicker } from './AlgorithmPicker';

interface AlgorithmMenuProps {
  algorithm: SortingAlgorithm;
  disabled?: boolean;
  onChange: (algorithm: SortingAlgorithm) => void;
}

export function AlgorithmMenu({ algorithm, disabled, onChange }: AlgorithmMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const meta = ALGORITHMS[algorithm];

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleChange = (id: SortingAlgorithm) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-ghost h-9 pl-2.5 pr-3 gap-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-base leading-none">{meta.emoji}</span>
        <span className="max-w-[42vw] truncate">{meta.name}</span>
        <span className={`text-[var(--ink-faint)] transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="card absolute right-0 z-50 mt-2 w-[min(92vw,440px)] p-3 origin-top-right max-h-[70vh] overflow-y-auto"
          >
            <p className="section-label mb-2.5 px-0.5">Choose algorithm</p>
            <AlgorithmPicker algorithm={algorithm} disabled={disabled} onChange={handleChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
