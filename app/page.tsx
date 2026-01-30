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
    playback,
    currentMessage,
    togglePlayback,
    stepForward,
    stepBackward,
    reset,
    changeArraySize,
    changeSpeed,
    changeAlgorithm
  } = useSortingVisualizer({
    initialSize: 15,
    initialSpeed: 50,
    initialAlgorithm: 'bubble'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-40 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-500 tracking-tight">SortLab</h1>
            <span className="text-sm text-gray-500 hidden sm:inline">•</span>
            <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
              Interactive Sorting Algorithm Visualizer
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start lg:items-center justify-center px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-4 sm:gap-6 lg:gap-8">
            {/* Controls Sidebar */}
            <aside className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl shadow-blue-500/10 order-2 lg:order-1">
              <Controls
                algorithm={algorithm}
                arraySize={arraySize}
                playback={playback}
                onAlgorithmChange={changeAlgorithm}
                onArraySizeChange={changeArraySize}
                onSpeedChange={changeSpeed}
                onTogglePlayback={togglePlayback}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onReset={reset}
              />
            </aside>

            {/* Visualizer */}
            <section className="flex flex-col min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] order-1 lg:order-2">
              <Visualizer 
                array={array} 
                message={currentMessage}
                visualizationMode={visualizationMode}
                onVisualizationModeChange={setVisualizationMode}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
