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
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl font-bold text-blue-500 tracking-tight">SortLab</h1>
            <span className="text-sm text-gray-500">•</span>
            <p className="text-sm text-gray-400">
              Interactive Sorting Algorithm Visualizer
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
            {/* Controls Sidebar */}
            <aside className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
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
            <section className="flex flex-col min-h-[600px]">
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
