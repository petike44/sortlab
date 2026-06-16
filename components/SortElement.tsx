import { motion } from 'motion/react';
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
  default: { gradient: 'from-slate-500 to-slate-700', glow: '' },
  comparing: { gradient: 'from-violet-400 to-violet-600', glow: 'shadow-violet-500/40' },
  swapping: { gradient: 'from-rose-400 to-rose-600', glow: 'shadow-rose-500/50' },
  sorted: { gradient: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-500/40' },
  pivot: { gradient: 'from-fuchsia-400 to-fuchsia-600', glow: 'shadow-fuchsia-500/50' },
  partitioned: { gradient: 'from-indigo-400 to-indigo-600', glow: 'shadow-indigo-500/30' },
  active: { gradient: 'from-cyan-400 to-cyan-600', glow: 'shadow-cyan-500/50' },
  highlighted: { gradient: 'from-amber-400 to-amber-600', glow: 'shadow-amber-500/40' },
};

// Stiff, short spring keeps large arrays smooth while still reading as movement.
const SPRING = { type: 'spring', stiffness: 600, damping: 32, mass: 0.6 } as const;

export function SortElement({ item, maxValue, visualizationMode, totalItems }: SortElementProps) {
  const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
  const style = STATE_STYLES[item.state];
  const isActive = ['comparing', 'swapping', 'active', 'pivot'].includes(item.state);
  const showLabel = totalItems <= 25;

  if (visualizationMode === 'boxes') {
    const size = Math.max(32, Math.min(72, 560 / totalItems));
    return (
      <motion.div
        layout
        transition={SPRING}
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} text-white font-bold border border-white/10 ${style.glow} shadow-lg ${
          isActive ? 'sort-element-active' : ''
        }`}
        animate={{ scale: isActive ? 1.1 : 1, rotate: item.state === 'swapping' ? 4 : 0 }}
        style={{ width: size, height: size, fontSize: Math.max(11, size * 0.32) }}
      >
        {item.value}
      </motion.div>
    );
  }

  if (visualizationMode === 'dots') {
    const dotSize = Math.max(14, Math.min(36, 480 / totalItems));
    return (
      <motion.div
        layout
        transition={SPRING}
        className="flex flex-col items-center justify-end gap-1"
        style={{ minWidth: dotSize }}
      >
        <motion.div
          className={`rounded-full bg-gradient-to-br ${style.gradient} ${style.glow} shadow-md ${
            isActive ? 'sort-element-active' : ''
          }`}
          animate={{ scale: isActive ? 1.25 : 1, marginBottom: heightPct * 0.6 }}
          transition={{ duration: 0.18 }}
          style={{ width: dotSize, height: dotSize }}
        />
        {showLabel && (
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">{item.value}</span>
        )}
      </motion.div>
    );
  }

  // bars (default)
  return (
    <motion.div
      layout
      transition={SPRING}
      className="flex-1 flex flex-col items-center justify-end min-w-[5px] max-w-[44px]"
    >
      <motion.div
        className={`w-full rounded-t-md bg-gradient-to-t ${style.gradient} ${style.glow} shadow-md ${
          isActive ? 'sort-element-active' : ''
        }`}
        animate={{
          height: `${Math.max(heightPct, 4)}%`,
          filter: isActive ? 'brightness(1.25)' : 'brightness(1)',
        }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        style={{ minHeight: 6 }}
        title={String(item.value)}
      />
      {showLabel && (
        <span className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono tabular-nums">
          {item.value}
        </span>
      )}
    </motion.div>
  );
}
