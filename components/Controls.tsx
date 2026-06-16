'use client';

import { motion, AnimatePresence } from 'motion/react';
import { SortingAlgorithm, PlaybackState, ArrayPreset, SortStats } from '@/types/sorting';
import { ALGORITHMS } from '@/lib/algorithms';
import { AlgorithmPicker } from './AlgorithmPicker';

interface ControlsProps {
  algorithm: SortingAlgorithm;
  arraySize: number;
  maxArraySize: number;
  preset: ArrayPreset;
  playback: PlaybackState;
  stats: SortStats;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  onArraySizeChange: (size: number) => void;
  onPresetChange: (preset: ArrayPreset) => void;
  onSpeedChange: (speed: number) => void;
}

const PRESETS: { id: ArrayPreset; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'reversed', label: 'Reversed' },
  { id: 'nearly-sorted', label: 'Nearly sorted' },
  { id: 'few-unique', label: 'Few unique' },
];

export function Controls({
  algorithm,
  arraySize,
  maxArraySize,
  preset,
  playback,
  stats,
  onAlgorithmChange,
  onArraySizeChange,
  onPresetChange,
  onSpeedChange,
}: ControlsProps) {
  const meta = ALGORITHMS[algorithm];
  const busy = playback.isPlaying;

  return (
    <div className="flex flex-col gap-5">
      {/* Algorithm picker */}
      <section>
        <h2 className="section-label mb-2.5">Algorithm</h2>
        <AlgorithmPicker algorithm={algorithm} disabled={busy} onChange={onAlgorithmChange} />
      </section>

      {/* Info card — animates on algorithm change */}
      <AnimatePresence mode="wait">
        <motion.section
          key={algorithm}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="surface-soft p-3.5"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{meta.emoji}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base">{meta.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{meta.description}</p>
              {meta.funFact && (
                <p className="text-[11px] text-violet-300/80 mt-2 italic">{meta.funFact}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/6">
            <Metric label="Avg time" value={meta.timeComplexity.average} className="text-cyan-400" />
            <Metric label="Space" value={meta.spaceComplexity} className="text-violet-400" />
            <Metric label="Type" value={meta.category} className="text-slate-300 capitalize" />
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Stats */}
      {playback.totalSteps > 0 && (
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Comparisons" value={stats.comparisons} className="text-violet-300" />
          <StatCard label="Swaps" value={stats.swaps} className="text-rose-300" />
        </section>
      )}

      {/* Presets */}
      <section>
        <h2 className="section-label mb-2.5">Array pattern</h2>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => onPresetChange(p.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-40 ${
                preset === p.id
                  ? 'bg-violet-600/80 text-white shadow-md shadow-violet-600/20'
                  : 'btn-ghost'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <section className="space-y-5">
        <Slider
          label="Array size"
          value={arraySize}
          min={2}
          max={maxArraySize}
          disabled={busy}
          accent="text-cyan-400"
          onChange={onArraySizeChange}
          note={
            algorithm === 'bogo'
              ? `Bogo sort capped at ${maxArraySize} elements — for your sanity`
              : undefined
          }
        />
        <Slider
          label="Speed"
          value={playback.speed}
          suffix="%"
          min={1}
          max={100}
          accent="text-violet-400"
          onChange={onSpeedChange}
        />
      </section>
    </div>
  );
}

function Metric({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-mono font-semibold ${className}`}>{value}</div>
    </div>
  );
}

function StatCard({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="surface-soft px-3 py-2.5 text-center">
      <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
      <motion.div
        key={value}
        initial={{ scale: 1.15, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`text-lg font-mono font-bold tabular-nums ${className}`}
      >
        {value}
      </motion.div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix = '',
  accent,
  disabled,
  note,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  accent: string;
  disabled?: boolean;
  note?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="section-label">{label}</label>
        <span className={`text-lg font-mono font-bold tabular-nums ${accent}`}>
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      {note && <p className="text-[10px] text-amber-400/80 mt-1.5">{note}</p>}
    </div>
  );
}
