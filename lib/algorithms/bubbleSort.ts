import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Bubble Sort Generator
 * Yields each step of the sorting process for visualization
 */
export function* bubbleSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === j || idx === j + 1 ? 'comparing' : 
                 idx >= n - i ? 'sorted' : 'default'
        })),
        comparingIndices: [j, j + 1],
        message: `Comparing ${arr[j].value} and ${arr[j + 1].value}`
      };

      if (arr[j].value > arr[j + 1].value) {
        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        yield {
          array: arr.map((item, idx) => ({
            ...item,
            state: idx === j || idx === j + 1 ? 'swapping' : 
                   idx >= n - i ? 'sorted' : 'default'
          })),
          swappingIndices: [j, j + 1],
          message: `Swapped ${arr[j].value} and ${arr[j + 1].value}`
        };
      }
    }

    // Mark last element as sorted
    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx >= n - i - 1 ? 'sorted' : 'default'
      })),
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      message: `Element ${arr[n - i - 1].value} is in position`
    };

    if (!swapped) break;
  }

  // Mark all as sorted
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}
