'use client';

import { PlaybackState } from '@/types/sorting';

interface PlaybackControlsProps {
  playback: PlaybackState;
  onTogglePlayback: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (step: number) => void;
  onReset: () => void;
  /** When provided, renders a mobile-only "Tune" button (opens the settings sheet). */
  onOpenSettings?: () => void;
}

export function PlaybackControls({
  playback,
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

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5">
      {/* Transport cluster */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onStepBackward}
          disabled={busy || atStart}
          aria-label="Step back"
          className="btn-icon h-11 w-10 sm:w-11 text-lg"
        >
          ⏮
        </button>
        <button
          type="button"
          onClick={onTogglePlayback}
          className={`btn-primary h-11 px-4 sm:px-6 text-sm sm:text-base ${busy ? 'is-playing' : ''}`}
        >
          {busy ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          type="button"
          onClick={onStepForward}
          disabled={busy || atEnd}
          aria-label="Step forward"
          className="btn-icon h-11 w-10 sm:w-11 text-lg"
        >
          ⏭
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={busy}
          aria-label="New array"
          className="btn-icon h-11 w-10 sm:w-11 text-lg text-[var(--st-pivot)]"
        >
          ↻
        </button>
      </div>

      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-ghost lg:hidden h-11 px-3 text-sm ml-auto shrink-0"
        >
          ⚙ Tune
        </button>
      )}

      {/* Scrubber — wraps to its own row on mobile, inline on larger screens */}
      <div className="flex items-center gap-2.5 basis-full sm:basis-0 sm:flex-1 sm:min-w-[200px]">
        <input
          type="range"
          className="progress-scrubber flex-1 min-w-0"
          min={0}
          max={Math.max(playback.totalSteps - 1, 0)}
          value={playback.currentStep}
          disabled={busy || !hasSteps}
          aria-label="Scrub steps"
          onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
        />
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--ink-muted)] w-[68px] text-right">
          {hasSteps ? `${playback.currentStep} / ${playback.totalSteps}` : '— / —'}
        </span>
      </div>
    </div>
  );
}
