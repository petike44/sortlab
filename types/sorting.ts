/**
 * Core types for SortLab sorting visualizer
 */

export type VisualizationMode = 'bars' | 'boxes' | 'dots';

export type ArrayItemState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'partitioned'
  | 'active'
  | 'highlighted';

export interface ArrayItem {
  id: string;
  value: number;
  state: ArrayItemState;
}

export type SortingAlgorithm =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'heap'
  | 'merge'
  | 'quick'
  | 'shell'
  | 'cocktail'
  | 'counting'
  | 'gnome'
  | 'bogo';

export type AlgorithmCategory = 'comparison' | 'non-comparison' | 'chaos';

export type ArrayPreset = 'random' | 'reversed' | 'nearly-sorted' | 'few-unique';

export interface SortingStep {
  array: ArrayItem[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  message?: string;
}

export interface AlgorithmMetadata {
  id: SortingAlgorithm;
  name: string;
  emoji: string;
  category: AlgorithmCategory;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  funFact?: string;
}

export type SortingGenerator = Generator<SortingStep, void, unknown>;

export interface PlaybackState {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
}
