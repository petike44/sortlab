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
      className="flex-1 flex flex-col items-center justify-end transition-all duration-200 ease-out"
      style={{ minWidth: '2px' }}
    >
      <div
        className={`w-full ${colorClass} transition-all duration-200 ease-out rounded-t hover:opacity-90`}
        style={{ height: `${heightPercentage}%` }}
        title={`${item.value}`}
      />
    </div>
  );
}
