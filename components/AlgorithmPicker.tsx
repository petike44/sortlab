import { SortingAlgorithm } from '@/types/sorting';
import { ALGORITHM_ORDER, ALGORITHMS } from '@/lib/algorithms';

interface AlgorithmPickerProps {
  algorithm: SortingAlgorithm;
  disabled?: boolean;
  onChange: (algorithm: SortingAlgorithm) => void;
}

export function AlgorithmPicker({ algorithm, disabled, onChange }: AlgorithmPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ALGORITHM_ORDER.map((id) => {
        const meta = ALGORITHMS[id];
        const isActive = algorithm === id;
        const isChaos = meta.category === 'chaos';

        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            className={`algo-card text-left p-2.5 sm:p-3 rounded-xl border bg-white/[0.03] disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive ? `active ${isChaos ? 'chaos' : ''}` : 'border-white/8'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl leading-none">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold truncate">{meta.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{meta.timeComplexity.average}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
