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
  onTogglePlayback: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (step: number) => void;
  onReset: () => void;
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
  onTogglePlayback,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onReset,
}: ControlsProps) {
  const meta = ALGORITHMS[algorithm];
  const busy = playback.isPlaying;
  const atStart = playback.currentStep === 0;
  const atEnd = playback.totalSteps > 0 && playback.currentStep >= playback.totalSteps - 1;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Algorithm picker */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Algorithm
        </h2>
        <AlgorithmPicker
          algorithm={algorithm}
          disabled={busy}
          onChange={onAlgorithmChange}
        />
      </section>

      {/* Info card */}
      <section className="rounded-xl border border-white/8 bg-white/[0.03] p-3 sm:p-4">
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
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase">Avg time</div>
            <div className="text-sm font-mono font-semibold text-cyan-400">{meta.timeComplexity.average}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase">Space</div>
            <div className="text-sm font-mono font-semibold text-violet-400">{meta.spaceComplexity}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase">Type</div>
            <div className="text-sm font-semibold capitalize text-slate-300">{meta.category}</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {playback.totalSteps > 0 && (
        <section className="flex gap-3">
          <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/6 px-3 py-2 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Comparisons</div>
            <div className="text-lg font-mono font-bold text-violet-300">{stats.comparisons}</div>
          </div>
          <div className="flex-1 rounded-lg bg-white/[0.04] border border-white/6 px-3 py-2 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Swaps</div>
            <div className="text-lg font-mono font-bold text-rose-300">{stats.swaps}</div>
          </div>
        </section>
      )}

      {/* Presets */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Array pattern
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => onPresetChange(p.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === p.id
                  ? 'bg-violet-600/80 text-white'
                  : 'btn-ghost'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <section className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Array size
            </label>
            <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">{arraySize}</span>
          </div>
          <input
            type="range"
            min={2}
            max={maxArraySize}
            value={arraySize}
            disabled={busy}
            onChange={(e) => onArraySizeChange(parseInt(e.target.value, 10))}
          />
          {algorithm === 'bogo' && (
            <p className="text-[10px] text-amber-400/80 mt-1">Bogo sort capped at {maxArraySize} elements — for your sanity</p>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Speed
            </label>
            <span className="text-lg font-mono font-bold text-violet-400 tabular-nums">{playback.speed}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={playback.speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
          />
        </div>
      </section>

      {/* Playback */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={onTogglePlayback}
          className={`btn-primary w-full py-3.5 text-sm sm:text-base ${
            playback.isPlaying ? '!bg-gradient-to-r !from-rose-600 !to-orange-600' : ''
          }`}
        >
          {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onStepBackward}
            disabled={busy || atStart}
            className="btn-ghost py-2.5 text-sm"
          >
            ← Step back
          </button>
          <button
            type="button"
            onClick={onStepForward}
            disabled={busy || atEnd}
            className="btn-ghost py-2.5 text-sm"
          >
            Step fwd →
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={busy}
          className="btn-ghost w-full py-2.5 text-sm text-amber-300 border-amber-500/20 hover:border-amber-500/40"
        >
          ↻ New array
        </button>
      </section>

      {/* Scrubber */}
      {playback.totalSteps > 0 && (
        <section>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono tabular-nums">
            <span>Progress</span>
            <span>
              {playback.currentStep} / {playback.totalSteps}
            </span>
          </div>
          <input
            type="range"
            className="progress-scrubber w-full"
            min={0}
            max={Math.max(playback.totalSteps - 1, 0)}
            value={playback.currentStep}
            disabled={busy}
            onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
          />
        </section>
      )}
    </div>
  );
}
