'use client';

import { motion, AnimatePresence } from 'motion/react';
import { SortingAlgorithm, PlaybackState, ArrayPreset, SortStats } from '@/types/sorting';
import { ALGORITHMS } from '@/lib/algorithms';

const PRESETS: { id: ArrayPreset; label: string; short: string }[] = [
  { id: 'random', label: 'Random', short: 'Rand' },
  { id: 'reversed', label: 'Reversed', short: 'Rev' },
  { id: 'nearly-sorted', label: 'Nearly sorted', short: 'Near' },
  { id: 'few-unique', label: 'Few unique', short: 'Few' },
];

/* ============================================================
 * ParamControls — size / speed / pattern.
 * `variant="dock"` lays out horizontally for the desktop dock;
 * `variant="sheet"` stacks vertically for the mobile settings sheet.
 * ============================================================ */
interface ParamControlsProps {
  algorithm: SortingAlgorithm;
  arraySize: number;
  maxArraySize: number;
  preset: ArrayPreset;
  playback: PlaybackState;
  variant?: 'dock' | 'sheet';
  onArraySizeChange: (size: number) => void;
  onPresetChange: (preset: ArrayPreset) => void;
  onSpeedChange: (speed: number) => void;
}

export function ParamControls({
  algorithm,
  arraySize,
  maxArraySize,
  preset,
  playback,
  variant = 'sheet',
  onArraySizeChange,
  onPresetChange,
  onSpeedChange,
}: ParamControlsProps) {
  const busy = playback.isPlaying;
  const sizeNote =
    algorithm === 'bogo' ? `Bogo capped at ${maxArraySize} — for your sanity` : undefined;

  if (variant === 'dock') {
    return (
      <div className="flex items-center gap-4">
        <CompactSlider
          label="Size"
          value={arraySize}
          min={2}
          max={maxArraySize}
          disabled={busy}
          onChange={onArraySizeChange}
        />
        <CompactSlider
          label="Speed"
          value={playback.speed}
          suffix="%"
          min={1}
          max={100}
          onChange={onSpeedChange}
        />
        <div className="flex flex-col gap-1">
          <span className="section-label">Pattern</span>
          <div className="segmented">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-active={preset === p.id}
                disabled={busy}
                onClick={() => onPresetChange(p.id)}
                className={`px-2.5 py-1 rounded-[7px] disabled:opacity-40 ${
                  preset === p.id ? 'bg-[var(--accent)] text-white' : ''
                }`}
              >
                {p.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // sheet (stacked)
  return (
    <div className="flex flex-col gap-5">
      <section>
        <h2 className="section-label mb-2.5">Array pattern</h2>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => onPresetChange(p.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
                preset === p.id ? 'bg-[var(--accent)] text-white' : 'btn-ghost'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <Slider
          label="Array size"
          value={arraySize}
          min={2}
          max={maxArraySize}
          disabled={busy}
          onChange={onArraySizeChange}
          note={sizeNote}
        />
        <Slider
          label="Speed"
          value={playback.speed}
          suffix="%"
          min={1}
          max={100}
          onChange={onSpeedChange}
        />
      </section>
    </div>
  );
}

/* ============================================================
 * AlgorithmInfo — description, fun fact, complexity table.
 * Used in the mobile settings sheet.
 * ============================================================ */
export function AlgorithmInfo({ algorithm }: { algorithm: SortingAlgorithm }) {
  const meta = ALGORITHMS[algorithm];
  return (
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
            <h3 className="font-semibold text-sm sm:text-base font-display">{meta.name}</h3>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed">
              {meta.description}
            </p>
            {meta.funFact && (
              <p className="text-[11px] text-[var(--accent)] mt-2 italic">{meta.funFact}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[var(--line)]">
          <Metric label="Avg time" value={meta.timeComplexity.average} />
          <Metric label="Space" value={meta.spaceComplexity} />
          <Metric label="Type" value={meta.category} className="capitalize" />
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

/* ============================================================
 * SettingsBody — full mobile sheet content.
 * ============================================================ */
interface SettingsBodyProps extends ParamControlsProps {
  stats: SortStats;
}

export function SettingsBody({ stats, ...params }: SettingsBodyProps) {
  return (
    <div className="flex flex-col gap-5">
      <AlgorithmInfo algorithm={params.algorithm} />
      {params.playback.totalSteps > 0 && (
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Comparisons" value={stats.comparisons} className="text-[var(--st-compare)]" />
          <StatCard label="Swaps" value={stats.swaps} className="text-[var(--st-swap)]" />
        </section>
      )}
      <ParamControls {...params} variant="sheet" />
    </div>
  );
}

/* ---------- shared bits ---------- */
function Metric({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-[var(--ink-faint)] uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-mono font-semibold text-[var(--ink)] ${className}`}>{value}</div>
    </div>
  );
}

function StatCard({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="surface-soft px-3 py-2.5 text-center">
      <div className="text-[10px] text-[var(--ink-faint)] uppercase tracking-wide">{label}</div>
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
  disabled,
  note,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  disabled?: boolean;
  note?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="section-label">{label}</label>
        <span className="text-lg font-mono font-bold tabular-nums text-[var(--ink)]">
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
      {note && <p className="text-[10px] text-[var(--st-pivot)] mt-1.5">{note}</p>}
    </div>
  );
}

function CompactSlider({
  label,
  value,
  min,
  max,
  suffix = '',
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 w-[130px]">
      <div className="flex justify-between items-center">
        <span className="section-label">{label}</span>
        <span className="text-xs font-mono font-bold tabular-nums text-[var(--ink)]">
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
    </div>
  );
}
