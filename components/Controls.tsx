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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Algorithm Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label className="block text-base font-bold text-gray-300 uppercase tracking-widest">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as SortingAlgorithm)}
          className="w-full px-5 py-4 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl text-white text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-blue-500/20"
          disabled={playback.isPlaying}
        >
          {Object.values(ALGORITHMS).map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-400 leading-relaxed">{currentAlgo.description}</p>
      </div>

      {/* Algorithm Info Box */}
      <div className="flex gap-6 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-2xl p-5 border border-blue-500/20 shadow-xl">
        <div className="flex-1 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold" style={{ marginBottom: '8px' }}>Time</div>
          <div className="text-2xl font-mono font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {currentAlgo.timeComplexity.average}
          </div>
        </div>
        <div className="w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
        <div className="flex-1 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold" style={{ marginBottom: '8px' }}>Space</div>
          <div className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {currentAlgo.spaceComplexity}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Array Size Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex justify-between items-center">
          <label className="text-lg font-bold text-gray-200 uppercase tracking-widest">
            Array Size
          </label>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">{arraySize}</span>
        </div>
        <input
          type="range"
          min="2"
          max="30"
          value={arraySize}
          onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
          style={{ accentColor: '#3b82f6' }}
          className="w-full h-3 bg-blue-500/30 rounded-full cursor-pointer disabled:opacity-50"
          disabled={playback.isPlaying}
        />
      </div>

      {/* Speed Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex justify-between items-center">
          <label className="text-lg font-bold text-gray-200 uppercase tracking-widest">
            Speed
          </label>
          <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tabular-nums">{playback.speed}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={playback.speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          style={{ accentColor: '#06b6d4' }}
          className="w-full h-3 bg-cyan-500/30 rounded-full cursor-pointer"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Playback Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onTogglePlayback}
          style={{ maxWidth: '280px' }}
          className={`w-full py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
            playback.isPlaying
              ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white shadow-red-500/40'
              : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white shadow-green-500/40'
          }`}
        >
          {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <div style={{ display: 'flex', gap: '10px', maxWidth: '280px', width: '100%' }}>
          <button
            onClick={onStepBackward}
            className="flex-1 py-4 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 border border-gray-500 hover:border-blue-500/50 shadow-lg transform hover:scale-[1.03] active:scale-[0.97]"
            disabled={playback.isPlaying || playback.currentStep === 0}
          >
            ← Back
          </button>
          <button
            onClick={onStepForward}
            className="flex-1 py-4 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 border border-gray-500 hover:border-blue-500/50 shadow-lg transform hover:scale-[1.03] active:scale-[0.97]"
            disabled={playback.isPlaying || playback.currentStep >= playback.totalSteps}
          >
            Forward →
          </button>
        </div>

        <button
          onClick={onReset}
          style={{ maxWidth: '280px' }}
          className="w-full py-4 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-40 border border-orange-500 shadow-lg shadow-orange-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={playback.isPlaying}
        >
          ↻ Reset Array
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Progress</span>
          <span className="text-xs font-mono text-gray-400 bg-gray-800/70 px-3 py-1.5 rounded-lg tabular-nums">
            {playback.currentStep} / {playback.totalSteps}
          </span>
        </div>
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-full h-3 overflow-hidden border border-gray-700/50 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-lg"
            style={{
              width: `${playback.totalSteps > 0 ? (playback.currentStep / playback.totalSteps) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Legend */}
      <div>
        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest" style={{ marginBottom: '14px' }}>Color Legend</h4>
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-gray-700/40 transition-all duration-200">
            <div className="w-6 h-6 bg-gray-500 rounded-lg shadow-md" />
            <span className="text-gray-300 text-sm font-medium">Default</span>
          </div>
          <div className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-blue-900/30 transition-all duration-200">
            <div className="w-6 h-6 bg-blue-500 rounded-lg shadow-md shadow-blue-500/50" />
            <span className="text-gray-300 text-sm font-medium">Comparing</span>
          </div>
          <div className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-red-900/30 transition-all duration-200">
            <div className="w-6 h-6 bg-red-500 rounded-lg shadow-md shadow-red-500/50" />
            <span className="text-gray-300 text-sm font-medium">Swapping</span>
          </div>
          <div className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-green-900/30 transition-all duration-200">
            <div className="w-6 h-6 bg-green-500 rounded-lg shadow-md shadow-green-500/50" />
            <span className="text-gray-300 text-sm font-medium">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
