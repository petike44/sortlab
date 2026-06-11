import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* heapSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, false);
  }

  for (let i = n - 1; i > 0; i--) {
    yield {
      array: withStates(arr, (idx) =>
        idx === 0 || idx === i ? 'swapping' : idx > i ? 'sorted' : 'default'
      ),
      comparingIndices: [0, i],
      message: `Extracting max ${arr[0].value} → position ${i}`,
    };

    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield* heapify(arr, i, 0, true);
  }

  yield completeStep(arr);
}

function* heapify(
  arr: ArrayItem[],
  n: number,
  i: number,
  showSorted: boolean
): SortingGenerator {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left].value > arr[largest].value) largest = left;
  if (right < n && arr[right].value > arr[largest].value) largest = right;

  if (largest !== i) {
    yield {
      array: withStates(arr, (idx) =>
        idx === i || idx === largest
          ? 'swapping'
          : showSorted && idx >= n
            ? 'sorted'
            : 'default'
      ),
      comparingIndices: [i, largest],
      message: `Heapify: swap ${arr[i].value} ↔ ${arr[largest].value}`,
    };

    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield* heapify(arr, n, largest, showSorted);
  }
}
