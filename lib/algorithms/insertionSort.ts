import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Insertion Sort Generator
 * Builds sorted array one item at a time
 */
export function* insertionSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx === i ? 'comparing' : 
               idx < i ? 'sorted' : 'default'
      })),
      comparingIndices: [i],
      message: `Inserting ${key.value} into sorted portion`
    };

    // Shift elements
    while (j >= 0 && arr[j].value > key.value) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === j ? 'comparing' : 
                 idx === j + 1 ? 'swapping' : 
                 idx < i ? 'sorted' : 'default'
        })),
        comparingIndices: [j, j + 1],
        message: `Comparing ${arr[j].value} > ${key.value}, shifting right`
      };

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx <= i ? 'sorted' : 'default'
      })),
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      message: `Inserted ${key.value} at position ${j + 1}`
    };
  }

  // Final state
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}
