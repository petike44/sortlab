'use client';

import { useState } from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { Visualizer } from '@/components/Visualizer';
import { PlaybackControls } from '@/components/PlaybackControls';
import { ParamControls, SettingsBody } from '@/components/Controls';
import { AlgorithmMenu } from '@/components/AlgorithmMenu';
import { SettingsSheet } from '@/components/SettingsSheet';
import { ALGORITHMS } from '@/lib/algorithms';
import { VisualizationMode } from '@/types/sorting';

export default function Home() {
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('bars');
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    array,
    algorithm,
    arraySize,
    maxArraySize,
    preset,
    playback,
    currentMessage,
    stats,
    togglePlayback,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    changeArraySize,
    changeSpeed,
    changeAlgorithm,
    changePreset,
  } = useSortingVisualizer({
    initialSize: 20,
    initialSpeed: 55,
    initialAlgorithm: 'bubble',
  });

  const meta = ALGORITHMS[algorithm];

  return (
    <div className="app-bg flex flex-col h-dvh">
      {/* Top bar */}
      <header className="relative z-50 shrink-0 border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5 min-w-0">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
              Sort<span className="text-[var(--accent)]">Lab</span>
            </span>
            <span className="hidden sm:inline text-[11px] font-mono text-[var(--ink-faint)]">
              sorting visualizer
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-1.5">
              <span className="chip-mono">avg {meta.timeComplexity.average}</span>
              <span className="chip-mono">space {meta.spaceComplexity}</span>
            </div>
            <AlgorithmMenu
              algorithm={algorithm}
              disabled={playback.isPlaying}
              onChange={changeAlgorithm}
            />
          </div>
        </div>
      </header>

      {/* Hero visualizer */}
      <main className="flex-1 min-h-0 w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-5">
        <section className="h-full animate-fade-up">
          <Visualizer
            array={array}
            message={currentMessage}
            visualizationMode={visualizationMode}
            stats={stats}
            showStats={playback.totalSteps > 0}
            onVisualizationModeChange={setVisualizationMode}
          />
        </section>
      </main>

      {/* Bottom control dock */}
      <footer className="shrink-0 border-t border-[var(--line)] bg-[var(--card)] px-3 sm:px-6 pt-3 pb-safe lg:pb-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <PlaybackControls
              playback={playback}
              onTogglePlayback={togglePlayback}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onJumpToStep={jumpToStep}
              onReset={reset}
              onOpenSettings={() => setSheetOpen(true)}
            />
          </div>

          {/* Desktop inline params — wide screens only; narrower laptops use the Tune sheet */}
          <div className="hidden xl:block w-px h-12 bg-[var(--line)] shrink-0" />
          <div className="hidden xl:block shrink-0">
            <ParamControls
              variant="dock"
              algorithm={algorithm}
              arraySize={arraySize}
              maxArraySize={maxArraySize}
              preset={preset}
              playback={playback}
              onArraySizeChange={changeArraySize}
              onPresetChange={changePreset}
              onSpeedChange={changeSpeed}
            />
          </div>
        </div>
      </footer>

      {/* Mobile settings sheet */}
      <SettingsSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <SettingsBody
          algorithm={algorithm}
          arraySize={arraySize}
          maxArraySize={maxArraySize}
          preset={preset}
          playback={playback}
          stats={stats}
          onArraySizeChange={changeArraySize}
          onPresetChange={changePreset}
          onSpeedChange={changeSpeed}
        />
      </SettingsSheet>
    </div>
  );
}
