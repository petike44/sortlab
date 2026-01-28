import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Selection Sort Generator
 * Finds minimum element and places it at the beginning
 */
export function* selectionSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find minimum element
    for (let j = i + 1; j < n; j++) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === minIdx ? 'swapping' : 
                 idx === j ? 'comparing' : 
                 idx < i ? 'sorted' : 'default'
        })),
        comparingIndices: [j, minIdx],
        message: `Finding minimum: comparing ${arr[j].value} with current min ${arr[minIdx].value}`
      };

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
      }
    }

    // Swap if needed
    if (minIdx !== i) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === i || idx === minIdx ? 'swapping' : 
                 idx < i ? 'sorted' : 'default'
        })),
        swappingIndices: [i, minIdx],
        message: `Swapping ${arr[i].value} with minimum ${arr[minIdx].value}`
      };

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // Mark as sorted
    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx <= i ? 'sorted' : 'default'
      })),
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      message: `Placed ${arr[i].value} in position ${i}`
    };
  }

  // Final state
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}
