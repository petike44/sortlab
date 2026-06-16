'use client';

import { useState } from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { Controls } from '@/components/Controls';
import { Visualizer } from '@/components/Visualizer';
import { PlaybackControls } from '@/components/PlaybackControls';
import { SettingsSheet } from '@/components/SettingsSheet';
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

  const settingsPanel = (
    <Controls
      algorithm={algorithm}
      arraySize={arraySize}
      maxArraySize={maxArraySize}
      preset={preset}
      playback={playback}
      stats={stats}
      onAlgorithmChange={changeAlgorithm}
      onArraySizeChange={changeArraySize}
      onPresetChange={changePreset}
      onSpeedChange={changeSpeed}
    />
  );

  return (
    <div className="app-bg min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#060710]/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-violet-500/25">
              S
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SortLab
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
                10 algorithms + one chaotic wildcard
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="chip">Generator-based</span>
            <span className="chip">Step scrubbing</span>
            <span className="chip">Fully responsive</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 lg:py-8 pb-36 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,380px)] gap-4 sm:gap-6 lg:gap-8">
          {/* Visualizer — hero */}
          <section className="order-1 min-h-[320px] animate-fade-up">
            <Visualizer
              array={array}
              message={currentMessage}
              visualizationMode={visualizationMode}
              onVisualizationModeChange={setVisualizationMode}
            />
          </section>

          {/* Desktop rail */}
          <aside className="order-2 hidden lg:flex lg:flex-col gap-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)]">
            <div className="glass-panel p-5 overflow-y-auto">{settingsPanel}</div>
            <div className="glass-panel p-4">
              <PlaybackControls
                playback={playback}
                variant="rail"
                onTogglePlayback={togglePlayback}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onJumpToStep={jumpToStep}
                onReset={reset}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Desktop footer */}
      <footer className="hidden lg:block border-t border-white/6 py-4 text-center text-[11px] text-slate-600">
        Built for learning — try 🎲 Bogo Sort at your own risk
      </footer>

      {/* Mobile sticky playback bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-[#0d0f1a]/90 backdrop-blur-xl px-3 pt-3 pb-safe">
        <div className="max-w-2xl mx-auto">
          <PlaybackControls
            playback={playback}
            variant="bar"
            onTogglePlayback={togglePlayback}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onJumpToStep={jumpToStep}
            onReset={reset}
            onOpenSettings={() => setSheetOpen(true)}
          />
        </div>
      </div>

      {/* Mobile settings sheet */}
      <SettingsSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {settingsPanel}
      </SettingsSheet>
    </div>
  );
}
