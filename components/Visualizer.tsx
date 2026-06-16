'use client';

import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrayItem, VisualizationMode } from '@/types/sorting';
import { SortElement } from './SortElement';

interface VisualizerProps {
  array: ArrayItem[];
  message: string;
  visualizationMode: VisualizationMode;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
}

const MODES: { id: VisualizationMode; label: string; icon: string }[] = [
  { id: 'bars', label: 'Bars', icon: '▮' },
  { id: 'boxes', label: 'Boxes', icon: '▦' },
  { id: 'dots', label: 'Dots', icon: '●' },
];

const LEGEND = [
  { color: 'bg-slate-500', label: 'Idle' },
  { color: 'bg-violet-500', label: 'Compare' },
  { color: 'bg-rose-500', label: 'Swap' },
  { color: 'bg-emerald-500', label: 'Sorted' },
  { color: 'bg-fuchsia-500', label: 'Pivot' },
  { color: 'bg-cyan-500', label: 'Active' },
];

export function Visualizer({
  array,
  message,
  visualizationMode,
  onVisualizationModeChange,
}: VisualizerProps) {
  const maxValue = array.length > 0 ? Math.max(...array.map((i) => i.value)) : 100;

  return (
    <div className="glass-panel flex flex-col h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-white/6">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs sm:text-sm text-slate-300 font-medium truncate min-w-0"
          >
            {message || 'Pick an algorithm and press Play'}
          </motion.p>
        </AnimatePresence>

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
                      className="absolute inset-0 rounded-[9px] bg-gradient-to-r from-violet-600 to-cyan-600"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span>{mode.icon}</span>
                    <span className="hidden xs:inline sm:inline">{mode.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-2 border-b border-white/4 bg-white/[0.015]">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-8">
        {array.length === 0 ? (
          <div className="text-slate-500 text-sm animate-pulse">Loading array…</div>
        ) : (
          <LayoutGroup>
            <div
              className={`w-full h-full max-h-[340px] sm:max-h-[440px] lg:max-h-[500px] flex justify-center ${
                visualizationMode === 'boxes'
                  ? 'flex-wrap gap-2 sm:gap-3 items-center content-center'
                  : visualizationMode === 'dots'
                    ? 'gap-1 sm:gap-1.5 items-end'
                    : 'gap-0.5 sm:gap-1 items-stretch h-full'
              }`}
            >
              {array.map((item) => (
                <SortElement
                  key={item.id}
                  item={item}
                  maxValue={maxValue}
                  visualizationMode={visualizationMode}
                  totalItems={array.length}
                />
              ))}
            </div>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
}
