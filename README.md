# SortLab - Interactive Sorting Algorithm Visualizer

A clean, educational web application for visualizing sorting algorithms with smooth animations and intuitive controls.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view SortLab.

## Architecture Overview

### Core Philosophy
- **Generator-based state management**: Each algorithm is implemented as a JavaScript generator that yields discrete sorting steps
- **Deterministic animations**: No scattered setTimeout chains—animation driven by requestAnimationFrame with predictable state
- **Type-safe**: Full TypeScript coverage with strict typing
- **Separation of concerns**: Algorithm logic completely decoupled from UI

### Project Structure

```
sortlab/
├── types/
│   └── sorting.ts              # Core TypeScript interfaces
├── lib/
│   ├── algorithms/
│   │   ├── bubbleSort.ts       # Generator for Bubble Sort
│   │   ├── selectionSort.ts    # Generator for Selection Sort
│   │   ├── insertionSort.ts    # Generator for Insertion Sort
│   │   ├── mergeSort.ts        # Generator for Merge Sort
│   │   ├── quickSort.ts        # Generator for Quick Sort
│   │   └── index.ts            # Algorithm registry & factory
│   └── utils/
│       └── arrayUtils.ts       # Array generation utilities
├── hooks/
│   └── useSortingVisualizer.ts # Main state management hook
├── components/
│   ├── Bar.tsx                 # Individual bar visualization
│   ├── Controls.tsx            # Control panel UI
│   └── Visualizer.tsx          # Main visualization canvas
└── app/
    ├── page.tsx                # Main application page
    └── globals.css             # Global styles
```

## Key Design Decisions

### 1. Generator-Based Algorithm Implementation

Each sorting algorithm is implemented as a generator function that yields discrete steps:

```typescript
export function* bubbleSort(items: ArrayItem[]): SortingGenerator {
  yield {
    array: currentArrayState,
    comparingIndices: [i, j],
    message: 'Comparing elements...'
  };
  
  yield {
    array: updatedArrayState,
    swappingIndices: [i, j],
    message: 'Swapping elements...'
  };
}
```

**Benefits:**
- Clean separation of algorithm logic from animation timing
- Enables both step-through and continuous playback modes
- Easy to pause, resume, and step backward through history
- No callback hell or promise chains

### 2. State Management with `useSortingVisualizer`

Custom hook orchestrating:
- Pre-generation of all sorting steps (enables bidirectional stepping)
- requestAnimationFrame-based animation loop
- Playback controls (play, pause, step forward/backward, jump)
- Speed and array size management

### 3. Color-Coded Visual States

- `default`: Gray - Inactive elements
- `comparing`: Blue - Elements being compared
- `swapping`: Red - Elements being swapped
- `sorted`: Green - Elements in final position
- `pivot`: Yellow - Pivot element (Quick Sort)
- `partitioned`: Purple - Partitioned sections (Merge/Quick Sort)

### 4. Animation Strategy

Two-layer approach:
1. **Discrete steps**: Generator yields distinct algorithm states
2. **Visual transitions**: CSS transitions smooth visual changes between states

requestAnimationFrame controls timing while CSS handles interpolation.

## Algorithms Implemented

| Algorithm | Time (Avg) | Time (Worst) | Space | Strategy |
|-----------|------------|--------------|-------|----------|
| Bubble Sort | O(n²) | O(n²) | O(1) | Adjacent swaps |
| Selection Sort | O(n²) | O(n²) | O(1) | Find minimum |
| Insertion Sort | O(n²) | O(n²) | O(1) | Build sorted array |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Divide and conquer |
| Quick Sort | O(n log n) | O(n²) | O(log n) | Partition around pivot |

## Extending the Project

### Adding a New Algorithm

1. Create generator in `lib/algorithms/`:

```typescript
export function* mySort(items: ArrayItem[]): SortingGenerator {
  yield {
    array: updatedArray,
    comparingIndices: [i, j],
    message: 'Step description'
  };
}
```

2. Register in `lib/algorithms/index.ts`:

```typescript
export const ALGORITHMS = {
  mysort: {
    id: 'mysort',
    name: 'My Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Algorithm description'
  }
};
```

3. Add to `getSortingGenerator()` factory function

### Adding New Visual States

1. Add type to `types/sorting.ts`:
```typescript
export type ArrayItemState = 'default' | 'mynewstate' | ...;
```

2. Add color in `components/Bar.tsx`:
```typescript
const STATE_COLORS = {
  mynewstate: 'bg-custom-color'
};
```

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animation**: requestAnimationFrame + CSS transitions
- **State**: React hooks (custom `useSortingVisualizer`)

## License

MIT

