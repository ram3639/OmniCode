import React, { useState, useEffect, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODES = {
  bubble: `function bubbleSort(arr):
  n = length(arr)
  for i = 0 to n-1:
    for j = 0 to n-i-2:
      if arr[j] > arr[j+1]:
        swap(arr[j], arr[j+1])
  return arr`,
  selection: `function selectionSort(arr):
  n = length(arr)
  for i = 0 to n-1:
    minIdx = i
    for j = i+1 to n-1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    swap(arr[i], arr[minIdx])
  return arr`,
  insertion: `function insertionSort(arr):
  for i = 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j = j - 1
    arr[j+1] = key
  return arr`,
  merge: `function mergeSort(arr, l, r):
  if l < r:
    mid = (l + r) / 2
    mergeSort(arr, l, mid)
    mergeSort(arr, mid+1, r)
    merge(arr, l, mid, r)

function merge(arr, l, m, r):
  copy left and right halves
  compare and merge back
  copy remaining elements`,
  quick: `function quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high-1:
    if arr[j] < pivot:
      i++; swap(arr[i], arr[j])
  swap(arr[i+1], arr[high])
  return i + 1`,
};

// --- Generators ---
function* bubbleSortGenerator(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { array: [...a], comparing: [j, j + 1], swapping: [], sorted: Array.from({length: i}, (_, k) => a.length - 1 - k) };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], comparing: [], swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => a.length - 1 - k) };
      }
    }
  }
  yield { array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i) };
}

function* selectionSortGenerator(arr) {
  const a = [...arr];
  const sorted = [];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      yield { array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted] };
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted] };
    }
    sorted.push(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted] };
  }
}

function* insertionSortGenerator(arr) {
  const a = [...arr];
  const sorted = [0];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      yield { array: [...a], comparing: [j - 1, j], swapping: [], sorted: [...sorted] };
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      yield { array: [...a], comparing: [], swapping: [j - 1, j], sorted: [...sorted] };
      j--;
    }
    sorted.push(i);
  }
  yield { array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i) };
}

function* mergeSortGenerator(arr) {
  const a = [...arr];
  const sorted = [];
  
  function* mergeSortHelper(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    yield* mergeSortHelper(start, mid);
    yield* mergeSortHelper(mid + 1, end);
    yield* merge(start, mid, end);
  }

  function* merge(start, mid, end) {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      yield { array: [...a], comparing: [start + i, mid + 1 + j], swapping: [], sorted: [] };
      if (left[i] <= right[j]) {
        a[k] = left[i];
        yield { array: [...a], comparing: [], swapping: [k], sorted: [] };
        i++;
      } else {
        a[k] = right[j];
        yield { array: [...a], comparing: [], swapping: [k], sorted: [] };
        j++;
      }
      k++;
    }

    while (i < left.length) {
      a[k] = left[i];
      yield { array: [...a], comparing: [], swapping: [k], sorted: [] };
      i++;
      k++;
    }

    while (j < right.length) {
      a[k] = right[j];
      yield { array: [...a], comparing: [], swapping: [k], sorted: [] };
      j++;
      k++;
    }
  }

  yield* mergeSortHelper(0, a.length - 1);
  yield { array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i) };
}

function* quickSortGenerator(arr) {
  const a = [...arr];

  function* partition(low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...a], comparing: [j, high], swapping: [], sorted: [] };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        yield { array: [...a], comparing: [], swapping: [i, j], sorted: [] };
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield { array: [...a], comparing: [], swapping: [i + 1, high], sorted: [] };
    return i + 1;
  }

  function* quickSortHelper(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* quickSortHelper(low, pi - 1);
      yield* quickSortHelper(pi + 1, high);
    }
  }

  yield* quickSortHelper(0, a.length - 1);
  yield { array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i) };
}

