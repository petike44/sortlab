import { ArrayItem, VisualizationMode } from '@/types/sorting';

interface BarProps {
  item: ArrayItem;
  maxValue: number;
  index: number;
  visualizationMode: VisualizationMode;
  totalItems: number;
}

const STATE_COLORS = {
  default: { bg: 'bg-gray-600', border: 'border-gray-500', text: 'text-gray-200' },
  comparing: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-white' },
  swapping: { bg: 'bg-red-500', border: 'border-red-400', text: 'text-white' },
  sorted: { bg: 'bg-green-500', border: 'border-green-400', text: 'text-white' },
  pivot: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-white' },
  partitioned: { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-white' }
};

const STATE_GRADIENTS = {
  default: 'from-gray-500 to-gray-700',
  comparing: 'from-blue-400 to-blue-600',
  swapping: 'from-red-400 to-red-600',
  sorted: 'from-green-400 to-green-600',
  pivot: 'from-purple-400 to-purple-600',
  partitioned: 'from-blue-500 to-blue-700'
};

export function Bar({ item, maxValue, index, visualizationMode, totalItems }: BarProps) {
  const heightPercentage = (item.value / maxValue) * 100;
  const colors = STATE_COLORS[item.state];
  const gradient = STATE_GRADIENTS[item.state];
  
  const isActive = item.state === 'comparing' || item.state === 'swapping';
  
  // Boxes Mode - Cards with numbers
  if (visualizationMode === 'boxes') {
    const boxSize = Math.max(40, Math.min(80, 600 / totalItems));
    return (
      <div
        className={`flex items-center justify-center rounded-xl border-2 ${colors.bg} ${colors.border} ${colors.text} font-bold transition-all duration-300 shadow-lg ${
          isActive ? 'scale-110 shadow-xl z-10' : ''
        } ${item.state === 'swapping' ? 'rotate-6' : ''} ${item.state === 'sorted' ? 'shadow-green-500/50' : ''}`}
        style={{ 
          width: boxSize,
          height: boxSize,
          fontSize: boxSize * 0.4
        }}
      >
        {item.value}
      </div>
    );
  }
  
  // Towers Mode - 3D-looking towers
  if (visualizationMode === 'towers') {
    const towerWidth = Math.max(30, Math.min(60, 700 / totalItems));
    return (
      <div 
        className="flex flex-col items-center justify-end"
        style={{ width: towerWidth }}
      >
        {/* Tower top (roof) */}
        <div 
          className={`w-full bg-gradient-to-b ${gradient} rounded-t-lg transition-all duration-300 ${
            isActive ? 'brightness-125' : ''
          }`}
          style={{ height: '8px' }}
        />
        
        {/* Main tower body */}
        <div 
          className={`w-full bg-gradient-to-br ${gradient} transition-all duration-300 relative overflow-hidden ${
            isActive ? 'brightness-110 scale-x-105' : ''
          } ${item.state === 'swapping' ? 'animate-pulse' : ''}`}
          style={{ 
            height: `${heightPercentage * 3}px`,
            minHeight: '30px'
          }}
        >
          {/* Window pattern */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 py-2">
            {Array.from({ length: Math.min(5, Math.floor(item.value / 5)) }).map((_, i) => (
              <div key={i} className="w-3/5 h-2 bg-black/20 rounded-sm" />
            ))}
          </div>
          
          {/* Number label */}
          <div className={`absolute bottom-1 left-0 right-0 text-center ${colors.text} font-bold text-sm drop-shadow-lg`}>
            {item.value}
          </div>
        </div>
        
        {/* Tower base */}
        <div 
          className={`w-full bg-gradient-to-t from-gray-800 to-gray-700 rounded-b-sm transition-all duration-300`}
          style={{ height: '6px', width: `${towerWidth + 8}px` }}
        />
      </div>
    );
  }
  
  // Bars Mode (default) - Classic bars
  return (
    <div
      className="flex-1 flex flex-col items-center justify-end"
      style={{ minWidth: '12px', maxWidth: '32px' }}
    >
      <div
        className={`w-full bg-gradient-to-t ${gradient} transition-all duration-200 ease-out rounded-t-lg shadow-lg ${
          isActive ? 'brightness-125 scale-x-110' : ''
        } ${item.state === 'swapping' ? 'scale-110' : ''} ${
          item.state === 'sorted' ? 'shadow-green-500/30' : ''
        }`}
        style={{ 
          height: `${heightPercentage}%`,
          minHeight: '8px'
        }}
        title={`${item.value}`}
      />
      {/* Value label for small arrays */}
      {totalItems <= 20 && (
        <div className="text-xs text-gray-400 mt-1 font-mono">
          {item.value}
        </div>
      )}
    </div>
  );
}
