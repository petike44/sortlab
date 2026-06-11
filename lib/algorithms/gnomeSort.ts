import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* gnomeSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  let i = 1;

  while (i < arr.length) {
    if (i === 0 || arr[i].value >= arr[i - 1].value) {
      yield {
        array: withStates(arr, (idx) =>
          idx === i ? 'comparing' : idx < i ? 'sorted' : 'default'
        ),
        comparingIndices: i > 0 ? [i - 1, i] : [i],
        message:
          i === 0
            ? `Gnome waddles forward from start`
            : `${arr[i].value} ≥ ${arr[i - 1].value} — step forward`,
      };
      i++;
    } else {
      yield {
        array: withStates(arr, (idx) =>
          idx === i || idx === i - 1 ? 'comparing' : 'default'
        ),
        comparingIndices: [i - 1, i],
        message: `${arr[i].value} < ${arr[i - 1].value} — swap & back up`,
      };

      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];

      yield {
        array: withStates(arr, (idx) =>
          idx === i || idx === i - 1 ? 'swapping' : 'default'
        ),
        swappingIndices: [i - 1, i],
        message: `Swapped! Gnome steps back to index ${i - 1}`,
      };

      i--;
    }
  }

  yield completeStep(arr, 'Gnome reached the end — sorted!');
}
