import { ArrayItem, ArrayPreset, SortingAlgorithm } from '@/types/sorting';

let idCounter = 0;

function createItem(value: number): ArrayItem {
  return {
    id: `item-${idCounter++}`,
    value,
    state: 'default',
  };
}

export function generateRandomArray(size: number, min = 5, max = 99): ArrayItem[] {
  return Array.from({ length: size }, () =>
    createItem(Math.floor(Math.random() * (max - min + 1)) + min)
  );
}

export function generatePresetArray(size: number, preset: ArrayPreset): ArrayItem[] {
  const min = 5;
  const max = 99;

  switch (preset) {
    case 'reversed': {
      const span = Math.min(size, max - min + 1);
      return Array.from({ length: size }, (_, i) =>
        createItem(max - Math.floor((i * span) / Math.max(size - 1, 1)))
      );
    }
    case 'nearly-sorted': {
      const base = Array.from({ length: size }, (_, i) =>
        createItem(min + Math.floor((i * (max - min)) / Math.max(size - 1, 1)))
      );
      for (let swaps = 0; swaps < Math.max(1, Math.floor(size * 0.15)); swaps++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        [base[a].value, base[b].value] = [base[b].value, base[a].value];
      }
      return base;
    }
    case 'few-unique': {
      const unique = [12, 34, 56, 78, 90];
      return Array.from({ length: size }, () =>
        createItem(unique[Math.floor(Math.random() * unique.length)])
      );
    }
    case 'random':
    default:
      return generateRandomArray(size, min, max);
  }
}

export function resetArrayStates(items: ArrayItem[]): ArrayItem[] {
  return items.map((item) => ({ ...item, state: 'default' as const }));
}

export function isSorted(items: ArrayItem[]): boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].value > items[i + 1].value) return false;
  }
  return true;
}

export function getMaxArraySize(algorithm: SortingAlgorithm): number {
  if (algorithm === 'bogo') return 10;
  if (algorithm === 'counting') return 40;
  return 50;
}

export function getRecommendedSize(algorithm: SortingAlgorithm): number {
  if (algorithm === 'bogo') return 8;
  return 20;
}
