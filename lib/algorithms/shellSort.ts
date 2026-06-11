import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* shellSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  const n = arr.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    yield {
      array: withStates(arr, () => 'default'),
      message: `Gap size: ${gap}`,
    };

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap && arr[j - gap].value > temp.value) {
        yield {
          array: withStates(arr, (idx) =>
            idx === j - gap || idx === j ? 'comparing' : 'default'
          ),
          comparingIndices: [j - gap, j],
          message: `Gap ${gap}: compare ${arr[j - gap].value} vs ${temp.value}`,
        };

        arr[j] = arr[j - gap];

        yield {
          array: withStates(arr, (idx) =>
            idx === j || idx === j - gap ? 'swapping' : 'default'
          ),
          swappingIndices: [j, j - gap],
          message: `Shift ${arr[j].value} forward by gap ${gap}`,
        };

        j -= gap;
      }

      arr[j] = temp;
    }
  }

  yield completeStep(arr);
}
