'use client';

import { ArrayItem } from '@/types/sorting';
import { Bar } from './Bar';

interface VisualizerProps {
  array: ArrayItem[];
  message: string;
}

export function Visualizer({ array, message }: VisualizerProps) {
  const maxValue = array.length > 0 ? Math.max(...array.map(item => item.value)) : 100;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Message Display */}
      <div className="px-8 py-6 bg-gray-900 border-2 border-gray-800 rounded-t-2xl">
        <p className="text-base text-gray-300 text-center">
          {message || 'Select an algorithm and press Play to start'}
        </p>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-gray-900 border-2 border-t-0 border-gray-800 rounded-b-2xl p-6 flex items-end justify-center gap-1 min-h-[600px]">
        {array.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500 text-lg">Initializing...</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-center gap-1">
            {array.map((item, index) => (
              <Bar
                key={item.id}
                item={item}
                maxValue={maxValue}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
