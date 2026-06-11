import { ArrayItem, SortingGenerator } from '@/types/sorting';
import { completeStep, withStates } from './helpers';
import { isSorted } from '@/lib/utils/arrayUtils';

const MAX_ATTEMPTS = 80;
const FUNNY_MESSAGES = [
  'Shuffling like a casino dealer…',
  'Nope! Still chaos. Try again!',
  'The universe says: not yet.',
  'Randomizing harder… surely THIS time?',
  'Entropy levels: maximum.',
  'Even the gnomes are confused.',
  'Maybe luck is a sorting strategy?',
  'Throwing dice… arranging bars…',
  'Schrödinger\'s sort: both sorted and not.',
  'One more shuffle for the road!',
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function* bogoSort(items: ArrayItem[]): SortingGenerator {
  const arr = [...items];
  let attempt = 0;

  yield {
    array: withStates(arr, () => 'default'),
    message: '🎲 Bogo Sort: randomly shuffle until sorted. Good luck!',
  };

  while (!isSorted(arr) && attempt < MAX_ATTEMPTS) {
    attempt++;

    yield {
      array: withStates(arr, () => 'comparing'),
      message: `Attempt ${attempt}: checking if sorted…`,
    };

    for (let s = 0; s < arr.length; s++) {
      const a = Math.floor(Math.random() * arr.length);
      const b = Math.floor(Math.random() * arr.length);
      if (a !== b) {
        yield {
          array: withStates(arr, (idx) =>
            idx === a || idx === b ? 'swapping' : 'comparing'
          ),
          swappingIndices: [a, b],
          message: FUNNY_MESSAGES[attempt % FUNNY_MESSAGES.length],
        };
        [arr[a], arr[b]] = [arr[b], arr[a]];
      }
    }

    const shuffled = shuffle(arr);
    for (let i = 0; i < arr.length; i++) arr[i] = shuffled[i];

    yield {
      array: withStates(arr, () => 'swapping'),
      message:
        attempt % 3 === 0
          ? `Attempt ${attempt}: still not sorted 😅`
          : `Full shuffle #${attempt} complete`,
    };
  }

  if (isSorted(arr)) {
    yield completeStep(arr, `🎉 Miraculously sorted after ${attempt} attempt(s)!`);
  } else {
    yield {
      array: withStates(arr, () => 'default'),
      message: `Gave up after ${MAX_ATTEMPTS} attempts. The universe won.`,
    };
    // Force-sort for display so user isn't stuck
    arr.sort((a, b) => a.value - b.value);
    yield completeStep(arr, 'Fine, we cheated and sorted it for you. 🃏');
  }
}
