'use client';

import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { Controls } from '@/components/Controls';
import { Visualizer } from '@/components/Visualizer';

export default function Home() {
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
    initialSize: 50,
    initialSpeed: 50,
    initialAlgorithm: 'bubble'
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-blue-500/20">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-blue-500 mb-2">SortLab</h1>
            <p className="text-lg text-gray-400">
              Interactive Sorting Algorithm Visualizer
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            {/* Controls Sidebar */}
            <aside className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
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
            <section className="flex items-center">
              <Visualizer array={array} message={currentMessage} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
