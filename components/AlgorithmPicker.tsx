'use client';

import { motion } from 'motion/react';
import { SortingAlgorithm } from '@/types/sorting';
import { ALGORITHM_ORDER, ALGORITHMS } from '@/lib/algorithms';

interface AlgorithmPickerProps {
  algorithm: SortingAlgorithm;
  disabled?: boolean;
  onChange: (algorithm: SortingAlgorithm) => void;
}

export function AlgorithmPicker({ algorithm, disabled, onChange }: AlgorithmPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ALGORITHM_ORDER.map((id) => {
        const meta = ALGORITHMS[id];
        const isActive = algorithm === id;
        const isChaos = meta.category === 'chaos';

        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            className={`algo-card text-left p-2.5 sm:p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive ? `active ${isChaos ? 'chaos' : ''}` : ''
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="algo-selection"
                className={`pointer-events-none absolute inset-0 rounded-xl ring-2 ${
                  isChaos ? 'ring-amber-400' : 'ring-indigo-500'
                }`}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            <div className="relative flex items-center gap-2">
              <span className="text-lg sm:text-xl leading-none">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
                  {meta.name}
                </div>
                <div className="text-[10px] text-[var(--ink-faint)] font-mono">
                  {meta.timeComplexity.average}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
