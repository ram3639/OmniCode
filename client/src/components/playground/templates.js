/**
 * Playground Templates — Multi-language support
 * Each template has starters and solutions in JS/Python/Java/C++
 * Only function signature shown by default (practice mode)
 * Solution is hidden until user toggles "Show Solution"
 */

const LANGS = ['javascript', 'python', 'java', 'cpp'];

// ── Helper: sorting runner factory ──
function sortingRunner(code, testData) {
  const arr = [...testData];
  const steps = [{ state: [...arr], comparing: [], swapping: [], action: 'init' }];
  const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
  const fn = new Function('arr', 'swap', body);
  fn(arr, (i, j) => {
    steps.push({ state: [...arr], comparing: [i, j], swapping: [], action: 'compare' });
    [arr[i], arr[j]] = [arr[j], arr[i]];
    steps.push({ state: [...arr], comparing: [], swapping: [i, j], action: 'swap' });
  });
  steps.push({ state: [...arr], comparing: [], swapping: [], action: 'done' });
  return steps;
}

function searchRunner(code, testData) {
  const arr = [...testData.array];
  const target = testData.target;
  const steps = [{ state: [...arr], target, checking: -1, found: false, action: 'init' }];
  const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
  const fn = new Function('arr', 'target', 'check', body);
  const result = fn(arr, target, (idx) => {
    steps.push({ state: [...arr], target, checking: idx, found: arr[idx] === target, action: 'check' });
  });
  steps.push({ state: [...arr], target, checking: result, found: result !== -1, action: 'done', resultIndex: result });
  return steps;
}

