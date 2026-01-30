/**
 * Core types for SortLab sorting visualizer
 */

export type AnimationStyle = 'classic' | 'bounce' | 'glow';

export type ArrayItemState = 
  | 'default'
  | 'comparing' 
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'partitioned';

export interface ArrayItem {
  id: string;
  value: number;
  state: ArrayItemState;
}

export type SortingAlgorithm = 
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick';

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
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
}

export type SortingGenerator = Generator<SortingStep, void, unknown>;

export interface PlaybackState {
  isPlaying: boolean;
  speed: number; // ms per step
  currentStep: number;
  totalSteps: number;
}
