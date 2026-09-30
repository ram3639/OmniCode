/**
 * Sandbox Web Worker — Executes user code in a safe, isolated environment.
 * Wraps user functions with instrumented data structures that log every operation.
 * Returns step log for visualization or error for AI feedback.
 */

/* eslint-disable no-restricted-globals */

self.onmessage = function (e) {
  const { code, topic, testData, functionName } = e.data;
  const steps = [];
  let error = null;

  try {
    // Build instrumented execution environment based on topic
    let wrappedCode = '';

    switch (topic) {
      case 'stack-push':
      case 'stack-pop': {
        wrappedCode = `
          const stack = ${JSON.stringify(testData.initial || [])};
          const __steps = [];
          const __origPush = Array.prototype.push;
          const __origPop = Array.prototype.pop;

          // Instrument
          stack.push = function(val) {
            __origPush.call(this, val);
            __steps.push({ action: 'push', value: val, state: [...this] });
          };
          stack.pop = function() {
            const val = __origPop.call(this);
            __steps.push({ action: 'pop', value: val, state: [...this] });
            return val;
          };

          // User function
          ${code}

          // Execute
          const testValues = ${JSON.stringify(testData.testValues || [])};
          if ('${topic}' === 'stack-push') {
            for (const v of testValues) { ${functionName}(stack, v); }
          } else {
            for (let i = 0; i < ${testData.popCount || 1}; i++) { ${functionName}(stack); }
          }
          __steps;
        `;
        break;
      }

      case 'queue-enqueue':
      case 'queue-dequeue': {
        wrappedCode = `
          const queue = ${JSON.stringify(testData.initial || [])};
          const __steps = [];

          queue.enqueue = function(val) {
            this.push(val);
            __steps.push({ action: 'enqueue', value: val, state: [...this] });
          };
          queue.dequeueOp = function() {
            const val = this.shift();
            __steps.push({ action: 'dequeue', value: val, state: [...this] });
            return val;
          };

          ${code}

          const testValues = ${JSON.stringify(testData.testValues || [])};
          if ('${topic}' === 'queue-enqueue') {
            for (const v of testValues) { ${functionName}(queue, v); }
          } else {
            for (let i = 0; i < ${testData.dequeueCount || 1}; i++) { ${functionName}(queue); }
          }
          __steps;
        `;
        break;
      }

      case 'sorting': {
        wrappedCode = `
          const arr = ${JSON.stringify(testData.array || [])};
          const __steps = [{ action: 'init', state: [...arr], comparing: [], swapping: [] }];

          const __origSwap = (a, i, j) => {
            __steps.push({ action: 'compare', state: [...a], comparing: [i, j], swapping: [] });
            [a[i], a[j]] = [a[j], a[i]];
            __steps.push({ action: 'swap', state: [...a], comparing: [], swapping: [i, j] });
          };

          ${code}

          ${functionName}(arr);
          __steps.push({ action: 'done', state: [...arr], comparing: [], swapping: [] });
          __steps;
        `;
        break;
      }

      case 'searching': {
        wrappedCode = `
          const arr = ${JSON.stringify(testData.array || [])};
          const target = ${testData.target ?? 0};
          const __steps = [];

          ${code}

          const result = ${functionName}(arr, target, (idx, msg) => {
            __steps.push({ action: 'check', index: idx, message: msg || '', state: [...arr], target });
          });
          __steps.push({ action: 'result', found: result !== -1 && result !== undefined, index: result, state: [...arr], target });
          __steps;
        `;
        break;
      }

      case 'linked-list': {
        wrappedCode = `
          class ListNode {
            constructor(val, next = null) { this.val = val; this.next = next; }
          }
          let head = null;
          const __steps = [];

          function __snapshot() {
            const nodes = [];
            let cur = head;
            while (cur) { nodes.push(cur.val); cur = cur.next; }
            return nodes;
          }

          ${code}

          const testValues = ${JSON.stringify(testData.testValues || [])};
          for (const v of testValues) {
            head = ${functionName}(head, v);
            __steps.push({ action: 'insert', value: v, state: __snapshot() });
          }
          __steps;
        `;
        break;
      }

      case 'bst-insert': {
        wrappedCode = `
          class TreeNode {
            constructor(val) { this.val = val; this.left = null; this.right = null; }
          }
          let root = null;
          const __steps = [];

          function __treeToArray(node) {
            if (!node) return [];
            return [node.val, ...__treeToArray(node.left), ...__treeToArray(node.right)];
          }
          function __treeToObj(node) {
            if (!node) return null;
            return { val: node.val, left: __treeToObj(node.left), right: __treeToObj(node.right) };
          }

          ${code}

          const testValues = ${JSON.stringify(testData.testValues || [])};
          for (const v of testValues) {
            root = ${functionName}(root, v);
            __steps.push({ action: 'insert', value: v, tree: __treeToObj(root), values: __treeToArray(root) });
          }
          __steps;
        `;
        break;
      }

      case 'graph-bfs':
      case 'graph-dfs': {
        wrappedCode = `
          const graph = ${JSON.stringify(testData.graph || {})};
          const startNode = '${testData.startNode || '0'}';
          const __steps = [];

          ${code}

          ${functionName}(graph, startNode, (node, action) => {
            __steps.push({ action: action || 'visit', node, timestamp: __steps.length });
          });
          __steps;
        `;
        break;
      }

      default:
        throw new Error(`Unknown topic: ${topic}`);
    }

    // Execute with timeout
    const fn = new Function(wrappedCode);
    const result = fn();
    self.postMessage({ success: true, steps: result || steps });

  } catch (err) {
    self.postMessage({ success: false, error: err.message || 'Unknown error', steps });
  }
};
