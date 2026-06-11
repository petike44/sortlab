'use client';

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
    <div className="glass-panel flex flex-col h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] overflow-hidden animate-fade-up">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 sm:px-5 py-3 border-b border-white/6">
        <p className="text-xs sm:text-sm text-slate-300 font-medium truncate order-2 sm:order-1">
          {message || 'Pick an algorithm and press Play'}
        </p>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 order-1 sm:order-2 self-end sm:self-auto">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onVisualizationModeChange(mode.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                visualizationMode === mode.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              <span className="hidden xs:inline sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-2 border-b border-white/4 bg-white/[0.02]">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-8">
        {array.length === 0 ? (
          <div className="text-slate-500 text-sm">Loading array…</div>
        ) : (
          <div
            className={`w-full h-full max-h-[320px] sm:max-h-[400px] lg:max-h-[460px] flex items-end justify-center ${
              visualizationMode === 'boxes'
                ? 'flex-wrap gap-2 sm:gap-3 items-center content-center'
                : visualizationMode === 'dots'
                  ? 'gap-1 sm:gap-1.5 items-end'
                  : 'gap-0.5 sm:gap-1 h-full'
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
        )}
      </div>
    </div>
  );
}
