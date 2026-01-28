import { ArrayItem, SortingStep, SortingGenerator } from '@/types/sorting';

/**
 * Merge Sort Generator
 * Divide and conquer with merge steps visualized
 */
export function* mergeSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];

  function* mergeSortHelper(
    start: number,
    end: number
  ): Generator<SortingStep, void, unknown> {
    if (end - start <= 1) return;

    const mid = Math.floor((start + end) / 2);

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx >= start && idx < mid ? 'comparing' : 
               idx >= mid && idx < end ? 'swapping' : 'default'
      })),
      message: `Dividing array: [${start}..${mid}) and [${mid}..${end})`
    };

    yield* mergeSortHelper(start, mid);
    yield* mergeSortHelper(mid, end);
    yield* merge(start, mid, end);
  }

  function* merge(
    start: number,
    mid: number,
    end: number
  ): Generator<SortingStep, void, unknown> {
    const left = arr.slice(start, mid);
    const right = arr.slice(mid, end);
    let i = 0, j = 0, k = start;

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx >= start && idx < end ? 'comparing' : 'default'
      })),
      message: `Merging subarrays: [${start}..${mid}) and [${mid}..${end})`
    };

    while (i < left.length && j < right.length) {
      yield {
        array: arr.map((item, idx) => ({
          ...item,
          state: idx === k ? 'swapping' : 
                 idx >= start && idx < end ? 'comparing' : 'default'
        })),
        comparingIndices: [start + i, mid + j],
        message: `Comparing ${left[i].value} and ${right[j].value}`
      };

      if (left[i].value <= right[j].value) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
    }

    yield {
      array: arr.map((item, idx) => ({
        ...item,
        state: idx >= start && idx < end ? 'partitioned' : 'default'
      })),
      message: `Merged range [${start}..${end})`
    };
  }

  yield* mergeSortHelper(0, arr.length);

  // Final state
  yield {
    array: arr.map(item => ({ ...item, state: 'sorted' })),
    sortedIndices: arr.map((_, i) => i),
    message: 'Sorting complete!'
  };
}
