import { motion } from 'motion/react';
import { ArrayItem, VisualizationMode } from '@/types/sorting';

interface SortElementProps {
  item: ArrayItem;
  maxValue: number;
  visualizationMode: VisualizationMode;
  totalItems: number;
}

// Solid, saturated state colors tuned for a light canvas (no gradients/glow).
const STATE_COLOR: Record<ArrayItem['state'], string> = {
  default: 'var(--st-idle)',
  comparing: 'var(--st-compare)',
  swapping: 'var(--st-swap)',
  sorted: 'var(--st-sorted)',
  pivot: 'var(--st-pivot)',
  partitioned: 'var(--st-partition)',
  active: 'var(--st-active)',
  highlighted: 'var(--st-pivot)',
};

// Stiff, short spring keeps large arrays smooth while still reading as movement.
const SPRING = { type: 'spring', stiffness: 600, damping: 32, mass: 0.6 } as const;

export function SortElement({ item, maxValue, visualizationMode, totalItems }: SortElementProps) {
  const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
  const color = STATE_COLOR[item.state];
  const isActive = ['comparing', 'swapping', 'active', 'pivot'].includes(item.state);
  const showLabel = totalItems <= 25;

  if (visualizationMode === 'boxes') {
    const size = Math.max(32, Math.min(72, 560 / totalItems));
    return (
      <motion.div
        layout
        transition={SPRING}
        className={`flex items-center justify-center rounded-xl text-white font-bold shadow-sm ${
          isActive ? 'sort-element-active' : ''
        }`}
        animate={{ scale: isActive ? 1.1 : 1, rotate: item.state === 'swapping' ? 4 : 0 }}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(11, size * 0.32),
          backgroundColor: color,
        }}
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
          className={`rounded-full shadow-sm ${isActive ? 'sort-element-active' : ''}`}
          animate={{ scale: isActive ? 1.25 : 1, marginBottom: heightPct * 0.6 }}
          transition={{ duration: 0.18 }}
          style={{ width: dotSize, height: dotSize, backgroundColor: color }}
        />
        {showLabel && (
          <span className="text-[10px] text-[var(--ink-faint)] font-mono tabular-nums">
            {item.value}
          </span>
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
        className={`w-full rounded-t-md shadow-sm ${isActive ? 'sort-element-active' : ''}`}
        animate={{
          height: `${Math.max(heightPct, 4)}%`,
          filter: isActive ? 'brightness(1.08)' : 'brightness(1)',
        }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        style={{ minHeight: 6, backgroundColor: color }}
        title={String(item.value)}
      />
      {showLabel && (
        <span className="text-[9px] sm:text-[10px] text-[var(--ink-faint)] mt-1 font-mono tabular-nums">
          {item.value}
        </span>
      )}
    </motion.div>
  );
}