const ALGORITHMS = {
  bubble: { name: 'Bubble Sort', fn: bubbleSortGenerator, time: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  selection: { name: 'Selection Sort', fn: selectionSortGenerator, time: 'O(n²)', space: 'O(1)', stable: 'No' },
  insertion: { name: 'Insertion Sort', fn: insertionSortGenerator, time: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  merge: { name: 'Merge Sort', fn: mergeSortGenerator, time: 'O(n log n)', space: 'O(n)', stable: 'Yes' },
  quick: { name: 'Quick Sort', fn: quickSortGenerator, time: 'O(n log n)', space: 'O(log n)', stable: 'No' },
};

export default function SortingVisualizer() {
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState([]);
  const [algo, setAlgo] = useState('bubble');
  const [speed, setSpeed] = useState(1);
  
  const [state, setState] = useState({
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  
  const generatorRef = useRef(null);
  const timerRef = useRef(null);

  const generateArray = useCallback((size) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArr);
    setState({ comparing: [], swapping: [], sorted: [] });
    setComparisons(0);
    setSwaps(0);
    generatorRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const step = () => {
    if (!generatorRef.current) {
      generatorRef.current = ALGORITHMS[algo].fn(array);
    }
    const { value, done } = generatorRef.current.next();
    
    if (done) {
      setIsPlaying(false);
      generatorRef.current = null;
      return false;
    }
    
    setArray(value.array);
    setState({
      comparing: value.comparing || [],
      swapping: value.swapping || [],
      sorted: value.sorted || []
    });
    
    if (value.comparing?.length > 0) setComparisons(c => c + 1);
    if (value.swapping?.length > 0) setSwaps(s => s + 1);
    
    if (value.sorted && value.sorted.length === array.length) {
      setHighlightLines([6]);
    } else if (value.swapping?.length > 0) {
      setHighlightLines([5]);
    } else if (value.comparing?.length > 0) {
      setHighlightLines([3, 4]);
    } else {
      setHighlightLines([]);
    }
    
    return true;
  };

  const play = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(10, 200 / speed);
      timerRef.current = setTimeout(() => {
        const hasMore = step();
        if (!hasMore) setIsPlaying(false);
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  });

  const pause = () => setIsPlaying(false);
  const reset = () => generateArray(arraySize);
  
  const getBarColor = (index) => {
    if (state.swapping.includes(index)) return 'var(--danger)';
    if (state.comparing.includes(index)) return 'var(--warning)';
    if (state.sorted.includes(index)) return 'var(--accent)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={algo}
                onChange={(e) => { setAlgo(e.target.value); reset(); }}
                style={{ padding: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}
              >
                {Object.entries(ALGORITHMS).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
              
              <button onClick={isPlaying ? pause : play} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button onClick={step} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
                Step
              </button>
              
              <button onClick={reset} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
                Shuffle
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Array Size: {arraySize}</label>
                <input type="range" min="10" max="100" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Speed: {speed}x</label>
                <input type="range" min="0.5" max="4" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          </div>
  
          {/* Info Panel */}
          <div style={{ width: '300px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{ALGORITHMS[algo].name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Time Complexity:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{ALGORITHMS[algo].time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Space Complexity:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{ALGORITHMS[algo].space}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Stable:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{ALGORITHMS[algo].stable}</span>
            </div>
            <hr style={{ borderColor: 'var(--border-primary)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Comparisons:</span>
              <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>{comparisons}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Swaps/Writes:</span>
              <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{swaps}</span>
            </div>
          </div>
        </div>
  
        {/* Visualizer Area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)', minHeight: '300px' }}>
          {array.map((val, idx) => (
            <div
              key={idx}
              style={{
                width: `${100 / arraySize}%`,
                height: `${(val / 110) * 100}%`,
                backgroundColor: getBarColor(idx),
                transition: 'height 0.1s ease',
                borderRadius: '2px 2px 0 0'
              }}
            />
          ))}
        </div>
      </div>
      <CodeHighlightPanel playgroundTopic="bubble-sort" code={CODES[algo]} highlightLines={highlightLines} title={ALGORITHMS[algo].name} language="Pseudocode" />
    </div>
  );
}
