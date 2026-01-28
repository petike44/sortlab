# SortLab Architecture Guide

## Overview

SortLab uses a **generator-based architecture** where sorting algorithms are implemented as JavaScript generators that yield discrete visualization steps. This approach provides clean separation of concerns and deterministic animation control.

## Core Architecture Principles

### 1. Generator-Based Algorithm Design

**Problem solved**: Traditional setTimeout/setInterval chains are hard to control, pause, or step through.

**Solution**: Generators yield individual steps that can be consumed at any pace.

```typescript
function* bubbleSort(items: ArrayItem[]): SortingGenerator {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Yield comparison state
      yield {
        array: currentState,
        comparingIndices: [j, j + 1],
        message: 'Comparing...'
      };
      
      // Perform swap if needed
      if (needsSwap) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // Yield swap state
        yield {
          array: newState,
          swappingIndices: [j, j + 1],
          message: 'Swapping...'
        };
      }
    }
  }
}
```

### 2. Pre-Generated Step History

**Implementation**: All steps are generated upfront and stored in an array.

```typescript
const generator = getSortingGenerator(algorithm, items);
const steps: SortingStep[] = [];
let result = generator.next();

while (!result.done) {
  steps.push(result.value);
  result = generator.next();
}
```

**Benefits**:
- Enables backward stepping
- Allows progress bar with known total
- Jump to any arbitrary step instantly
- Predictable memory usage

**Trade-off**: Large arrays (100+ elements) with O(n²) algorithms generate thousands of steps. Current implementation handles this fine for educational purposes (10-100 elements).

### 3. Animation Loop Architecture

**requestAnimationFrame-driven timing**:

```typescript
const animate = useCallback((timestamp: number) => {
  const elapsed = timestamp - lastStepTimeRef.current;
  const stepDelay = 1000 - (playback.speed * 10); // Speed control

  if (elapsed >= stepDelay) {
    lastStepTimeRef.current = timestamp;
    
    const step = stepsRef.current[playback.currentStep];
    setArray(step.array);
    setCurrentMessage(step.message);
    setPlayback(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
  }

  if (playback.isPlaying && playback.currentStep < totalSteps) {
    animationFrameRef.current = requestAnimationFrame(animate);
  }
}, [playback]);
```

**Key aspects**:
- Runs at 60fps but only executes steps at configured speed
- Clean cleanup on unmount
- Smooth, non-blocking animations
- React state updates trigger CSS transitions

### 4. State Management Flow

```
User Action
    ↓
useSortingVisualizer Hook
    ↓
Pre-generate all steps (if new sort)
    ↓
Animation Loop (requestAnimationFrame)
    ↓
Update React State
    ↓
Components Re-render
    ↓
CSS Transitions Animate
```

## Data Structures

### ArrayItem

```typescript
interface ArrayItem {
  id: string;           // Unique identifier for React keys
  value: number;        // The sortable value
  state: ArrayItemState; // Visual state
}
```

**Design notes**:
- `id` is generated with timestamp to ensure uniqueness across resets
- `value` is the actual number being sorted
- `state` drives visual representation

### SortingStep

```typescript
interface SortingStep {
  array: ArrayItem[];          // Complete array state at this step
  comparingIndices?: number[]; // Indices being compared
  swappingIndices?: number[];  // Indices being swapped
  sortedIndices?: number[];    // Indices now in final position
  pivotIndex?: number;         // Pivot for Quick Sort
  message?: string;            // Human-readable description
}
```

**Design notes**:
- Immutable snapshots of array state
- Optional indices for highlighting specific operations
- Message provides educational context

### PlaybackState

```typescript
interface PlaybackState {
  isPlaying: boolean;   // Animation running?
  speed: number;        // 1-100, controls delay between steps
  currentStep: number;  // Index in steps array
  totalSteps: number;   // Total steps in current sort
}
```

## Component Hierarchy

```
page.tsx (Main App)
├── Controls
│   ├── Algorithm Selector
│   ├── Array Size Slider
│   ├── Speed Slider
│   ├── Playback Buttons
│   ├── Algorithm Info Card
│   └── Legend
└── Visualizer
    ├── Message Display
    └── Bar (multiple)
        └── Colored div with height based on value
```

