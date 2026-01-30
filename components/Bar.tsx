import { ArrayItem, AnimationStyle } from '@/types/sorting';

interface BarProps {
  item: ArrayItem;
  maxValue: number;
  index: number;
  animationStyle: AnimationStyle;
}

const STATE_COLORS = {
  classic: {
    default: 'bg-gradient-to-t from-gray-600 to-gray-500',
    comparing: 'bg-gradient-to-t from-blue-600 to-blue-400',
    swapping: 'bg-gradient-to-t from-red-600 to-red-400',
    sorted: 'bg-gradient-to-t from-green-600 to-green-400',
    pivot: 'bg-gradient-to-t from-purple-600 to-purple-400',
    partitioned: 'bg-gradient-to-t from-blue-700 to-blue-500'
  },
  bounce: {
    default: 'bg-gradient-to-t from-slate-600 to-slate-400',
    comparing: 'bg-gradient-to-t from-cyan-600 to-cyan-300',
    swapping: 'bg-gradient-to-t from-orange-600 to-yellow-400',
    sorted: 'bg-gradient-to-t from-emerald-600 to-emerald-300',
    pivot: 'bg-gradient-to-t from-pink-600 to-pink-400',
    partitioned: 'bg-gradient-to-t from-indigo-600 to-indigo-400'
  },
  glow: {
    default: 'bg-gray-500',
    comparing: 'bg-blue-500',
    swapping: 'bg-red-500',
    sorted: 'bg-green-500',
    pivot: 'bg-purple-500',
    partitioned: 'bg-blue-600'
  }
};

const STATE_SHADOWS = {
  glow: {
    default: 'shadow-lg shadow-gray-500/20',
    comparing: 'shadow-[0_0_20px_8px_rgba(59,130,246,0.6)]',
    swapping: 'shadow-[0_0_25px_10px_rgba(239,68,68,0.7)]',
    sorted: 'shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]',
    pivot: 'shadow-[0_0_20px_8px_rgba(168,85,247,0.6)]',
    partitioned: 'shadow-[0_0_15px_6px_rgba(37,99,235,0.5)]'
  }
};

export function Bar({ item, maxValue, index, animationStyle }: BarProps) {
  const heightPercentage = (item.value / maxValue) * 100;
  const colorClass = STATE_COLORS[animationStyle][item.state];
  
  // Animation classes based on style
  const getAnimationClasses = () => {
    switch (animationStyle) {
      case 'classic':
        return {
          transition: 'transition-all duration-200 ease-out',
          transform: item.state === 'comparing' 
            ? 'scale-x-110' 
            : item.state === 'swapping' 
              ? 'scale-110' 
              : '',
          extra: ''
        };
      case 'bounce':
        return {
          transition: 'transition-all duration-300 ease-bounce',
          transform: item.state === 'comparing' 
            ? '-translate-y-4 scale-105' 
            : item.state === 'swapping' 
              ? '-translate-y-8 scale-110 rotate-3' 
              : item.state === 'sorted'
                ? 'scale-y-105'
                : '',
          extra: ''
        };
      case 'glow':
        return {
          transition: 'transition-all duration-150 ease-out',
          transform: item.state === 'swapping' ? 'scale-105' : '',
          extra: STATE_SHADOWS.glow[item.state]
        };
      default:
        return { transition: '', transform: '', extra: '' };
    }
  };

  const animClasses = getAnimationClasses();

  return (
    <div
      className="flex-1 flex flex-col items-center justify-end"
      style={{ minWidth: '8px', maxWidth: '28px' }}
    >
      <div
        className={`w-full ${colorClass} ${animClasses.transition} ${animClasses.extra} rounded-t-lg`}
        style={{ 
          height: `${heightPercentage}%`,
          minHeight: '4px',
          transform: animClasses.transform || undefined
        }}
        title={`${item.value}`}
      />
      {/* Value label for small arrays */}
      {maxValue <= 20 && (
        <div className="text-xs text-gray-400 mt-1 font-mono">
          {item.value}
        </div>
      )}
    </div>
  );
}
