import { ArrayItem } from '@/types/sorting';

/**
 * Generate a random array of items with unique IDs
 */
export function generateRandomArray(size: number, min = 10, max = 100): ArrayItem[] {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Date.now()}`,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    state: 'default' as const
  }));
}

/**
 * Reset all items to default state
 */
export function resetArrayStates(items: ArrayItem[]): ArrayItem[] {
  return items.map(item => ({ ...item, state: 'default' as const }));
}

/**
 * Check if array is sorted
 */
export function isSorted(items: ArrayItem[]): boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].value > items[i + 1].value) {
      return false;
    }
  }
  return true;
}
