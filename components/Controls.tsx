import { useState } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Algorithm Selection - Custom Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="block text-sm sm:text-base font-bold text-gray-300 uppercase tracking-widest">
          Algorithm
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !playback.isPlaying && setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl text-white text-lg sm:text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-blue-500/20 text-left flex justify-between items-center"
            disabled={playback.isPlaying}
          >
            <span>{currentAlgo.name}</span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-gray-800 border-2 border-blue-500/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              {Object.values(ALGORITHMS).map((algo) => (
                <button
                  key={algo.id}
                  type="button"
                  onClick={() => {
                    onAlgorithmChange(algo.id as SortingAlgorithm);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-left text-base sm:text-lg font-semibold transition-all duration-200 ${
                    algorithm === algo.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{currentAlgo.description}</p>
      </div>

      {/* Algorithm Info Box */}
      <div className="flex gap-4 sm:gap-6 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-blue-500/20 shadow-xl">
        <div className="flex-1 text-center">
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold" style={{ marginBottom: '4px' }}>Time</div>
          <div className="text-xl sm:text-2xl font-mono font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {currentAlgo.timeComplexity.average}
          </div>
        </div>
        <div className="w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
        <div className="flex-1 text-center">
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold" style={{ marginBottom: '4px' }}>Space</div>
          <div className="text-xl sm:text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {currentAlgo.spaceComplexity}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Array Size Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="flex justify-between items-center">
          <label className="text-sm sm:text-base lg:text-lg font-bold text-gray-200 uppercase tracking-widest">
            Array Size
          </label>
          <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">{arraySize}</span>
        </div>
        <input
          type="range"
          min="2"
          max="30"
          value={arraySize}
          onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
          className="slider-blue w-full h-3 rounded-full cursor-pointer disabled:opacity-50 touch-pan-y"
          disabled={playback.isPlaying}
        />
      </div>

      {/* Speed Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="flex justify-between items-center">
          <label className="text-sm sm:text-base lg:text-lg font-bold text-gray-200 uppercase tracking-widest">
            Speed
          </label>
          <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tabular-nums">{playback.speed}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={playback.speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="slider-cyan w-full h-3 rounded-full cursor-pointer touch-pan-y"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      {/* Playback Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={onTogglePlayback}
          className={`w-full max-w-[280px] py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
            playback.isPlaying
              ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white shadow-red-500/40'
              : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white shadow-green-500/40'
          }`}
        >
          {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <div className="flex gap-2 sm:gap-3 w-full max-w-[280px]">
          <button
            onClick={onStepBackward}
            className="flex-1 py-3 sm:py-4 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-30 border border-gray-500 hover:border-blue-500/50 shadow-lg transform hover:scale-[1.03] active:scale-[0.97]"
            disabled={playback.isPlaying || playback.currentStep === 0}
          >
            ← Back
          </button>
          <button
            onClick={onStepForward}
            className="flex-1 py-3 sm:py-4 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-30 border border-gray-500 hover:border-blue-500/50 shadow-lg transform hover:scale-[1.03] active:scale-[0.97]"
            disabled={playback.isPlaying || playback.currentStep >= playback.totalSteps}
          >
            Forward →
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full max-w-[280px] py-3 sm:py-4 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-40 border border-orange-500 shadow-lg shadow-orange-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
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

    </div>
  );
}
