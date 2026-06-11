import { ArrayItem, ArrayItemState } from '@/types/sorting';

export function withStates(
  arr: ArrayItem[],
  stateFn: (idx: number) => ArrayItemState
): ArrayItem[] {
  return arr.map((item, idx) => ({ ...item, state: stateFn(idx) }));
}

export function sortedTail(n: number, offset: number): (idx: number) => ArrayItemState {
  return (idx) => (idx >= n - offset ? 'sorted' : 'default');
}

export function completeStep(arr: ArrayItem[], message = 'Sorting complete!') {
  return {
    array: withStates(arr, () => 'sorted'),
    sortedIndices: arr.map((_, i) => i),
    message,
  };
}
