'use client';

import { PlaybackState } from '@/types/sorting';

interface PlaybackControlsProps {
  playback: PlaybackState;
  variant?: 'rail' | 'bar';
  onTogglePlayback: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (step: number) => void;
  onReset: () => void;
  onOpenSettings?: () => void;
}

export function PlaybackControls({
  playback,
  variant = 'rail',
  onTogglePlayback,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onReset,
  onOpenSettings,
}: PlaybackControlsProps) {
  const busy = playback.isPlaying;
  const atStart = playback.currentStep === 0;
  const atEnd = playback.totalSteps > 0 && playback.currentStep >= playback.totalSteps - 1;
  const hasSteps = playback.totalSteps > 0;

  const Scrubber = hasSteps ? (
    <div className="w-full">
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
    </div>
  ) : null;

  if (variant === 'bar') {
    // Mobile sticky bar: compact icon cluster + scrubber on top
    return (
      <div className="flex flex-col gap-2.5">
        {Scrubber}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Open settings"
              className="btn-icon h-12 w-11 sm:w-12 text-xl shrink-0"
            >
              ⚙
            </button>
          )}
          <button
            type="button"
            onClick={onStepBackward}
            disabled={busy || atStart}
            aria-label="Step back"
            className="btn-icon h-12 w-11 sm:w-12 text-lg shrink-0"
          >
            ⏮
          </button>
          <button
            type="button"
            onClick={onTogglePlayback}
            className={`btn-primary flex-1 min-w-0 h-12 text-base ${busy ? 'is-playing' : ''}`}
          >
            {busy ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={onStepForward}
            disabled={busy || atEnd}
            aria-label="Step forward"
            className="btn-icon h-12 w-11 sm:w-12 text-lg shrink-0"
          >
            ⏭
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={busy}
            aria-label="New array"
            className="btn-icon h-12 w-11 sm:w-12 text-lg shrink-0 text-amber-300"
          >
            ↻
          </button>
        </div>
      </div>
    );
  }

  // Desktop rail
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={onTogglePlayback}
        className={`btn-primary w-full py-3.5 text-sm sm:text-base ${busy ? 'is-playing' : ''}`}
      >
        {busy ? '⏸ Pause' : '▶ Play'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onStepBackward}
          disabled={busy || atStart}
          className="btn-ghost py-2.5 text-sm"
        >
          ⏮ Step back
        </button>
        <button
          type="button"
          onClick={onStepForward}
          disabled={busy || atEnd}
          className="btn-ghost py-2.5 text-sm"
        >
          Step fwd ⏭
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={busy}
        className="btn-ghost w-full py-2.5 text-sm text-amber-300"
      >
        ↻ New array
      </button>

      {Scrubber}
    </div>
  );
}
