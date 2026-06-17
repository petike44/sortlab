'use client';

import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrayItem, VisualizationMode, SortStats } from '@/types/sorting';
import { SortElement } from './SortElement';

interface VisualizerProps {
  array: ArrayItem[];
  message: string;
  visualizationMode: VisualizationMode;
  stats: SortStats;
  showStats: boolean;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
}

const MODES: { id: VisualizationMode; label: string; icon: string }[] = [
  { id: 'bars', label: 'Bars', icon: '▮' },
  { id: 'boxes', label: 'Boxes', icon: '▦' },
  { id: 'dots', label: 'Dots', icon: '●' },
];

const LEGEND = [
  { color: 'var(--st-idle)', label: 'Idle' },
  { color: 'var(--st-compare)', label: 'Compare' },
  { color: 'var(--st-swap)', label: 'Swap' },
  { color: 'var(--st-sorted)', label: 'Sorted' },
  { color: 'var(--st-pivot)', label: 'Pivot' },
  { color: 'var(--st-active)', label: 'Active' },
];

export function Visualizer({
  array,
  message,
  visualizationMode,
  stats,
  showStats,
  onVisualizationModeChange,
}: VisualizerProps) {
  const maxValue = array.length > 0 ? Math.max(...array.map((i) => i.value)) : 100;

  return (
    <div className="card flex flex-col h-full min-h-[300px] sm:min-h-[400px] overflow-hidden">
      {/* Frame header — legend + mode switcher */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 border-b border-[var(--line)]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] sm:text-[11px] text-[var(--ink-muted)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <LayoutGroup id="viz-mode">
          <div className="segmented shrink-0">
            {MODES.map((mode) => {
              const active = visualizationMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  data-active={active}
                  onClick={() => onVisualizationModeChange(mode.id)}
                  className="relative px-2.5 sm:px-3 py-1.5"
                >
                  {active && (
                    <motion.span
                      layoutId="viz-mode-pill"
                      className="absolute inset-0 rounded-[7px] bg-[var(--accent)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span>{mode.icon}</span>
                    <span className="hidden sm:inline">{mode.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Canvas */}
      <div className="canvas-grid flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-8">
        {array.length === 0 ? (
          <div className="text-[var(--ink-faint)] text-sm animate-pulse">Loading array…</div>
        ) : (
          <LayoutGroup>
            <div
              className={`w-full h-full max-h-[340px] sm:max-h-[460px] lg:max-h-[560px] flex justify-center ${
                visualizationMode === 'boxes'
                  ? 'flex-wrap gap-2 sm:gap-3 items-center content-center'
                  : visualizationMode === 'dots'
                    ? 'gap-1 sm:gap-1.5 items-end'
                    : 'gap-0.5 sm:gap-1 items-stretch h-full'
              }`}
            >
              {(() => {
                // Item ids are globally unique, but some algorithms (e.g. counting
                // sort) transiently render an item and its placed copy in the same
                // frame. De-dupe keys so React/Framer layout stays valid; unique ids
                // keep their identity so swap-slide animations still work.
                const seen = new Set<string>();
                return array.map((item, idx) => {
                  const key = seen.has(item.id) ? `${item.id}__${idx}` : item.id;
                  seen.add(item.id);
                  return (
                    <SortElement
                      key={key}
                      item={item}
                      maxValue={maxValue}
                      visualizationMode={visualizationMode}
                      totalItems={array.length}
                    />
                  );
                });
              })()}
            </div>
          </LayoutGroup>
        )}
      </div>

      {/* Status caption + live stats */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 border-t border-[var(--line)] bg-[var(--paper-2)]">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium truncate min-w-0"
          >
            {message || 'Pick an algorithm and press Play'}
          </motion.p>
        </AnimatePresence>

        {showStats && (
          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
            <span className="chip-mono">
              <span className="text-[var(--st-compare)]">●</span> {stats.comparisons} comp
            </span>
            <span className="chip-mono">
              <span className="text-[var(--st-swap)]">●</span> {stats.swaps} swaps
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
