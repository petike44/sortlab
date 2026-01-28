import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Quick Sort Generator
 * Partition-based sorting with pivot visualization
 */
export function* quickSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];

  function* quickSortHelper(
    low: number,
    high: number
  ): Generator<SortingStep, void, unknown> {
    if (low >= high) return;

    const pivotIdx = yield* partition(low, high);
    yield* quickSortHelper(low, pivotIdx - 1);
    yield* quickSortHelper(pivotIdx + 1, high);
  }

  function* partition(
    low: number,
    high: number
  ): Generator<SortingStep, number, unknown> {
    const pivot = arr[high];
    let i = low - 1;

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx === high ? 'pivot' : 
               idx >= low && idx <= high ? 'comparing' : 'default'
      })),
      pivotIndex: high,
      message: `Pivot: ${pivot.value} at index ${high}`
    };

    for (let j = low; j < high; j++) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === high ? 'pivot' : 
                 idx === j ? 'comparing' : 
                 idx >= low && idx <= high ? 'partitioned' : 'default'
        })),
        comparingIndices: [j, high],
        pivotIndex: high,
        message: `Comparing ${arr[j].value} with pivot ${pivot.value}`
      };

      if (arr[j].value < pivot.value) {
        i++;

        if (i !== j) {
          yield {
            array: arr.map((item, idx) => ({
              ...item,
              state: idx === i || idx === j ? 'swapping' : 
                     idx === high ? 'pivot' : 
                     idx >= low && idx <= high ? 'partitioned' : 'default'
            })),
            swappingIndices: [i, j],
            pivotIndex: high,
            message: `Swapping ${arr[i].value} and ${arr[j].value}`
          };

          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    // Place pivot in correct position
    const pivotPosition = i + 1;
    if (pivotPosition !== high) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === pivotPosition || idx === high ? 'swapping' : 
                 idx >= low && idx <= high ? 'partitioned' : 'default'
        })),
        swappingIndices: [pivotPosition, high],
        message: `Placing pivot ${pivot.value} at position ${pivotPosition}`
      };

      [arr[pivotPosition], arr[high]] = [arr[high], arr[pivotPosition]];
    }

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx === pivotPosition ? 'sorted' : 'default'
      })),
      sortedIndices: [pivotPosition],
      message: `Pivot ${pivot.value} is in correct position`
    };

    return pivotPosition;
  }

  yield* quickSortHelper(0, arr.length - 1);

  // Final state
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}
