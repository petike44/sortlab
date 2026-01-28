import { ArrayItem } from '@/types/sorting';

interface BarProps {
  item: ArrayItem;
  maxValue: number;
  index: number;
}

const STATE_COLORS = {
  default: 'bg-gray-600',
  comparing: 'bg-blue-500',
  swapping: 'bg-red-500',
  sorted: 'bg-green-500',
  pivot: 'bg-blue-400',
  partitioned: 'bg-blue-600'
};

export function Bar({ item, maxValue, index }: BarProps) {
  const heightPercentage = (item.value / maxValue) * 100;
  const colorClass = STATE_COLORS[item.state];

  return (
    <div
      className="flex-1 flex flex-col items-center justify-end"
      style={{ minWidth: '8px' }}
    >
      <div
        className={`w-full ${colorClass} transition-all duration-100 ease-out rounded-sm`}
        style={{ 
          height: `${heightPercentage}%`,
          minHeight: '4px'
        }}
        title={`${item.value}`}
      />
    </div>
  );
}
