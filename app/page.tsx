'use client';

import { useState } from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { Controls } from '@/components/Controls';
import { Visualizer } from '@/components/Visualizer';
import { VisualizationMode } from '@/types/sorting';

export default function Home() {
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('bars');

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

  return (
    <div className="app-bg min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#07080f]/80 backdrop-blur-xl">
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
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/8">Generator-based</span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/8">Step scrubbing</span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/8">Fully responsive</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,380px)_1fr] gap-4 sm:gap-6 lg:gap-8">
          {/* Visualizer first on mobile */}
          <section className="order-1 lg:order-2 min-h-[300px]">
            <Visualizer
              array={array}
              message={currentMessage}
              visualizationMode={visualizationMode}
              onVisualizationModeChange={setVisualizationMode}
            />
          </section>

          <aside className="order-2 lg:order-1 glass-panel p-4 sm:p-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
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
              onTogglePlayback={togglePlayback}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onJumpToStep={jumpToStep}
              onReset={reset}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/6 py-4 text-center text-[11px] text-slate-600">
        Built for learning — try 🎲 Bogo Sort at your own risk
      </footer>
    </div>
  );
}
