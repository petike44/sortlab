'use client';

import { ArrayItem, VisualizationMode } from '@/types/sorting';
import { Bar } from './Bar';

interface VisualizerProps {
  array: ArrayItem[];
  message: string;
  visualizationMode: VisualizationMode;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
}

const VISUALIZATION_MODES: { id: VisualizationMode; name: string; icon: string; description: string }[] = [
  { id: 'bars', name: 'Bars', icon: '📊', description: 'Classic bar chart visualization' },
  { id: 'boxes', name: 'Boxes', icon: '🔢', description: 'Number boxes that rearrange' },
  { id: 'towers', name: 'Towers', icon: '🏙️', description: '3D city towers visualization' }
];

export function Visualizer({ array, message, visualizationMode, onVisualizationModeChange }: VisualizerProps) {
  const maxValue = array.length > 0 ? Math.max(...array.map(item => item.value)) : 100;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Bar with Visualization Mode Selector */}
      <div className="px-6 py-4 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-t-2xl shadow-lg flex items-center justify-between gap-4">
        {/* Message */}
        <p className="text-sm text-gray-300 font-medium flex-1">
          {message || 'Select an algorithm and press Play to start'}
        </p>
        
        {/* Visualization Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">View:</span>
          <div className="flex gap-1 bg-gray-800/80 rounded-lg p-1">
            {VISUALIZATION_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onVisualizationModeChange(mode.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  visualizationMode === mode.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title={mode.description}
              >
                <span>{mode.icon}</span>
                <span className="hidden sm:inline">{mode.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Legend - Inline */}
      <div className="px-6 py-2 bg-gray-800/40 border-x border-gray-700/50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded" />
          <span className="text-xs text-gray-400">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-xs text-gray-400">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-xs text-gray-400">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-xs text-gray-400">Sorted</span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className={`flex-1 bg-gray-900/60 backdrop-blur-xl border border-t-0 border-gray-700/50 rounded-b-2xl p-8 flex items-${visualizationMode === 'boxes' ? 'center' : 'end'} justify-center gap-${visualizationMode === 'boxes' ? '3' : '1'} min-h-[500px] shadow-2xl shadow-blue-500/5`}>
        {array.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-lg">Initializing...</div>
          </div>
        ) : (
          <div className={`w-full h-full flex items-${visualizationMode === 'boxes' ? 'center' : 'end'} justify-center ${visualizationMode === 'boxes' ? 'flex-wrap gap-3' : 'gap-1'}`}>
            {array.map((item, index) => (
              <Bar
                key={item.id}
                item={item}
                maxValue={maxValue}
                index={index}
                visualizationMode={visualizationMode}
                totalItems={array.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
