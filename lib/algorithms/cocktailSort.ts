import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* cocktailSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      yield {
        array: withStates(arr, (idx) =>
          idx === i || idx === i + 1
            ? 'comparing'
            : idx < start
              ? 'sorted'
              : 'default'
        ),
        comparingIndices: [i, i + 1],
        message: `→ Forward: ${arr[i].value} vs ${arr[i + 1].value}`,
      };

      if (arr[i].value > arr[i + 1].value) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;

        yield {
          array: withStates(arr, (idx) =>
            idx === i || idx === i + 1 ? 'swapping' : 'default'
          ),
          swappingIndices: [i, i + 1],
          message: `Swapped ${arr[i].value} ↔ ${arr[i + 1].value}`,
        };
      }
    }

    if (!swapped) break;
    end--;

    for (let i = end; i > start; i--) {
      yield {
        array: withStates(arr, (idx) =>
          idx === i || idx === i - 1 ? 'comparing' : 'default'
        ),
        comparingIndices: [i - 1, i],
        message: `← Backward: ${arr[i - 1].value} vs ${arr[i].value}`,
      };

      if (arr[i - 1].value > arr[i].value) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;

        yield {
          array: withStates(arr, (idx) =>
            idx === i || idx === i - 1 ? 'swapping' : 'default'
          ),
          swappingIndices: [i - 1, i],
          message: `Swapped ${arr[i - 1].value} ↔ ${arr[i].value}`,
        };
      }
    }

    start++;
  }

  yield completeStep(arr);
}
