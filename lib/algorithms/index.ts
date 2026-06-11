import { SortingAlgorithm, AlgorithmMetadata, ArrayItem, SortingGenerator } from '@/types/sorting';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { heapSort } from './heapSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { shellSort } from './shellSort';
import { cocktailSort } from './cocktailSort';
import { countingSort } from './countingSort';
import { gnomeSort } from './gnomeSort';
import { bogoSort } from './bogoSort';

export const ALGORITHM_ORDER: SortingAlgorithm[] = [
  'bubble',
  'selection',
  'insertion',
  'shell',
  'cocktail',
  'gnome',
  'heap',
  'merge',
  'quick',
  'counting',
  'bogo',
];

export const ALGORITHMS: Record<SortingAlgorithm, AlgorithmMetadata> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    emoji: '🫧',
    category: 'comparison',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent out-of-order pairs',
    funFact: 'Simple but slow — great for teaching!',
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    emoji: '🎯',
    category: 'comparison',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Finds the minimum and places it at the front',
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    emoji: '🃏',
    category: 'comparison',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Builds a sorted prefix by inserting each element',
    funFact: 'Fast on nearly-sorted data — used in Timsort!',
  },
  shell: {
    id: 'shell',
    name: 'Shell Sort',
    emoji: '🐚',
    category: 'comparison',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Insertion sort with shrinking gaps',
  },
  cocktail: {
    id: 'cocktail',
    name: 'Cocktail Sort',
    emoji: '🍸',
    category: 'comparison',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Bubble sort that sweeps both directions',
    funFact: 'Also called shaker sort — shakes the array!',
  },
  gnome: {
    id: 'gnome',
    name: 'Gnome Sort',
    emoji: '🧙',
    category: 'comparison',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Walks forward, steps back on swaps — like a garden gnome',
    funFact: 'Named after how a gnome sorts flower pots on a shelf',
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    emoji: '🌳',
    category: 'comparison',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    description: 'Builds a max-heap, then extracts elements',
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    emoji: '🔀',
    category: 'comparison',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description: 'Divide, conquer, merge sorted halves',
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    emoji: '⚡',
    category: 'comparison',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    description: 'Partitions around a pivot recursively',
  },
  counting: {
    id: 'counting',
    name: 'Counting Sort',
    emoji: '🔢',
    category: 'non-comparison',
    timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
    spaceComplexity: 'O(k)',
    description: 'Counts occurrences — no comparisons needed',
  },
  bogo: {
    id: 'bogo',
    name: 'Bogo Sort',
    emoji: '🎲',
    category: 'chaos',
    timeComplexity: { best: 'O(n)', average: 'O((n+1)!)', worst: '∞' },
    spaceComplexity: 'O(1)',
    description: 'Randomly shuffles until sorted. Pure chaos.',
    funFact: 'Also called "stupid sort" — average case is O((n+1)!)!',
  },
};

export function getSortingGenerator(
  algorithm: SortingAlgorithm,
  items: ArrayItem[]
): SortingGenerator {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort(items);
    case 'selection':
      return selectionSort(items);
    case 'insertion':
      return insertionSort(items);
    case 'heap':
      return heapSort(items);
    case 'merge':
      return mergeSort(items);
    case 'quick':
      return quickSort(items);
    case 'shell':
      return shellSort(items);
    case 'cocktail':
      return cocktailSort(items);
    case 'counting':
      return countingSort(items);
    case 'gnome':
      return gnomeSort(items);
    case 'bogo':
      return bogoSort(items);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

export function generateAllSteps(algorithm: SortingAlgorithm, items: ArrayItem[]) {
  const generator = getSortingGenerator(algorithm, items);
  const steps = [];
  let result = generator.next();
  while (!result.done) {
    steps.push(result.value);
    result = generator.next();
  }
  return steps;
}
