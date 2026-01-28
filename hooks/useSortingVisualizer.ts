'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrayItem, SortingAlgorithm, SortingStep, PlaybackState } from '@/types/sorting';
import { getSortingGenerator } from '@/lib/algorithms';
import { generateRandomArray, resetArrayStates } from '@/lib/utils/arrayUtils';

interface UseSortingVisualizerOptions {
  initialSize?: number;
  initialSpeed?: number;
  initialAlgorithm?: SortingAlgorithm;
}

export function useSortingVisualizer({
  initialSize = 50,
  initialSpeed = 50,
  initialAlgorithm = 'bubble'
}: UseSortingVisualizerOptions = {}) {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(initialAlgorithm);
  const [arraySize, setArraySize] = useState(initialSize);
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    speed: initialSpeed,
    currentStep: 0,
    totalSteps: 0
  });
  const [currentMessage, setCurrentMessage] = useState<string>('');

  // Initialize array after mount to avoid hydration mismatch
  useEffect(() => {
    setArray(generateRandomArray(initialSize));
  }, []);

  // Refs for animation control
  const generatorRef = useRef<Generator<SortingStep, void, unknown> | null>(null);
  const stepsRef = useRef<SortingStep[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);

  /**
   * Initialize a new sorting process
   */
  const initializeSorting = useCallback(() => {
    const items = resetArrayStates(array);
    generatorRef.current = getSortingGenerator(algorithm, items);
    stepsRef.current = [];
    
    // Pre-generate all steps for step-through mode
    const generator = getSortingGenerator(algorithm, items);
    const steps: SortingStep[] = [];
    let result = generator.next();
    
    while (!result.done) {
      steps.push(result.value);
      result = generator.next();
    }
    
    stepsRef.current = steps;
    
    setPlayback(prev => ({
      ...prev,
      currentStep: 0,
      totalSteps: steps.length
    }));
    
    setArray(items);
    setCurrentMessage('Ready to sort');
  }, [array, algorithm]);

  /**
   * Execute one step of the sorting algorithm
   */
  const stepForward = useCallback(() => {
    if (!generatorRef.current) {
      initializeSorting();
      return;
    }

    const result = generatorRef.current.next();
    
    if (!result.done) {
      const step = result.value;
      setArray(step.array);
      setCurrentMessage(step.message || '');
      setPlayback(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    } else {
      setPlayback(prev => ({ ...prev, isPlaying: false }));
    }
  }, [initializeSorting]);

  /**
   * Step backward (requires pre-generated steps)
   */
  const stepBackward = useCallback(() => {
    setPlayback(prev => {
      if (prev.currentStep > 0) {
        const newStep = prev.currentStep - 1;
        const step = stepsRef.current[newStep];
        
        if (step) {
          setArray(step.array);
          setCurrentMessage(step.message || '');
        }
        
        return { ...prev, currentStep: newStep };
      }
      return prev;
    });
  }, []);

  /**
   * Jump to specific step
   */
  const jumpToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < stepsRef.current.length) {
      const step = stepsRef.current[stepIndex];
      setArray(step.array);
      setCurrentMessage(step.message || '');
      setPlayback(prev => ({ ...prev, currentStep: stepIndex }));
    }
  }, []);

  /**
   * Animation loop using requestAnimationFrame
   */
  const animate = useCallback((timestamp: number) => {
    if (!playback.isPlaying) return;

    const elapsed = timestamp - lastStepTimeRef.current;
    const stepDelay = 1000 - (playback.speed * 10); // Convert speed to delay

    if (elapsed >= stepDelay) {
      lastStepTimeRef.current = timestamp;
      
      if (playback.currentStep < stepsRef.current.length) {
        const step = stepsRef.current[playback.currentStep];
        setArray(step.array);
        setCurrentMessage(step.message || '');
        setPlayback(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1
        }));
      } else {
        setPlayback(prev => ({ ...prev, isPlaying: false }));
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [playback.isPlaying, playback.speed, playback.currentStep]);

  /**
   * Play/pause control
   */
  const togglePlayback = useCallback(() => {
    if (!playback.isPlaying) {
      // Starting animation
      if (playback.currentStep === 0 || stepsRef.current.length === 0) {
        // Need to initialize
        const items = resetArrayStates(array);
        const generator = getSortingGenerator(algorithm, items);
        const steps: SortingStep[] = [];
        let result = generator.next();
        
        while (!result.done) {
          steps.push(result.value);
          result = generator.next();
        }
        
        stepsRef.current = steps;
        setArray(items);
        setPlayback(prev => ({
          ...prev,
          currentStep: 0,
          totalSteps: steps.length,
          isPlaying: true
        }));
      } else {
        // Resume
        setPlayback(prev => ({ ...prev, isPlaying: true }));
      }
      lastStepTimeRef.current = performance.now();
    } else {
      // Pausing
      setPlayback(prev => ({ ...prev, isPlaying: false }));
    }
  }, [playback.isPlaying, playback.currentStep, array, algorithm]);

  /**
   * Reset everything
   */
  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    generatorRef.current = null;
    stepsRef.current = [];
    
    setPlayback({
      isPlaying: false,
      speed: playback.speed,
      currentStep: 0,
      totalSteps: 0
    });
    
    setArray(generateRandomArray(arraySize));
    setCurrentMessage('');
  }, [arraySize, playback.speed]);

  /**
   * Change array size
   */
  const changeArraySize = useCallback((size: number) => {
    setArraySize(size);
    setArray(generateRandomArray(size));
    generatorRef.current = null;
    stepsRef.current = [];
    setPlayback(prev => ({
      ...prev,
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0
    }));
  }, []);

  /**
   * Change speed
   */
  const changeSpeed = useCallback((speed: number) => {
    setPlayback(prev => ({ ...prev, speed }));
  }, []);

  /**
   * Change algorithm
   */
  const changeAlgorithm = useCallback((newAlgorithm: SortingAlgorithm) => {
    setAlgorithm(newAlgorithm);
    generatorRef.current = null;
    stepsRef.current = [];
    setPlayback(prev => ({
      ...prev,
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0
    }));
    setArray(prev => resetArrayStates(prev));
  }, []);

  // Animation loop effect
  useEffect(() => {
    if (playback.isPlaying) {
      lastStepTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playback.isPlaying, animate]);

  return {
    array,
    algorithm,
    arraySize,
    playback,
    currentMessage,
    togglePlayback,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    changeArraySize,
    changeSpeed,
    changeAlgorithm
  };
}
