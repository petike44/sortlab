# SortLab - Interactive Sorting Algorithm Visualizer

A modern, educational web application for visualizing sorting algorithms with smooth animations, multiple visualization modes, and intuitive controls. Built with Next.js 15 and TypeScript.

![SortLab Preview](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **5 Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **3 Visualization Modes**:
  - 📊 **Bars** - Classic bar chart visualization
  - 🔢 **Boxes** - Number cards that rearrange
  - 🏙️ **Towers** - 3D city skyline effect
- **Full Playback Control**: Play, pause, step forward/backward, reset
- **Adjustable Speed**: Control animation speed from 1% to 100%
- **Dynamic Array Size**: Visualize with 2-30 elements
- **Color-Coded States**: Visual feedback for comparing, swapping, and sorted elements
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Modern UI**: Dark theme with gradient effects, smooth animations, and glass morphism

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view SortLab.

## 📱 Screenshots

### Desktop View
The main interface features a control panel on the left and the visualization area on the right.

### Mobile View
On mobile devices, the visualization appears at the top with controls below for easy one-handed operation.

## 🏗️ Architecture Overview

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
│   ├── Bar.tsx                 # Visualization element (bars/boxes/towers)
│   ├── Controls.tsx            # Control panel UI
│   └── Visualizer.tsx          # Main visualization canvas
└── app/
    ├── page.tsx                # Main application page
    ├── layout.tsx              # Root layout
    └── globals.css             # Global styles & animations
```

## 🎨 Visualization Modes

### 📊 Bars (Classic)
Traditional bar chart where each element's height represents its value. Great for seeing the overall pattern of sorting.

### 🔢 Boxes
Square cards displaying the actual numbers. Elements scale and rotate when being swapped. Ideal for understanding the exact values being compared.

### 🏙️ Towers
3D building/tower visualization with window patterns. Creates a "city skyline" effect where sorting arranges buildings from shortest to tallest.

## 🎯 Key Design Decisions

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

| State | Color | Description |
|-------|-------|-------------|
| `default` | Gray | Inactive elements |
| `comparing` | Blue | Elements being compared |
| `swapping` | Red | Elements being swapped |
| `sorted` | Green | Elements in final position |
| `pivot` | Purple | Pivot element (Quick Sort) |
| `partitioned` | Blue | Partitioned sections |

### 4. Animation Strategy

Two-layer approach:
1. **Discrete steps**: Generator yields distinct algorithm states
2. **Visual transitions**: CSS transitions smooth visual changes between states

requestAnimationFrame controls timing while CSS handles interpolation.

## 📊 Algorithms Implemented

| Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Strategy |
|-----------|-------------|------------|--------------|-------|----------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Adjacent swaps |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | Find minimum |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Build sorted array |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Divide and conquer |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | Partition around pivot |

## 🔧 Extending the Project

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

### Adding a New Visualization Mode

1. Add type to `types/sorting.ts`:
```typescript
export type VisualizationMode = 'bars' | 'boxes' | 'towers' | 'mymode';
```

2. Add rendering logic in `components/Bar.tsx`:
```typescript
if (visualizationMode === 'mymode') {
  return <div>Custom visualization</div>;
}
```

3. Register in `components/Visualizer.tsx` VISUALIZATION_MODES array

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Animation**: requestAnimationFrame + CSS transitions
- **State**: React hooks (custom `useSortingVisualizer`)
- **Build**: Turbopack (development)

## 📄 License

MIT

---

Made with ❤️ for learning and education

