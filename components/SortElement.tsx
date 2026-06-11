import { ArrayItem, VisualizationMode } from '@/types/sorting';

interface SortElementProps {
  item: ArrayItem;
  maxValue: number;
  visualizationMode: VisualizationMode;
  totalItems: number;
}

const STATE_STYLES: Record<
  ArrayItem['state'],
  { gradient: string; glow: string }
> = {
  default: { gradient: 'from-slate-600 to-slate-700', glow: '' },
  comparing: { gradient: 'from-violet-400 to-violet-600', glow: 'shadow-violet-500/40' },
  swapping: { gradient: 'from-rose-400 to-rose-600', glow: 'shadow-rose-500/50' },
  sorted: { gradient: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-500/40' },
  pivot: { gradient: 'from-fuchsia-400 to-fuchsia-600', glow: 'shadow-fuchsia-500/50' },
  partitioned: { gradient: 'from-indigo-400 to-indigo-600', glow: 'shadow-indigo-500/30' },
  active: { gradient: 'from-cyan-400 to-cyan-600', glow: 'shadow-cyan-500/50' },
  highlighted: { gradient: 'from-amber-400 to-amber-600', glow: 'shadow-amber-500/40' },
};

export function SortElement({ item, maxValue, visualizationMode, totalItems }: SortElementProps) {
  const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
  const style = STATE_STYLES[item.state];
  const isActive = ['comparing', 'swapping', 'active', 'pivot'].includes(item.state);
  const showLabel = totalItems <= 25;

  if (visualizationMode === 'boxes') {
    const size = Math.max(32, Math.min(72, 560 / totalItems));
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} text-white font-bold border border-white/10 transition-all duration-200 ${style.glow} shadow-lg ${
          isActive ? 'scale-110 z-10 sort-element-active' : ''
        } ${item.state === 'swapping' ? 'rotate-3' : ''}`}
        style={{ width: size, height: size, fontSize: Math.max(11, size * 0.32) }}
      >
        {item.value}
      </div>
    );
  }

  if (visualizationMode === 'dots') {
    const dotSize = Math.max(14, Math.min(36, 480 / totalItems));
    return (
      <div className="flex flex-col items-center justify-end gap-1" style={{ minWidth: dotSize }}>
        <div
          className={`rounded-full bg-gradient-to-br ${style.gradient} transition-all duration-200 ${style.glow} shadow-md ${
            isActive ? 'scale-125 sort-element-active' : ''
          }`}
          style={{
            width: dotSize,
            height: dotSize,
            marginBottom: `${heightPct * 0.6}px`,
          }}
        />
        {showLabel && (
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">{item.value}</span>
        )}
      </div>
    );
  }

  // bars (default)
  return (
    <div className="flex-1 flex flex-col items-center justify-end min-w-[6px] max-w-[40px]">
      <div
        className={`w-full rounded-t-md bg-gradient-to-t ${style.gradient} transition-all duration-150 ease-out ${style.glow} shadow-md ${
          isActive ? 'brightness-125 scale-x-110 sort-element-active' : ''
        } ${item.state === 'swapping' ? 'scale-y-105' : ''}`}
        style={{ height: `${Math.max(heightPct, 4)}%`, minHeight: 6 }}
        title={String(item.value)}
      />
      {showLabel && (
        <span className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono tabular-nums">
          {item.value}
        </span>
      )}
    </div>
  );
}
