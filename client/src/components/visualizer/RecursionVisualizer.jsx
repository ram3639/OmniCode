import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function recursion(n) {
  if (n <= 1) {
    return 1; // Base case
  }
  // Recursive calls
  let res1 = recursion(n - 1);
  let res2 = recursion(n - 2);
  return res1 + res2;
}`;

export default function RecursionVisualizer() {
  const [n, setN] = useState(5);
  const [algo, setAlgo] = useState('fibonacci'); // fibonacci, factorial, power
  const [tree, setTree] = useState(null);
  const [callStack, setCallStack] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [msg, setMsg] = useState('');
  const [highlightLines, setHighlightLines] = useState([]);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const runVisualization = async () => {
    setIsPlaying(true);
    setTree(null);
    setCallStack([]);
    setTotalCalls(0);
    setMsg('Running...');
    
    let calls = 0;
    
    // To construct tree visually, we'll assign unique IDs
    let nextId = 0;

    const createNode = (name, parentId = null) => {
      const id = nextId++;
      return { id, name, status: 'active', parentId, children: [], value: null };
    };

    const updateTreeStatus = (node, id, status, value = null) => {
      if (node.id === id) {
        node.status = status;
        if (value !== null) node.value = value;
        return true;
      }
      for (let child of node.children) {
        if (updateTreeStatus(child, id, status, value)) return true;
      }
      return false;
    };

    const addNodeToTree = (node, parentId, newNode) => {
      if (node.id === parentId) {
        node.children.push(newNode);
        return true;
      }
      for (let child of node.children) {
        if (addNodeToTree(child, parentId, newNode)) return true;
      }
      return false;
    };

    let rootNode = null;
    let stack = [];

    const fib = async (num, parentId = null) => {
      calls++;
      setTotalCalls(calls);
      const node = createNode(`fib(${num})`, parentId);
      
      if (!rootNode) {
        rootNode = node;
        setTree(JSON.parse(JSON.stringify(rootNode)));
      } else {
        addNodeToTree(rootNode, parentId, node);
        setTree(JSON.parse(JSON.stringify(rootNode)));
      }
      
      stack.push(node.name);
      setCallStack([...stack]);
      await delay(600);

      let res;
      if (num <= 1) {
        setHighlightLines([1, 2, 3]);
        res = num;
      } else {
        setHighlightLines([5, 6, 7]);
        const left = await fib(num - 1, node.id);
        setHighlightLines([5, 6, 7]);
        const right = await fib(num - 2, node.id);
        res = left + right;
      }

      updateTreeStatus(rootNode, node.id, 'completed', res);
      setTree(JSON.parse(JSON.stringify(rootNode)));
      stack.pop();
      setCallStack([...stack]);
      await delay(600);
      return res;
    };

    const fact = async (num, parentId = null) => {
      calls++;
      setTotalCalls(calls);
      const node = createNode(`fact(${num})`, parentId);
      
      if (!rootNode) rootNode = node;
      else addNodeToTree(rootNode, parentId, node);
      setTree(JSON.parse(JSON.stringify(rootNode)));
      
      stack.push(node.name);
      setCallStack([...stack]);
      await delay(600);

      let res;
      if (num <= 1) {
        setHighlightLines([1, 2, 3]);
        res = 1;
      } else {
        setHighlightLines([5, 6, 7]);
        res = num * await fact(num - 1, node.id);
      }

      updateTreeStatus(rootNode, node.id, 'completed', res);
      setTree(JSON.parse(JSON.stringify(rootNode)));
      stack.pop();
      setCallStack([...stack]);
      await delay(600);
      return res;
    };

    const power = async (base, exp, parentId = null) => {
      calls++;
      setTotalCalls(calls);
      const node = createNode(`pow(${base},${exp})`, parentId);
      
      if (!rootNode) rootNode = node;
      else addNodeToTree(rootNode, parentId, node);
      setTree(JSON.parse(JSON.stringify(rootNode)));
      
      stack.push(node.name);
      setCallStack([...stack]);
      await delay(600);

      let res;
      if (exp === 0) {
        setHighlightLines([1, 2, 3]);
        res = 1;
      } else {
        setHighlightLines([5, 6, 7]);
        res = base * await power(base, exp - 1, node.id);
      }

      updateTreeStatus(rootNode, node.id, 'completed', res);
      setTree(JSON.parse(JSON.stringify(rootNode)));
      stack.pop();
      setCallStack([...stack]);
      await delay(600);
      return res;
    };

    let result = 0;
    if (algo === 'fibonacci') result = await fib(n);
    else if (algo === 'factorial') result = await fact(n);
    else if (algo === 'power') result = await power(2, n);
    
    setMsg(`Finished! Result = ${result}`);
    setIsPlaying(false);
    setHighlightLines([]);
  };

  const calculatePositions = (node, x, y, level, dx) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.children.length === 1) {
      calculatePositions(node.children[0], x, y + 80, level + 1, dx);
    } else if (node.children.length === 2) {
      calculatePositions(node.children[0], x - dx, y + 80, level + 1, dx / 2);
      calculatePositions(node.children[1], x + dx, y + 80, level + 1, dx / 2);
    }
  };

  if (tree) {
    calculatePositions(tree, 400, 40, 1, 150);
  }

  const renderTree = (node) => {
    if (!node) return null;
    const color = node.status === 'active' ? 'var(--warning)' : 'var(--success)';
    return (
      <g key={node.id}>
        {node.children.map(child => (
          <line key={`l-${child.id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="var(--border-primary)" strokeWidth="2" />
        ))}
        <rect x={node.x - 35} y={node.y - 20} width="70" height="40" rx="4" fill={color} stroke="var(--border-primary)" strokeWidth="1" />
        <text x={node.x} y={node.y} textAnchor="middle" dy="5" fill="#000" fontSize="12" fontWeight="bold">{node.name}</text>
        {node.value !== null && <text x={node.x} y={node.y + 35} textAnchor="middle" fill="var(--text-secondary)" fontSize="12">ret: {node.value}</text>}
        {node.children.map(renderTree)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', alignItems: 'center' }}>
          <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={isPlaying} style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}>
            <option value="fibonacci">Fibonacci</option>
            <option value="factorial">Factorial</option>
            <option value="power">Power of 2</option>
          </select>
          <input type="number" value={n} onChange={e => setN(Number(e.target.value))} min="1" max="10" disabled={isPlaying} placeholder="n" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '80px' }} />
          <button onClick={runVisualization} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: isPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Run</button>
          <div style={{ width: '1px', background: 'var(--border-primary)', height: '20px', margin: '0 8px' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Total Calls: <strong style={{ color: 'var(--text-primary)' }}>{totalCalls}</strong></span>
          <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontWeight: 'bold' }}>{msg}</span>
        </div>
  
        <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
          <div style={{ flex: 3, background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 600">
              {tree ? renderTree(tree) : <text x="50%" y="50%" textAnchor="middle" fill="var(--text-muted)">Tree will appear here</text>}
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ margin: 0, textAlign: 'center' }}>Call Stack</h3>
            <div style={{ flex: 1, border: '4px solid var(--border-primary)', borderTop: 'none', padding: '16px', display: 'flex', flexDirection: 'column-reverse', gap: '8px', overflowY: 'auto' }}>
              {callStack.map((call, idx) => (
                <div key={idx} style={{ padding: '12px', background: idx === callStack.length - 1 ? 'var(--warning)' : 'var(--bg-primary)', color: idx === callStack.length - 1 ? '#000' : 'var(--text-primary)', textAlign: 'center', border: '1px solid var(--border-primary)', borderRadius: '4px', fontWeight: 'bold' }}>
                  {call}
                </div>
              ))}
              {callStack.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Empty</div>}
            </div>
          </div>
        </div>
      </div>
      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="Recursion" language="Pseudocode" />
    </div>
  );
}

