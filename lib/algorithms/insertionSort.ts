import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Heap Sort Generator
 * Sorts array using a binary heap data structure
 */
export function* heapSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, false);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Swap root with last element
    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx === 0 || idx === i ? 'swapping' : idx > i ? 'sorted' : 'default'
      })),
      comparingIndices: [0, i],
      message: `Swapping root ${arr[0].value} with ${arr[i].value}`
    };

    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Heapify reduced heap
    yield* heapify(arr, i, 0, true);
  }

  // Final state
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}

function* heapify(arr: ArrayItem[], n: number, i: number, showSorted: boolean): SortingGenerator {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left].value > arr[largest].value) {
    largest = left;
  }

  if (right < n && arr[right].value > arr[largest].value) {
    largest = right;
  }

  if (largest !== i) {
    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx === i || idx === largest ? 'swapping' : showSorted && idx >= n ? 'sorted' : 'default'
      })),
      comparingIndices: [i, largest],
      message: `Swapping ${arr[i].value} with ${arr[largest].value}`
    };

    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    yield* heapify(arr, n, largest, showSorted);
  }
}
