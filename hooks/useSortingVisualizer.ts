'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ArrayItem,
  SortingAlgorithm,
  SortingStep,
  PlaybackState,
  ArrayPreset,
  SortStats,
} from '@/types/sorting';
import { generateAllSteps } from '@/lib/algorithms';
import {
  generatePresetArray,
  resetArrayStates,
  getMaxArraySize,
  getRecommendedSize,
} from '@/lib/utils/arrayUtils';

interface UseSortingVisualizerOptions {
  initialSize?: number;
  initialSpeed?: number;
  initialAlgorithm?: SortingAlgorithm;
}

function computeStats(steps: SortingStep[]): SortStats {
  let comparisons = 0;
  let swaps = 0;
  for (const step of steps) {
    if (step.comparingIndices?.length) comparisons++;
    if (step.swappingIndices?.length) swaps++;
  }
  return { comparisons, swaps };
}

function speedToDelay(speed: number): number {
  return Math.max(16, 520 - speed * 5);
}

export function useSortingVisualizer({
  initialSize = 20,
  initialSpeed = 55,
  initialAlgorithm = 'bubble',
}: UseSortingVisualizerOptions = {}) {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(initialAlgorithm);
  const [arraySize, setArraySize] = useState(initialSize);
  const [preset, setPreset] = useState<ArrayPreset>('random');
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    speed: initialSpeed,
    currentStep: 0,
    totalSteps: 0,
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [stats, setStats] = useState<SortStats>({ comparisons: 0, swaps: 0 });
  const [isReady, setIsReady] = useState(false);

  const stepsRef = useRef<SortingStep[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const playingRef = useRef(false);
  const stepIndexRef = useRef(0);
  const speedRef = useRef(initialSpeed);
  const tickRef = useRef<(timestamp: number) => void>(() => {});

  const applyStep = useCallback((index: number) => {
    const step = stepsRef.current[index];
    if (!step) return;
    setArray(step.array);
    setCurrentMessage(step.message || '');
    stepIndexRef.current = index;
    setPlayback((prev) => ({ ...prev, currentStep: index }));
  }, []);

  const buildSteps = useCallback(
    (items: ArrayItem[], algo: SortingAlgorithm = algorithm) => {
      const clean = resetArrayStates(items);
      const steps = generateAllSteps(algo, clean);
      stepsRef.current = steps;
      setStats(computeStats(steps));
      setArray(clean);
      setPlayback((prev) => ({
        ...prev,
        currentStep: 0,
        totalSteps: steps.length,
        isPlaying: false,
      }));
      stepIndexRef.current = 0;
      setCurrentMessage(steps.length ? 'Ready — press Play' : 'No steps generated');
      setIsReady(steps.length > 0);
      return steps;
    },
    [algorithm]
  );

  useEffect(() => {
    const items = generatePresetArray(initialSize, 'random');
    buildSteps(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only init
  }, []);

  const stopPlayback = useCallback(() => {
    playingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setPlayback((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  tickRef.current = (timestamp: number) => {
    if (!playingRef.current) return;

    if (lastTickRef.current === 0) lastTickRef.current = timestamp;
    const elapsed = timestamp - lastTickRef.current;

    if (elapsed >= speedToDelay(speedRef.current)) {
      lastTickRef.current = timestamp;
      const next = stepIndexRef.current + 1;

      if (next < stepsRef.current.length) {
        applyStep(next);
      } else {
        stopPlayback();
        return;
      }
    }

    rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
  };

  const startPlayback = useCallback(() => {
    if (stepsRef.current.length === 0) {
      buildSteps(array);
    }

    if (stepIndexRef.current >= stepsRef.current.length) {
      stepIndexRef.current = 0;
      applyStep(0);
    }

    playingRef.current = true;
    lastTickRef.current = 0;
    setPlayback((prev) => ({ ...prev, isPlaying: true }));
    rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
  }, [array, applyStep, buildSteps]);

  const togglePlayback = useCallback(() => {
    if (playingRef.current) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [startPlayback, stopPlayback]);

  const stepForward = useCallback(() => {
    stopPlayback();
    if (stepsRef.current.length === 0) {
      buildSteps(array);
      return;
    }
    const next = Math.min(stepIndexRef.current + 1, stepsRef.current.length - 1);
    if (next !== stepIndexRef.current) applyStep(next);
  }, [array, applyStep, buildSteps, stopPlayback]);

  const stepBackward = useCallback(() => {
    stopPlayback();
    const prev = Math.max(stepIndexRef.current - 1, 0);
    applyStep(prev);
  }, [applyStep, stopPlayback]);

  const jumpToStep = useCallback(
    (stepIndex: number) => {
      stopPlayback();
      const clamped = Math.max(0, Math.min(stepIndex, stepsRef.current.length - 1));
      applyStep(clamped);
    },
    [applyStep, stopPlayback]
  );

  const reset = useCallback(() => {
    stopPlayback();
    stepsRef.current = [];
    const items = generatePresetArray(arraySize, preset);
    buildSteps(items);
  }, [arraySize, preset, buildSteps, stopPlayback]);

  const changeArraySize = useCallback(
    (size: number) => {
      stopPlayback();
      const max = getMaxArraySize(algorithm);
      const clamped = Math.max(2, Math.min(size, max));
      setArraySize(clamped);
      stepsRef.current = [];
      const items = generatePresetArray(clamped, preset);
      buildSteps(items);
    },
    [algorithm, preset, buildSteps, stopPlayback]
  );

  const changeSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setPlayback((prev) => ({ ...prev, speed }));
  }, []);

  const changeAlgorithm = useCallback(
    (newAlgorithm: SortingAlgorithm) => {
      stopPlayback();
      setAlgorithm(newAlgorithm);
      const max = getMaxArraySize(newAlgorithm);
      const newSize = Math.min(arraySize, max);
      if (newSize !== arraySize) setArraySize(newSize);
      stepsRef.current = [];
      const items = generatePresetArray(newSize, preset);
      buildSteps(items, newAlgorithm);
    },
    [arraySize, preset, buildSteps, stopPlayback]
  );

  const changePreset = useCallback(
    (newPreset: ArrayPreset) => {
      stopPlayback();
      setPreset(newPreset);
      stepsRef.current = [];
      const items = generatePresetArray(arraySize, newPreset);
      buildSteps(items);
    },
    [arraySize, buildSteps, stopPlayback]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    array,
    algorithm,
    arraySize,
    preset,
    playback,
    currentMessage,
    stats,
    isReady,
    maxArraySize: getMaxArraySize(algorithm),
    recommendedSize: getRecommendedSize(algorithm),
    togglePlayback,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    changeArraySize,
    changeSpeed,
    changeAlgorithm,
    changePreset,
  };
}
