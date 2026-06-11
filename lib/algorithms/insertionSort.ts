import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* insertionSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield {
      array: withStates(arr, (idx) =>
        idx === i ? 'active' : idx < i ? 'sorted' : 'default'
      ),
      message: `Inserting ${key.value} into sorted prefix`,
    };

    while (j >= 0 && arr[j].value > key.value) {
      yield {
        array: withStates(arr, (idx) =>
          idx === j || idx === j + 1
            ? 'comparing'
            : idx < j
              ? 'sorted'
              : 'default'
        ),
        comparingIndices: [j, j + 1],
        message: `${arr[j].value} > ${key.value} — shift right`,
      };

      arr[j + 1] = arr[j];

      yield {
        array: withStates(arr, (idx) =>
          idx === j + 1 ? 'swapping' : idx <= j ? 'sorted' : 'default'
        ),
        swappingIndices: [j, j + 1],
        message: `Shifted ${arr[j + 1].value} to index ${j + 1}`,
      };

      j--;
    }

    arr[j + 1] = key;

    yield {
      array: withStates(arr, (idx) => (idx <= i ? 'sorted' : 'default')),
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      message: `${key.value} placed at index ${j + 1}`,
    };
  }

  yield completeStep(arr);
}