export const PLAYGROUND_TEMPLATES = [
  // ═══════════════ SORTING ═══════════════
  {
    id: 'bubble-sort', label: 'Bubble Sort', category: 'Sorting',
    description: 'Sort by repeatedly swapping adjacent out-of-order elements.',
    instructions: 'Use swap(i, j) to swap elements at index i and j. This tracks your swaps for visualization.',
    starters: {
      javascript: `function bubbleSort(arr, swap) {\n  // Write your bubble sort here\n  // Use swap(i, j) to swap elements\n}`,
      python: `def bubble_sort(arr, swap):\n    # Write your bubble sort here\n    # Use swap(i, j) to swap elements\n    pass`,
      java: `void bubbleSort(int[] arr, SwapFn swap) {\n    // Write your bubble sort here\n    // Use swap.apply(i, j) to swap elements\n}`,
      cpp: `void bubbleSort(vector<int>& arr, function<void(int,int)> swap) {\n    // Write your bubble sort here\n    // Use swap(i, j) to swap elements\n}`,
    },
    solutions: {
      javascript: `function bubbleSort(arr, swap) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        swap(j, j + 1);\n      }\n    }\n  }\n}`,
      python: `def bubble_sort(arr, swap):\n    n = len(arr)\n    for i in range(n - 1):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                swap(j, j + 1)`,
      java: `void bubbleSort(int[] arr, SwapFn swap) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap.apply(j, j + 1);\n            }\n        }\n    }\n}`,
      cpp: `void bubbleSort(vector<int>& arr, function<void(int,int)> swap) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(j, j + 1);\n            }\n        }\n    }\n}`,
    },
    testData: [64, 34, 25, 12, 22, 11, 90, 45],
    run: sortingRunner,
  },
  {
    id: 'selection-sort', label: 'Selection Sort', category: 'Sorting',
    description: 'Find the minimum and place it at the front of unsorted portion.',
    instructions: 'Use swap(i, j) to swap elements. Find min in unsorted part, swap to front.',
    starters: {
      javascript: `function selectionSort(arr, swap) {\n  // Write your selection sort here\n}`,
      python: `def selection_sort(arr, swap):\n    # Write your selection sort here\n    pass`,
      java: `void selectionSort(int[] arr, SwapFn swap) {\n    // Write your selection sort here\n}`,
      cpp: `void selectionSort(vector<int>& arr, function<void(int,int)> swap) {\n    // Write your selection sort here\n}`,
    },
    solutions: {
      javascript: `function selectionSort(arr, swap) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) swap(i, minIdx);\n  }\n}`,
      python: `def selection_sort(arr, swap):\n    n = len(arr)\n    for i in range(n - 1):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        if min_idx != i:\n            swap(i, min_idx)`,
      java: `void selectionSort(int[] arr, SwapFn swap) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        if (minIdx != i) swap.apply(i, minIdx);\n    }\n}`,
      cpp: `void selectionSort(vector<int>& arr, function<void(int,int)> swap) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        if (minIdx != i) swap(i, minIdx);\n    }\n}`,
    },
    testData: [64, 25, 12, 22, 11, 45, 34, 90],
    run: sortingRunner,
  },
  {
    id: 'insertion-sort', label: 'Insertion Sort', category: 'Sorting',
    description: 'Build sorted portion by inserting each element at its correct position.',
    instructions: 'Use swap(i, j) to swap adjacent elements while shifting.',
    starters: {
      javascript: `function insertionSort(arr, swap) {\n  // Write your insertion sort here\n}`,
      python: `def insertion_sort(arr, swap):\n    # Write your insertion sort here\n    pass`,
      java: `void insertionSort(int[] arr, SwapFn swap) {\n    // Write your insertion sort here\n}`,
      cpp: `void insertionSort(vector<int>& arr, function<void(int,int)> swap) {\n    // Write your insertion sort here\n}`,
    },
    solutions: {
      javascript: `function insertionSort(arr, swap) {\n  for (let i = 1; i < arr.length; i++) {\n    let j = i;\n    while (j > 0 && arr[j - 1] > arr[j]) {\n      swap(j - 1, j);\n      j--;\n    }\n  }\n}`,
      python: `def insertion_sort(arr, swap):\n    for i in range(1, len(arr)):\n        j = i\n        while j > 0 and arr[j - 1] > arr[j]:\n            swap(j - 1, j)\n            j -= 1`,
      java: `void insertionSort(int[] arr, SwapFn swap) {\n    for (int i = 1; i < arr.length; i++) {\n        int j = i;\n        while (j > 0 && arr[j - 1] > arr[j]) {\n            swap.apply(j - 1, j);\n            j--;\n        }\n    }\n}`,
      cpp: `void insertionSort(vector<int>& arr, function<void(int,int)> swap) {\n    for (int i = 1; i < (int)arr.size(); i++) {\n        int j = i;\n        while (j > 0 && arr[j - 1] > arr[j]) {\n            swap(j - 1, j);\n            j--;\n        }\n    }\n}`,
    },
    testData: [12, 11, 13, 5, 6, 45, 23, 8],
    run: sortingRunner,
  },
  {
    id: 'quick-sort', label: 'Quick Sort', category: 'Sorting',
    description: 'Divide array using a pivot, recursively sort the partitions.',
    instructions: 'Use swap(i, j) to swap elements. Partition around the last element as pivot.',
    starters: {
      javascript: `function quickSort(arr, swap, low, high) {\n  // Write your quick sort here\n  // low and high are the bounds\n}`,
      python: `def quick_sort(arr, swap, low, high):\n    # Write your quick sort here\n    # low and high are the bounds\n    pass`,
      java: `void quickSort(int[] arr, SwapFn swap, int low, int high) {\n    // Write your quick sort here\n}`,
      cpp: `void quickSort(vector<int>& arr, function<void(int,int)> swap, int low, int high) {\n    // Write your quick sort here\n}`,
    },
    solutions: {
      javascript: `function quickSort(arr, swap, low, high) {\n  if (low < high) {\n    let pivot = arr[high];\n    let i = low - 1;\n    for (let j = low; j < high; j++) {\n      if (arr[j] < pivot) {\n        i++;\n        swap(i, j);\n      }\n    }\n    swap(i + 1, high);\n    let pi = i + 1;\n    quickSort(arr, swap, low, pi - 1);\n    quickSort(arr, swap, pi + 1, high);\n  }\n}`,
      python: `def quick_sort(arr, swap, low, high):\n    if low < high:\n        pivot = arr[high]\n        i = low - 1\n        for j in range(low, high):\n            if arr[j] < pivot:\n                i += 1\n                swap(i, j)\n        swap(i + 1, high)\n        pi = i + 1\n        quick_sort(arr, swap, low, pi - 1)\n        quick_sort(arr, swap, pi + 1, high)`,
      java: `void quickSort(int[] arr, SwapFn swap, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                swap.apply(i, j);\n            }\n        }\n        swap.apply(i + 1, high);\n        int pi = i + 1;\n        quickSort(arr, swap, low, pi - 1);\n        quickSort(arr, swap, pi + 1, high);\n    }\n}`,
      cpp: `void quickSort(vector<int>& arr, function<void(int,int)> swap, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                swap(i, j);\n            }\n        }\n        swap(i + 1, high);\n        int pi = i + 1;\n        quickSort(arr, swap, low, pi - 1);\n        quickSort(arr, swap, pi + 1, high);\n    }\n}`,
    },
    testData: [64, 34, 25, 12, 22, 11, 90, 45],
    run(code, testData) {
      const arr = [...testData];
      const steps = [{ state: [...arr], comparing: [], swapping: [], action: 'init' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('arr', 'swap', 'low', 'high', 'quickSort', body);
      const swapFn = (i, j) => {
        steps.push({ state: [...arr], comparing: [i, j], swapping: [], action: 'compare' });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ state: [...arr], comparing: [], swapping: [i, j], action: 'swap' });
      };
      const qs = (a, s, l, h) => fn(a, s, l, h, qs);
      qs(arr, swapFn, 0, arr.length - 1);
      steps.push({ state: [...arr], comparing: [], swapping: [], action: 'done' });
      return steps;
    }
  },
  {
    id: 'merge-sort', label: 'Merge Sort', category: 'Sorting',
    description: 'Divide array in half, sort each half, then merge the sorted halves.',
    instructions: 'The merge function is provided. Write the recursive split logic. Call merge(arr, left, mid, right, onStep) to merge.',
    starters: {
      javascript: `function mergeSort(arr, left, right, merge) {\n  // Write the recursive mergeSort logic\n  // Call merge(arr, left, mid, right) to merge halves\n}`,
      python: `def merge_sort(arr, left, right, merge):\n    # Write the recursive merge_sort logic\n    # Call merge(arr, left, mid, right) to merge\n    pass`,
      java: `void mergeSort(int[] arr, int left, int right, MergeFn merge) {\n    // Write the recursive mergeSort logic\n    // Call merge.apply(arr, left, mid, right)\n}`,
      cpp: `void mergeSort(vector<int>& arr, int left, int right, MergeFn merge) {\n    // Write the recursive mergeSort logic\n    // Call merge(arr, left, mid, right)\n}`,
    },
    solutions: {
      javascript: `function mergeSort(arr, left, right, merge) {\n  if (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    mergeSort(arr, left, mid, merge);\n    mergeSort(arr, mid + 1, right, merge);\n    merge(arr, left, mid, right);\n  }\n}`,
      python: `def merge_sort(arr, left, right, merge):\n    if left < right:\n        mid = (left + right) // 2\n        merge_sort(arr, left, mid, merge)\n        merge_sort(arr, mid + 1, right, merge)\n        merge(arr, left, mid, right)`,
      java: `void mergeSort(int[] arr, int left, int right, MergeFn merge) {\n    if (left < right) {\n        int mid = (left + right) / 2;\n        mergeSort(arr, left, mid, merge);\n        mergeSort(arr, mid + 1, right, merge);\n        merge.apply(arr, left, mid, right);\n    }\n}`,
      cpp: `void mergeSort(vector<int>& arr, int left, int right, MergeFn merge) {\n    if (left < right) {\n        int mid = (left + right) / 2;\n        mergeSort(arr, left, mid, merge);\n        mergeSort(arr, mid + 1, right, merge);\n        merge(arr, left, mid, right);\n    }\n}`,
    },
    testData: [38, 27, 43, 3, 9, 82, 10, 64],
    run(code, testData) {
      const arr = [...testData];
      const steps = [{ state: [...arr], comparing: [], swapping: [], action: 'init' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const mergeFn = (a, l, m, r) => {
        const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          steps.push({ state: [...a], comparing: [l + i, m + 1 + j], swapping: [], action: 'compare' });
          a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
          steps.push({ state: [...a], comparing: [], swapping: [k - 1], action: 'swap' });
        }
        while (i < left.length) { a[k++] = left[i++]; steps.push({ state: [...a], comparing: [], swapping: [k-1], action: 'swap' }); }
        while (j < right.length) { a[k++] = right[j++]; steps.push({ state: [...a], comparing: [], swapping: [k-1], action: 'swap' }); }
      };
      const fn = new Function('arr', 'left', 'right', 'merge', 'mergeSort', body);
      const ms = (a, l, r, m) => fn(a, l, r, m, ms);
      ms(arr, 0, arr.length - 1, mergeFn);
      steps.push({ state: [...arr], comparing: [], swapping: [], action: 'done' });
      return steps;
    }
  },

  // ═══════════════ SEARCHING ═══════════════
  {
    id: 'linear-search', label: 'Linear Search', category: 'Searching',
    description: 'Check each element one by one until target is found.',
    instructions: 'Call check(index) at each element you examine. Return the index if found, -1 if not.',
    starters: {
      javascript: `function linearSearch(arr, target, check) {\n  // Write your linear search here\n  // Call check(i) before comparing arr[i]\n}`,
      python: `def linear_search(arr, target, check):\n    # Write your linear search here\n    # Call check(i) before comparing\n    pass`,
      java: `int linearSearch(int[] arr, int target, CheckFn check) {\n    // Write your linear search here\n    return -1;\n}`,
      cpp: `int linearSearch(vector<int>& arr, int target, function<void(int)> check) {\n    // Write your linear search here\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function linearSearch(arr, target, check) {\n  for (let i = 0; i < arr.length; i++) {\n    check(i);\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
      python: `def linear_search(arr, target, check):\n    for i in range(len(arr)):\n        check(i)\n        if arr[i] == target:\n            return i\n    return -1`,
      java: `int linearSearch(int[] arr, int target, CheckFn check) {\n    for (int i = 0; i < arr.length; i++) {\n        check.apply(i);\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      cpp: `int linearSearch(vector<int>& arr, int target, function<void(int)> check) {\n    for (int i = 0; i < (int)arr.size(); i++) {\n        check(i);\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
    },
    testData: { array: [10, 23, 45, 12, 67, 34, 89, 56], target: 34 },
    run: searchRunner,
  },
  {
    id: 'binary-search', label: 'Binary Search', category: 'Searching',
    description: 'Efficiently search a SORTED array by halving the search range.',
    instructions: 'Call check(mid) at each midpoint you examine. Return the index if found, -1 if not.',
    starters: {
      javascript: `function binarySearch(arr, target, check) {\n  // Array is sorted. Write binary search.\n  // Call check(mid) at each step\n}`,
      python: `def binary_search(arr, target, check):\n    # Array is sorted. Write binary search.\n    # Call check(mid) at each step\n    pass`,
      java: `int binarySearch(int[] arr, int target, CheckFn check) {\n    // Array is sorted. Write binary search.\n    return -1;\n}`,
      cpp: `int binarySearch(vector<int>& arr, int target, function<void(int)> check) {\n    // Array is sorted. Write binary search.\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function binarySearch(arr, target, check) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    check(mid);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`,
      python: `def binary_search(arr, target, check):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        check(mid)\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
      java: `int binarySearch(int[] arr, int target, CheckFn check) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        check.apply(mid);\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      cpp: `int binarySearch(vector<int>& arr, int target, function<void(int)> check) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        check(mid);\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
    },
    testData: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 23 },
    run: searchRunner,
  },

  // ═══════════════ STACK ═══════════════
  {
    id: 'stack-push', label: 'Push', category: 'Stack',
    description: 'Add an element to the top of the stack.',
    instructions: 'Push the value onto the stack array. Use stack.push(val).',
    starters: {
      javascript: `function push(stack, val) {\n  // Add val to top of stack\n}`,
      python: `def push(stack, val):\n    # Add val to top of stack\n    pass`,
      java: `void push(Stack<Integer> stack, int val) {\n    // Add val to top of stack\n}`,
      cpp: `void push(vector<int>& stack, int val) {\n    // Add val to top of stack\n}`,
    },
    solutions: {
      javascript: `function push(stack, val) {\n  stack.push(val);\n}`,
      python: `def push(stack, val):\n    stack.append(val)`,
      java: `void push(Stack<Integer> stack, int val) {\n    stack.push(val);\n}`,
      cpp: `void push(vector<int>& stack, int val) {\n    stack.push_back(val);\n}`,
    },
    testData: { initial: [], values: [10, 20, 30, 40, 50] },
    run(code, testData) {
      const stack = [...testData.initial];
      const steps = [{ state: [...stack], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('stack', 'val', body);
      for (const val of testData.values) { fn(stack, val); steps.push({ state: [...stack], action: 'push', lastOp: `push(${val})`, highlight: stack.length - 1 }); }
      return steps;
    }
  },
  {
    id: 'stack-pop', label: 'Pop', category: 'Stack',
    description: 'Remove and return the top element from the stack.',
    instructions: 'Remove the last element. Handle empty stack. Use stack.pop().',
    starters: {
      javascript: `function pop(stack) {\n  // Remove and return top element\n  // Handle empty stack\n}`,
      python: `def pop(stack):\n    # Remove and return top element\n    # Handle empty stack\n    pass`,
      java: `int pop(Stack<Integer> stack) {\n    // Remove and return top element\n    return -1;\n}`,
      cpp: `int pop(vector<int>& stack) {\n    // Remove and return top element\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function pop(stack) {\n  if (stack.length === 0) return -1;\n  return stack.pop();\n}`,
      python: `def pop(stack):\n    if len(stack) == 0:\n        return -1\n    return stack.pop()`,
      java: `int pop(Stack<Integer> stack) {\n    if (stack.isEmpty()) return -1;\n    return stack.pop();\n}`,
      cpp: `int pop(vector<int>& stack) {\n    if (stack.empty()) return -1;\n    int val = stack.back();\n    stack.pop_back();\n    return val;\n}`,
    },
    testData: { initial: [10, 20, 30, 40, 50], popCount: 3 },
    run(code, testData) {
      const stack = [...testData.initial];
      const steps = [{ state: [...stack], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('stack', body);
      for (let i = 0; i < testData.popCount; i++) { const v = fn(stack); steps.push({ state: [...stack], action: 'pop', lastOp: `pop() → ${v}`, highlight: stack.length }); }
      return steps;
    }
  },

  // ═══════════════ QUEUE ═══════════════
  {
    id: 'queue-enqueue', label: 'Enqueue', category: 'Queue',
    description: 'Add an element to the rear of the queue.',
    instructions: 'Add value to the end of queue array. Use queue.push(val).',
    starters: {
      javascript: `function enqueue(queue, val) {\n  // Add val to rear of queue\n}`,
      python: `def enqueue(queue, val):\n    # Add val to rear of queue\n    pass`,
      java: `void enqueue(Queue<Integer> queue, int val) {\n    // Add val to rear of queue\n}`,
      cpp: `void enqueue(queue<int>& q, int val) {\n    // Add val to rear of queue\n}`,
    },
    solutions: {
      javascript: `function enqueue(queue, val) {\n  queue.push(val);\n}`,
      python: `def enqueue(queue, val):\n    queue.append(val)`,
      java: `void enqueue(Queue<Integer> queue, int val) {\n    queue.add(val);\n}`,
      cpp: `void enqueue(queue<int>& q, int val) {\n    q.push(val);\n}`,
    },
    testData: { initial: [], values: [10, 20, 30, 40, 50] },
    run(code, testData) {
      const queue = [...testData.initial];
      const steps = [{ state: [...queue], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('queue', 'val', body);
      for (const v of testData.values) { fn(queue, v); steps.push({ state: [...queue], action: 'enqueue', lastOp: `enqueue(${v})`, highlight: queue.length - 1 }); }
      return steps;
    }
  },
  {
    id: 'queue-dequeue', label: 'Dequeue', category: 'Queue',
    description: 'Remove and return the front element of the queue.',
    instructions: 'Remove the first element. Handle empty queue. Use queue.shift().',
    starters: {
      javascript: `function dequeue(queue) {\n  // Remove and return front element\n  // Handle empty queue\n}`,
      python: `def dequeue(queue):\n    # Remove and return front element\n    # Handle empty queue\n    pass`,
      java: `int dequeue(Queue<Integer> queue) {\n    // Remove and return front element\n    return -1;\n}`,
      cpp: `int dequeue(queue<int>& q) {\n    // Remove and return front element\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function dequeue(queue) {\n  if (queue.length === 0) return -1;\n  return queue.shift();\n}`,
      python: `def dequeue(queue):\n    if len(queue) == 0:\n        return -1\n    return queue.pop(0)`,
      java: `int dequeue(Queue<Integer> queue) {\n    if (queue.isEmpty()) return -1;\n    return queue.poll();\n}`,
      cpp: `int dequeue(queue<int>& q) {\n    if (q.empty()) return -1;\n    int val = q.front();\n    q.pop();\n    return val;\n}`,
    },
    testData: { initial: [10, 20, 30, 40, 50], dequeueCount: 3 },
    run(code, testData) {
      const queue = [...testData.initial];
      const steps = [{ state: [...queue], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('queue', body);
      for (let i = 0; i < testData.dequeueCount; i++) { const v = fn(queue); steps.push({ state: [...queue], action: 'dequeue', lastOp: `dequeue() → ${v}`, highlight: 0 }); }
      return steps;
    }
  },

  // ═══════════════ LINKED LIST ═══════════════
  {
    id: 'll-insert-end', label: 'Insert at End', category: 'Linked List',
    description: 'Insert a new node at the end of a singly linked list.',
    instructions: 'Create node: { val, next: null }. If empty, return new node. Else traverse to last and attach. Return head.',
    starters: {
      javascript: `function insertAtEnd(head, val) {\n  // Insert val at the end\n  // Return head\n}`,
      python: `def insert_at_end(head, val):\n    # Insert val at the end\n    # Return head\n    pass`,
      java: `ListNode insertAtEnd(ListNode head, int val) {\n    // Insert val at the end\n    return head;\n}`,
      cpp: `ListNode* insertAtEnd(ListNode* head, int val) {\n    // Insert val at the end\n    return head;\n}`,
    },
    solutions: {
      javascript: `function insertAtEnd(head, val) {\n  const node = { val, next: null };\n  if (!head) return node;\n  let cur = head;\n  while (cur.next) cur = cur.next;\n  cur.next = node;\n  return head;\n}`,
      python: `def insert_at_end(head, val):\n    node = ListNode(val)\n    if not head:\n        return node\n    cur = head\n    while cur.next:\n        cur = cur.next\n    cur.next = node\n    return head`,
      java: `ListNode insertAtEnd(ListNode head, int val) {\n    ListNode node = new ListNode(val);\n    if (head == null) return node;\n    ListNode cur = head;\n    while (cur.next != null) cur = cur.next;\n    cur.next = node;\n    return head;\n}`,
      cpp: `ListNode* insertAtEnd(ListNode* head, int val) {\n    ListNode* node = new ListNode(val);\n    if (!head) return node;\n    ListNode* cur = head;\n    while (cur->next) cur = cur->next;\n    cur->next = node;\n    return head;\n}`,
    },
    testData: { values: [10, 20, 30, 40, 50] },
    run(code, testData) {
      let head = null;
      const steps = [{ state: [], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('head', 'val', body);
      const toArr = (h) => { const a = []; let c = h; while (c) { a.push(c.val); c = c.next; } return a; };
      for (const v of testData.values) { head = fn(head, v); steps.push({ state: toArr(head), action: 'insert', lastOp: `insert(${v})`, highlight: toArr(head).length - 1 }); }
      return steps;
    }
  },
  {
    id: 'll-insert-at', label: 'Insert at Index', category: 'Linked List',
    description: 'Insert a new node at a specific index in the linked list.',
    instructions: 'Create node: { val, next: null }. If index is 0, new node becomes head. Else traverse to index-1 and insert. Return head.',
    starters: {
      javascript: `function insertAt(head, val, index) {\n  // Insert val at given index\n  // Return head\n}`,
      python: `def insert_at(head, val, index):\n    # Insert val at given index\n    # Return head\n    pass`,
      java: `ListNode insertAt(ListNode head, int val, int index) {\n    // Insert val at given index\n    return head;\n}`,
      cpp: `ListNode* insertAt(ListNode* head, int val, int index) {\n    // Insert val at given index\n    return head;\n}`,
    },
    solutions: {
      javascript: `function insertAt(head, val, index) {\n  const node = { val, next: null };\n  if (index === 0) { node.next = head; return node; }\n  let cur = head, i = 0;\n  while (cur && i < index - 1) { cur = cur.next; i++; }\n  if (cur) { node.next = cur.next; cur.next = node; }\n  return head;\n}`,
      python: `def insert_at(head, val, index):\n    node = ListNode(val)\n    if index == 0:\n        node.next = head\n        return node\n    cur, i = head, 0\n    while cur and i < index - 1:\n        cur = cur.next\n        i += 1\n    if cur:\n        node.next = cur.next\n        cur.next = node\n    return head`,
      java: `ListNode insertAt(ListNode head, int val, int index) {\n    ListNode node = new ListNode(val);\n    if (index == 0) { node.next = head; return node; }\n    ListNode cur = head;\n    for (int i = 0; i < index - 1 && cur != null; i++) cur = cur.next;\n    if (cur != null) { node.next = cur.next; cur.next = node; }\n    return head;\n}`,
      cpp: `ListNode* insertAt(ListNode* head, int val, int index) {\n    ListNode* node = new ListNode(val);\n    if (index == 0) { node->next = head; return node; }\n    ListNode* cur = head;\n    for (int i = 0; i < index - 1 && cur; i++) cur = cur->next;\n    if (cur) { node->next = cur->next; cur->next = node; }\n    return head;\n}`,
    },
    testData: { ops: [{v:10,i:0},{v:20,i:1},{v:30,i:2},{v:15,i:1},{v:5,i:0}] },
    run(code, testData) {
      let head = null;
      const steps = [{ state: [], action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('head', 'val', 'index', body);
      const toArr = (h) => { const a = []; let c = h; while (c) { a.push(c.val); c = c.next; } return a; };
      for (const op of testData.ops) { head = fn(head, op.v, op.i); const a = toArr(head); steps.push({ state: a, action: 'insert', lastOp: `insertAt(${op.v}, idx=${op.i})`, highlight: Math.min(op.i, a.length - 1) }); }
      return steps;
    }
  },
  {
    id: 'll-delete', label: 'Delete Node', category: 'Linked List',
    description: 'Delete the node at a specific index.',
    instructions: 'If index is 0, return head.next. Else traverse to index-1 and skip the node. Return head.',
    starters: {
      javascript: `function deleteAt(head, index) {\n  // Delete node at given index\n  // Return head\n}`,
      python: `def delete_at(head, index):\n    # Delete node at given index\n    # Return head\n    pass`,
      java: `ListNode deleteAt(ListNode head, int index) {\n    // Delete node at given index\n    return head;\n}`,
      cpp: `ListNode* deleteAt(ListNode* head, int index) {\n    // Delete node at given index\n    return head;\n}`,
    },
    solutions: {
      javascript: `function deleteAt(head, index) {\n  if (!head) return null;\n  if (index === 0) return head.next;\n  let cur = head, i = 0;\n  while (cur.next && i < index - 1) { cur = cur.next; i++; }\n  if (cur.next) cur.next = cur.next.next;\n  return head;\n}`,
      python: `def delete_at(head, index):\n    if not head:\n        return None\n    if index == 0:\n        return head.next\n    cur, i = head, 0\n    while cur.next and i < index - 1:\n        cur = cur.next\n        i += 1\n    if cur.next:\n        cur.next = cur.next.next\n    return head`,
      java: `ListNode deleteAt(ListNode head, int index) {\n    if (head == null) return null;\n    if (index == 0) return head.next;\n    ListNode cur = head;\n    for (int i = 0; i < index - 1 && cur.next != null; i++) cur = cur.next;\n    if (cur.next != null) cur.next = cur.next.next;\n    return head;\n}`,
      cpp: `ListNode* deleteAt(ListNode* head, int index) {\n    if (!head) return nullptr;\n    if (index == 0) { auto* tmp = head->next; delete head; return tmp; }\n    ListNode* cur = head;\n    for (int i = 0; i < index - 1 && cur->next; i++) cur = cur->next;\n    if (cur->next) { auto* tmp = cur->next; cur->next = tmp->next; delete tmp; }\n    return head;\n}`,
    },
    testData: { initial: [10, 20, 30, 40, 50], deleteIndices: [2, 0, 1] },
    run(code, testData) {
      const buildList = (arr) => { let h = null; for (let i = arr.length - 1; i >= 0; i--) h = { val: arr[i], next: h }; return h; };
      const toArr = (h) => { const a = []; let c = h; while (c) { a.push(c.val); c = c.next; } return a; };
      let head = buildList(testData.initial);
      const steps = [{ state: toArr(head), action: 'init', lastOp: '' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('head', 'index', body);
      for (const idx of testData.deleteIndices) { head = fn(head, idx); steps.push({ state: toArr(head), action: 'delete', lastOp: `deleteAt(${idx})`, highlight: Math.min(idx, Math.max(toArr(head).length - 1, 0)) }); }
      return steps;
    }
  },
  {
    id: 'll-reverse', label: 'Reverse List', category: 'Linked List',
    description: 'Reverse a singly linked list in-place.',
    instructions: 'Use three pointers: prev, current, next. Reverse all the links. Return the new head.',
    starters: {
      javascript: `function reverseList(head) {\n  // Reverse the linked list\n  // Return new head\n}`,
      python: `def reverse_list(head):\n    # Reverse the linked list\n    # Return new head\n    pass`,
      java: `ListNode reverseList(ListNode head) {\n    // Reverse the linked list\n    return head;\n}`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    // Reverse the linked list\n    return head;\n}`,
    },
    solutions: {
      javascript: `function reverseList(head) {\n  let prev = null, cur = head;\n  while (cur) {\n    let next = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = next;\n  }\n  return prev;\n}`,
      python: `def reverse_list(head):\n    prev, cur = None, head\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev = cur\n        cur = nxt\n    return prev`,
      java: `ListNode reverseList(ListNode head) {\n    ListNode prev = null, cur = head;\n    while (cur != null) {\n        ListNode next = cur.next;\n        cur.next = prev;\n        prev = cur;\n        cur = next;\n    }\n    return prev;\n}`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* cur = head;\n    while (cur) {\n        ListNode* next = cur->next;\n        cur->next = prev;\n        prev = cur;\n        cur = next;\n    }\n    return prev;\n}`,
    },
    testData: { initial: [10, 20, 30, 40, 50] },
    run(code, testData) {
      const buildList = (arr) => { let h = null; for (let i = arr.length - 1; i >= 0; i--) h = { val: arr[i], next: h }; return h; };
      const toArr = (h) => { const a = []; let c = h; while (c) { a.push(c.val); c = c.next; } return a; };
      let head = buildList(testData.initial);
      const steps = [{ state: toArr(head), action: 'init', lastOp: 'Original list' }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('head', body);
      head = fn(head);
      steps.push({ state: toArr(head), action: 'done', lastOp: 'Reversed!', highlight: 0 });
      return steps;
    }
  },

  // ═══════════════ TREES ═══════════════
  {
    id: 'bst-insert', label: 'BST Insert', category: 'Trees',
    description: 'Insert a value into a Binary Search Tree maintaining BST property.',
    instructions: 'Create node: { val, left: null, right: null }. If val < root.val go left, else right. Return root.',
    starters: {
      javascript: `function insert(root, val) {\n  // Insert val into BST\n  // Return root\n}`,
      python: `def insert(root, val):\n    # Insert val into BST\n    # Return root\n    pass`,
      java: `TreeNode insert(TreeNode root, int val) {\n    // Insert val into BST\n    return root;\n}`,
      cpp: `TreeNode* insert(TreeNode* root, int val) {\n    // Insert val into BST\n    return root;\n}`,
    },
    solutions: {
      javascript: `function insert(root, val) {\n  if (!root) return { val, left: null, right: null };\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}`,
      python: `def insert(root, val):\n    if not root:\n        return TreeNode(val)\n    if val < root.val:\n        root.left = insert(root.left, val)\n    else:\n        root.right = insert(root.right, val)\n    return root`,
      java: `TreeNode insert(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}`,
      cpp: `TreeNode* insert(TreeNode* root, int val) {\n    if (!root) return new TreeNode(val);\n    if (val < root->val) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}`,
    },
    testData: { values: [50, 30, 70, 20, 40, 60, 80] },
    run(code, testData) {
      let root = null;
      const steps = [{ tree: null, action: 'init', lastOp: '', values: [] }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('root', 'val', 'insert', body);
      const ins = (r, v) => fn(r, v, ins);
      const clone = (n) => n ? { val: n.val, left: clone(n.left), right: clone(n.right) } : null;
      const inorder = (n) => n ? [...inorder(n.left), n.val, ...inorder(n.right)] : [];
      for (const v of testData.values) { root = ins(root, v); steps.push({ tree: clone(root), action: 'insert', lastOp: `insert(${v})`, newVal: v, values: inorder(root) }); }
      return steps;
    }
  },
  {
    id: 'bst-inorder', label: 'Inorder Traversal', category: 'Trees',
    description: 'Traverse BST in Left → Root → Right order (gives sorted output).',
    instructions: 'Call visit(node.val) when visiting a node. Traverse left subtree, visit root, then right subtree.',
    starters: {
      javascript: `function inorder(root, visit) {\n  // Left -> Visit -> Right\n}`,
      python: `def inorder(root, visit):\n    # Left -> Visit -> Right\n    pass`,
      java: `void inorder(TreeNode root, VisitFn visit) {\n    // Left -> Visit -> Right\n}`,
      cpp: `void inorder(TreeNode* root, function<void(int)> visit) {\n    // Left -> Visit -> Right\n}`,
    },
    solutions: {
      javascript: `function inorder(root, visit) {\n  if (!root) return;\n  inorder(root.left, visit);\n  visit(root.val);\n  inorder(root.right, visit);\n}`,
      python: `def inorder(root, visit):\n    if not root:\n        return\n    inorder(root.left, visit)\n    visit(root.val)\n    inorder(root.right, visit)`,
      java: `void inorder(TreeNode root, VisitFn visit) {\n    if (root == null) return;\n    inorder(root.left, visit);\n    visit.apply(root.val);\n    inorder(root.right, visit);\n}`,
      cpp: `void inorder(TreeNode* root, function<void(int)> visit) {\n    if (!root) return;\n    inorder(root->left, visit);\n    visit(root->val);\n    inorder(root->right, visit);\n}`,
    },
    testData: { values: [50, 30, 70, 20, 40, 60, 80] },
    run(code, testData) {
      // Build tree first
      const ins = (r, v) => { if (!r) return { val: v, left: null, right: null }; if (v < r.val) r.left = ins(r.left, v); else r.right = ins(r.right, v); return r; };
      let root = null;
      for (const v of testData.values) root = ins(root, v);
      const clone = (n) => n ? { val: n.val, left: clone(n.left), right: clone(n.right) } : null;
      const visited = [];
      const steps = [{ tree: clone(root), action: 'init', visited: [], lastOp: 'Tree built', values: [], newVal: null }];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('root', 'visit', 'inorder', body);
      const traverse = (r, v) => fn(r, v, traverse);
      traverse(root, (val) => { visited.push(val); steps.push({ tree: clone(root), action: 'visit', visited: [...visited], lastOp: `visit(${val})`, newVal: val, values: [...visited] }); });
      steps.push({ tree: clone(root), action: 'done', visited: [...visited], lastOp: 'Complete', values: [...visited], newVal: null });
      return steps;
    }
  },

  // ═══════════════ GRAPHS ═══════════════
  {
    id: 'graph-bfs', label: 'BFS', category: 'Graphs',
    description: 'Visit all nodes level by level starting from the source.',
    instructions: 'Use a queue and visited Set. Call visit(node) when visiting. Dequeue → visit → enqueue neighbors.',
    starters: {
      javascript: `function bfs(graph, start, visit) {\n  // Breadth-First Search\n  // graph = adjacency list object\n  // Call visit(node) when visiting\n}`,
      python: `def bfs(graph, start, visit):\n    # Breadth-First Search\n    # graph = adjacency list dict\n    # Call visit(node) when visiting\n    pass`,
      java: `void bfs(Map<String, List<String>> graph, String start, VisitFn visit) {\n    // Breadth-First Search\n}`,
      cpp: `void bfs(map<string, vector<string>>& graph, string start, function<void(string)> visit) {\n    // Breadth-First Search\n}`,
    },
    solutions: {
      javascript: `function bfs(graph, start, visit) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length > 0) {\n    const node = queue.shift();\n    visit(node);\n    for (const nb of (graph[node] || [])) {\n      if (!visited.has(nb)) {\n        visited.add(nb);\n        queue.push(nb);\n      }\n    }\n  }\n}`,
      python: `def bfs(graph, start, visit):\n    from collections import deque\n    queue = deque([start])\n    visited = {start}\n    while queue:\n        node = queue.popleft()\n        visit(node)\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)\n                queue.append(nb)`,
      java: `void bfs(Map<String, List<String>> graph, String start, VisitFn visit) {\n    Queue<String> queue = new LinkedList<>();\n    Set<String> visited = new HashSet<>();\n    queue.add(start);\n    visited.add(start);\n    while (!queue.isEmpty()) {\n        String node = queue.poll();\n        visit.apply(node);\n        for (String nb : graph.getOrDefault(node, List.of())) {\n            if (!visited.contains(nb)) {\n                visited.add(nb);\n                queue.add(nb);\n            }\n        }\n    }\n}`,
      cpp: `void bfs(map<string, vector<string>>& graph, string start, function<void(string)> visit) {\n    queue<string> q;\n    set<string> visited;\n    q.push(start);\n    visited.insert(start);\n    while (!q.empty()) {\n        string node = q.front(); q.pop();\n        visit(node);\n        for (auto& nb : graph[node]) {\n            if (!visited.count(nb)) {\n                visited.insert(nb);\n                q.push(nb);\n            }\n        }\n    }\n}`,
    },
    testData: { graph: { '0':['1','2'], '1':['0','3','4'], '2':['0','5'], '3':['1'], '4':['1','5'], '5':['2','4'] }, start: '0' },
    run(code, testData) {
      const steps = [{ visited: [], current: null, action: 'init' }];
      const visited = [];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('graph', 'start', 'visit', body);
      fn(testData.graph, testData.start, (n) => { visited.push(String(n)); steps.push({ visited: [...visited], current: String(n), action: 'visit' }); });
      steps.push({ visited: [...visited], current: null, action: 'done' });
      return steps;
    }
  },
  {
    id: 'graph-dfs', label: 'DFS', category: 'Graphs',
    description: 'Go as deep as possible before backtracking.',
    instructions: 'Use a stack and visited Set. Call visit(node) when visiting.',
    starters: {
      javascript: `function dfs(graph, start, visit) {\n  // Depth-First Search\n  // Call visit(node) when visiting\n}`,
      python: `def dfs(graph, start, visit):\n    # Depth-First Search\n    # Call visit(node) when visiting\n    pass`,
      java: `void dfs(Map<String, List<String>> graph, String start, VisitFn visit) {\n    // Depth-First Search\n}`,
      cpp: `void dfs(map<string, vector<string>>& graph, string start, function<void(string)> visit) {\n    // Depth-First Search\n}`,
    },
    solutions: {
      javascript: `function dfs(graph, start, visit) {\n  const stack = [start];\n  const visited = new Set();\n  while (stack.length > 0) {\n    const node = stack.pop();\n    if (visited.has(node)) continue;\n    visited.add(node);\n    visit(node);\n    for (const nb of (graph[node] || []).slice().reverse()) {\n      if (!visited.has(nb)) stack.push(nb);\n    }\n  }\n}`,
      python: `def dfs(graph, start, visit):\n    stack = [start]\n    visited = set()\n    while stack:\n        node = stack.pop()\n        if node in visited:\n            continue\n        visited.add(node)\n        visit(node)\n        for nb in reversed(graph.get(node, [])):\n            if nb not in visited:\n                stack.append(nb)`,
      java: `void dfs(Map<String, List<String>> graph, String start, VisitFn visit) {\n    Deque<String> stack = new ArrayDeque<>();\n    Set<String> visited = new HashSet<>();\n    stack.push(start);\n    while (!stack.isEmpty()) {\n        String node = stack.pop();\n        if (visited.contains(node)) continue;\n        visited.add(node);\n        visit.apply(node);\n        List<String> nbs = new ArrayList<>(graph.getOrDefault(node, List.of()));\n        Collections.reverse(nbs);\n        for (String nb : nbs) {\n            if (!visited.contains(nb)) stack.push(nb);\n        }\n    }\n}`,
      cpp: `void dfs(map<string, vector<string>>& graph, string start, function<void(string)> visit) {\n    stack<string> stk;\n    set<string> visited;\n    stk.push(start);\n    while (!stk.empty()) {\n        string node = stk.top(); stk.pop();\n        if (visited.count(node)) continue;\n        visited.insert(node);\n        visit(node);\n        auto& nbs = graph[node];\n        for (auto it = nbs.rbegin(); it != nbs.rend(); ++it) {\n            if (!visited.count(*it)) stk.push(*it);\n        }\n    }\n}`,
    },
    testData: { graph: { '0':['1','2'], '1':['0','3','4'], '2':['0','5'], '3':['1'], '4':['1','5'], '5':['2','4'] }, start: '0' },
    run(code, testData) {
      const steps = [{ visited: [], current: null, action: 'init' }];
      const visited = [];
      const body = code.replace(/^function\s+\w+\s*\([^)]*\)\s*\{/, '').replace(/\}\s*$/, '');
      const fn = new Function('graph', 'start', 'visit', body);
      fn(testData.graph, testData.start, (n) => { visited.push(String(n)); steps.push({ visited: [...visited], current: String(n), action: 'visit' }); });
      steps.push({ visited: [...visited], current: null, action: 'done' });
      return steps;
    }
  },
];

export const CATEGORIES = [...new Set(PLAYGROUND_TEMPLATES.map(t => t.category))];

export function getTemplatesByCategory(category) {
  return PLAYGROUND_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id) {
  return PLAYGROUND_TEMPLATES.find(t => t.id === id);
}

export { LANGS };
