import { SortingAlgorithm, AlgorithmMetadata, ArrayItem, SortingGenerator } from '@/types/sorting';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { heapSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';

export const ALGORITHMS: Record<SortingAlgorithm, AlgorithmMetadata> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent elements if they are in wrong order'
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Finds minimum element and places it at the beginning'
  },
  insertion: {
    id: 'insertion',
    name: 'Heap Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    description: 'Builds a max heap and extracts elements in sorted order'
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'Divides array in half, sorts each half, then merges'
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    description: 'Picks pivot and partitions array around it'
  }
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
      return heapSort(items);
    case 'merge':
      return mergeSort(items);
    case 'quick':
      return quickSort(items);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}