### Component Responsibilities

**Controls**:
- User input collection
- Display current algorithm metadata
- Playback control interface
- No sorting logic—purely presentational

**Visualizer**:
- Layout bars in flexbox
- Display current message
- Calculate max value for height normalization
- No animation logic—receives props

**Bar**:
- Visual representation of single element
- Maps state to color
- CSS transitions for smooth changes
- Tooltip with value and state

## Animation Strategy

### Two-Layer Approach

**Layer 1: Discrete Steps (JavaScript)**
- Generator yields distinct states
- React updates component state
- Controlled by requestAnimationFrame

**Layer 2: Visual Interpolation (CSS)**
```css
.bar {
  transition: all 300ms ease-out;
}
```

This creates smooth visual motion between discrete logical steps.

### Why This Works

1. **Separation**: Algorithm logic is pure—no knowledge of timing
2. **Control**: Animation speed adjustable without touching algorithms
3. **Performance**: CSS transitions are GPU-accelerated
4. **Clarity**: Each layer has single responsibility

## Type Safety

### Strict TypeScript Configuration

- `strict: true` enables all strict checks
- No implicit any
- Strict null checks
- All functions have return types

### Generic Constraints

```typescript
type SortingGenerator = Generator<SortingStep, void, unknown>;
```

Ensures all sorting functions return correct type.

## Performance Considerations

### Memory

- Pre-generating steps: O(number of comparisons)
  - Bubble Sort: ~O(n²) steps for n elements
  - Merge Sort: ~O(n log n) steps
- Each step stores full array copy (immutability)
- For n=100, worst case ~10,000 steps × array size = manageable

### CPU

- requestAnimationFrame runs at 60fps
- Step execution is O(1)—just array lookup
- React reconciliation optimized by unique `key` props
- CSS transitions handled by browser compositor

### Optimization Opportunities (Future)

1. **Lazy step generation**: Generate steps on-demand
2. **Step diffing**: Store deltas instead of full arrays
3. **Web Workers**: Offload step generation to worker thread
4. **Virtual scrolling**: For very large arrays

## Extending the System

### Adding New Algorithms

1. **Create generator** following pattern:
```typescript
export function* mySort(items: ArrayItem[]): SortingGenerator {
  // Yield steps with appropriate states
}
```

2. **Register metadata**:
```typescript
ALGORITHMS.mysort = {
  id: 'mysort',
  name: 'My Sort',
  timeComplexity: { ... },
  description: '...'
};
```

3. **Add to factory**:
```typescript
case 'mysort':
  return mySort(items);
```

### Adding New Visual States

1. **Extend type**: Add to `ArrayItemState` union
2. **Add color**: Update `STATE_COLORS` in Bar component
3. **Update legend**: Add entry in Controls component

### Adding New Features

**Example: Undo/Redo**:
```typescript
const [history, setHistory] = useState<number[]>([0]);
const [historyIndex, setHistoryIndex] = useState(0);

const undo = () => {
  if (historyIndex > 0) {
    jumpToStep(history[historyIndex - 1]);
    setHistoryIndex(historyIndex - 1);
  }
};
```

**Example: Speed Presets**:
```typescript
const SPEEDS = {
  slow: 20,
  normal: 50,
  fast: 80,
  instant: 100
};
```

## Testing Strategy (Recommended)

### Unit Tests
- Generator correctness: Verify final array is sorted
- Step validation: Ensure indices are valid
- Utility functions: Array generation, state reset

### Integration Tests
- Hook behavior: Play, pause, step, reset
- Component rendering: Correct number of bars
- State transitions: Colors update properly

### E2E Tests
- Full sorting workflow
- Speed adjustment during playback
- Algorithm switching

## Summary

SortLab's architecture prioritizes:
1. **Educational clarity**: Code mirrors algorithm descriptions
2. **Deterministic behavior**: No race conditions or timing bugs
3. **Extensibility**: Easy to add algorithms and features
4. **Type safety**: Catch errors at compile time
5. **Performance**: Smooth animations without blocking UI

The generator-based approach is the key innovation—it turns imperative sorting logic into declarative step sequences that can be consumed in any manner: continuously, step-by-step, forward, backward, or jumping to arbitrary positions.
