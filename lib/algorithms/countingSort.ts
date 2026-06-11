import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';

export function* countingSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  if (arr.length === 0) return;

  const min = Math.min(...arr.map((x) => x.value));
  const max = Math.max(...arr.map((x) => x.value));
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output: ArrayItem[] = new Array(arr.length);

  yield {
    array: withStates(arr, () => 'highlighted'),
    message: `Counting values in range ${min}–${max}`,
  };

  for (let i = 0; i < arr.length; i++) {
    count[arr[i].value - min]++;
    yield {
      array: withStates(arr, (idx) => (idx === i ? 'active' : 'highlighted')),
      message: `Count[${arr[i].value}] → ${count[arr[i].value - min]}`,
    };
  }

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  yield {
    array: withStates(arr, () => 'comparing'),
    message: 'Prefix sums computed — placing elements',
  };

  for (let i = arr.length - 1; i >= 0; i--) {
    const pos = count[arr[i].value - min] - 1;
    output[pos] = { ...arr[i], state: 'sorted' };
    count[arr[i].value - min]--;

    yield {
      array: arr.map((item, idx) => ({
        ...(idx === i ? item : output[idx] ?? item),
        state:
          idx === i
            ? 'swapping'
            : output[idx]
              ? 'sorted'
              : 'default',
      })),
      message: `Place ${arr[i].value} at index ${pos}`,
    };
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }

  yield completeStep(arr);
}
