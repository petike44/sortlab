import { SortingAlgorithm, PlaybackState } from '@/types/sorting';
import { ALGORITHMS } from '@/lib/algorithms';

interface ControlsProps {
  algorithm: SortingAlgorithm;
  arraySize: number;
  playback: PlaybackState;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onTogglePlayback: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
}

export function Controls({
  algorithm,
  arraySize,
  playback,
  onAlgorithmChange,
  onArraySizeChange,
  onSpeedChange,
  onTogglePlayback,
  onStepForward,
  onStepBackward,
  onReset
}: ControlsProps) {
  const currentAlgo = ALGORITHMS[algorithm];

  return (
    <div className="space-y-8">
      {/* Algorithm Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as SortingAlgorithm)}
          className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50"
          disabled={playback.isPlaying}
        >
          {Object.values(ALGORITHMS).map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Algorithm Info */}
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{currentAlgo.description}</p>
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Time Complexity</div>
            <div className="text-blue-400 font-mono font-semibold text-base">
              {currentAlgo.timeComplexity.average}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Space</div>
            <div className="text-blue-400 font-mono font-semibold text-base">
              {currentAlgo.spaceComplexity}
            </div>
          </div>
        </div>
      </div>

      {/* Array Size */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Array Size
          </label>
          <span className="text-xl font-bold text-blue-500">{arraySize}</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={arraySize}
          onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          disabled={playback.isPlaying}
        />
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Speed
          </label>
          <span className="text-xl font-bold text-blue-500">{playback.speed}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={playback.speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Playback Controls */}
      <div className="space-y-4">
        <button
          onClick={onTogglePlayback}
          className={`w-full px-6 py-5 rounded-xl font-bold text-lg transition-all ${
            playback.isPlaying
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onStepBackward}
            className="px-4 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed border-2 border-gray-700"
            disabled={playback.isPlaying || playback.currentStep === 0}
          >
            ← Back
          </button>
          <button
            onClick={onStepForward}
            className="px-4 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed border-2 border-gray-700"
            disabled={playback.isPlaying || playback.currentStep >= playback.totalSteps}
          >
            Forward →
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-700"
          disabled={playback.isPlaying}
        >
          ↻ Reset
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Progress</span>
          <span className="text-sm font-mono text-gray-400">
            {playback.currentStep} / {playback.totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${playback.totalSteps > 0 ? (playback.currentStep / playback.totalSteps) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Color Legend</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-600 rounded" />
            <span className="text-gray-300">Default</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            <span className="text-gray-300">Comparing</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded" />
            <span className="text-gray-300">Swapping</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded" />
            <span className="text-gray-300">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
