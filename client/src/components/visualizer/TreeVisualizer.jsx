import React, { useState, useRef, useEffect } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const Controls = ({ onPlay, onPause, onStep, onReset, isPlaying }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <button onClick={onPlay} disabled={isPlaying} style={btnStyle(isPlaying ? 'var(--bg-primary)' : 'var(--accent)', isPlaying ? 'var(--text-muted)' : '#000')}>Play</button>
    <button onClick={onPause} disabled={!isPlaying} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Pause</button>
    <button onClick={onStep} disabled={isPlaying} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Step</button>
    <button onClick={onReset} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Reset</button>
  </div>
);

const btnStyle = (bg, color) => ({
  padding: '8px 16px', background: bg, color: color, border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
});
const inputStyle = { padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '120px' };

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

const calculatePositions = (node, x, y, dx) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  calculatePositions(node.left, x - dx, y + 80, dx / 2);
  calculatePositions(node.right, x + dx, y + 80, dx / 2);
};

// --- BST ---

const BST_CODE = `function bstInsert(root, val):
  if root is null:
    return new Node(val)
  curr = root
  while true:
    if val < curr.val:
      if curr.left is null:
        curr.left = new Node(val)
        break
      curr = curr.left
    else if val > curr.val:
      if curr.right is null:
        curr.right = new Node(val)
        break
      curr = curr.right
  return root`;

const AVL_CODE = `function avlInsert(node, val):
  if node is null:
    return new Node(val)
  if val < node.val:
    node.left = avlInsert(node.left, val)
  else if val > node.val:
    node.right = avlInsert(node.right, val)
  else:
    return node

  node.height = 1 + max(height(node.left), height(node.right))
  bal = getBalance(node)

  if bal > 1 and val < node.left.val:
    return rightRotate(node)
  if bal < -1 and val > node.right.val:
    return leftRotate(node)
  if bal > 1 and val > node.left.val:
    node.left = leftRotate(node.left)
    return rightRotate(node)
  if bal < -1 and val < node.right.val:
    node.right = rightRotate(node.right)
    return leftRotate(node)

  return node`;

const TRAVERSALS_CODE = `function preOrder(node):
  if node is null: return
  visit(node)
  preOrder(node.left)
  preOrder(node.right)

function inOrder(node):
  if node is null: return
  inOrder(node.left)
  visit(node)
  inOrder(node.right)

function postOrder(node):
  if node is null: return
  postOrder(node.left)
  postOrder(node.right)
  visit(node)`;

function BSTVisualizer({ setGlobalHighlightLines, setGlobalCode }) {
  useEffect(() => { setGlobalCode(BST_CODE); }, []);
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const setHighlightLines = setGlobalHighlightLines;
  const playRef = useRef(false);
  const stepRef = useRef(false);

  const waitForStep = async () => {
    while (!playRef.current && !stepRef.current) {
      await sleep(100);
    }
    if (stepRef.current) stepRef.current = false;
    else await sleep(600);
  };

  const handlePlay = () => { playRef.current = true; setIsPlaying(true); };
  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { stepRef.current = true; };
  const handleReset = () => { setRoot(null); setActiveNodes([]); handlePause(); };

  const handleInsert = async () => {
    if (!inputValue) return;
    const val = Number(inputValue);
    let newRoot = root ? JSON.parse(JSON.stringify(root)) : null;
    setInputValue('');
    
    if (!newRoot) {
      setRoot(new TreeNode(val));
      return;
    }
    
    setHighlightLines([4]);
    let curr = newRoot;
    while (true) {
      setActiveNodes([curr.val]);
      await waitForStep();
      setHighlightLines([6]);
      if (val < curr.val) {
        setHighlightLines([8]);
        if (!curr.left) { curr.left = new TreeNode(val); break; }
        setHighlightLines([10]);
        curr = curr.left;
      } else if (val > curr.val) {
        setHighlightLines([11]);
        setHighlightLines([13]);
        if (!curr.right) { curr.right = new TreeNode(val); break; }
        setHighlightLines([15]);
        curr = curr.right;
      } else { break; }
    }
    setRoot(newRoot);
    setActiveNodes([]);
  };

  const handleSearch = async () => {
    if (!inputValue) return;
    const target = Number(inputValue);
    let curr = root;
    while (curr) {
      setActiveNodes([curr.val]);
      await waitForStep();
      if (target === curr.val) break;
      curr = target < curr.val ? curr.left : curr.right;
    }
    setActiveNodes([]);
  };

  const handleDelete = async () => {
    if (!inputValue) return;
    const val = Number(inputValue);
    setInputValue('');
    
    const delNode = async (node, key) => {
      if (!node) return null;
      setActiveNodes([node.val]);
      await waitForStep();
      if (key < node.val) node.left = await delNode(node.left, key);
      else if (key > node.val) node.right = await delNode(node.right, key);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let temp = node.right;
        while (temp.left) temp = temp.left;
        node.val = temp.val;
        node.right = await delNode(node.right, temp.val);
      }
      return node;
    };
    
    let newRoot = root ? JSON.parse(JSON.stringify(root)) : null;
    newRoot = await delNode(newRoot, val);
    setRoot(newRoot);
    setActiveNodes([]);
  };

  if (root) calculatePositions(root, 400, 40, 200);

  const renderTree = (node) => {
    if (!node) return null;
    const isActive = activeNodes.includes(node.val);
    return (
      <g key={node.val}>
        {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="var(--border-primary)" strokeWidth="2" />}
        {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="var(--border-primary)" strokeWidth="2" />}
        <circle cx={node.x} cy={node.y} r="24" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={isActive ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" style={{ transition: 'all 0.3s' }} />
        <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{node.val}</text>
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', flexWrap: 'wrap' }}>
        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" style={inputStyle} />
        <button onClick={handleInsert} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Insert</button>
        <button onClick={handleSearch} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Search</button>
        <button onClick={handleDelete} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Delete</button>
        <div style={{ flex: 1 }} />
        <Controls onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset} isPlaying={isPlaying} />
      </div>
      <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>{renderTree(root)}</svg>
    </div>
  );
}

// --- AVL ---
function AVLTreeVisualizer({ setGlobalHighlightLines, setGlobalCode }) {
  useEffect(() => { setGlobalCode(AVL_CODE); setGlobalHighlightLines([]); }, []);
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(false);
  const stepRef = useRef(false);

  const waitForStep = async () => {
    while (!playRef.current && !stepRef.current) await sleep(100);
    if (stepRef.current) stepRef.current = false;
    else await sleep(600);
  };

  const handlePlay = () => { playRef.current = true; setIsPlaying(true); };
  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { stepRef.current = true; };
  const handleReset = () => { setRoot(null); handlePause(); };

  const height = (n) => n ? n.height : 0;
  const updateHeight = (n) => { n.height = 1 + Math.max(height(n.left), height(n.right)); };
  const getBal = (n) => n ? height(n.left) - height(n.right) : 0;

  const rightRotate = (y) => {
    let x = y.left; let T2 = x.right;
    x.right = y; y.left = T2;
    updateHeight(y); updateHeight(x);
    return x;
  };
  const leftRotate = (x) => {
    let y = x.right; let T2 = y.left;
    y.left = x; x.right = T2;
    updateHeight(x); updateHeight(y);
    return y;
  };

  const insertAVL = async (node, val) => {
    if (!node) return new TreeNode(val);
    setActiveNodes([node.val]); await waitForStep();
    if (val < node.val) node.left = await insertAVL(node.left, val);
    else if (val > node.val) node.right = await insertAVL(node.right, val);
    else return node;

    updateHeight(node);
    let bal = getBal(node);

    if (bal > 1 && val < node.left.val) return rightRotate(node);
    if (bal < -1 && val > node.right.val) return leftRotate(node);
    if (bal > 1 && val > node.left.val) { node.left = leftRotate(node.left); return rightRotate(node); }
    if (bal < -1 && val < node.right.val) { node.right = rightRotate(node.right); return leftRotate(node); }
    return node;
  };

  const handleInsert = async () => {
    if (!inputValue) return;
    const val = Number(inputValue);
    setInputValue('');
    let newRoot = root ? JSON.parse(JSON.stringify(root)) : null;
    newRoot = await insertAVL(newRoot, val);
    setRoot(newRoot);
    setActiveNodes([]);
  };

  if (root) calculatePositions(root, 400, 40, 200);

  const renderTree = (node) => {
    if (!node) return null;
    const isActive = activeNodes.includes(node.val);
    return (
      <g key={node.val}>
        {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="var(--border-primary)" strokeWidth="2" />}
        {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="var(--border-primary)" strokeWidth="2" />}
        <circle cx={node.x} cy={node.y} r="24" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={isActive ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" />
        <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{node.val}</text>
        <text x={node.x + 30} y={node.y - 20} fill="var(--accent)" fontSize="12">bf:{getBal(node)}</text>
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', flexWrap: 'wrap' }}>
        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" style={inputStyle} />
        <button onClick={handleInsert} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Insert</button>
        <div style={{ flex: 1 }} />
        <Controls onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset} isPlaying={isPlaying} />
      </div>
      <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>{renderTree(root)}</svg>
    </div>
  );
}

// --- Traversals ---
function TraversalsVisualizer({ setGlobalHighlightLines, setGlobalCode }) {
  useEffect(() => { setGlobalCode(TRAVERSALS_CODE); setGlobalHighlightLines([]); }, []);
  const setHighlightLines = setGlobalHighlightLines;
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  const [visitOrder, setVisitOrder] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(false);
  const stepRef = useRef(false);

  const waitForStep = async () => {
    while (!playRef.current && !stepRef.current) await sleep(100);
    if (stepRef.current) stepRef.current = false;
    else await sleep(600);
  };
  const handlePlay = () => { playRef.current = true; setIsPlaying(true); };
  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { stepRef.current = true; };
  const handleReset = () => { setRoot(null); setVisitOrder([]); setActiveNodes([]); handlePause(); };

  const insertNode = (node, val) => {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insertNode(node.left, val);
    else if (val > node.val) node.right = insertNode(node.right, val);
    return node;
  };
  const handleInsert = () => {
    if (inputValue) { setRoot(insertNode(root ? JSON.parse(JSON.stringify(root)) : null, Number(inputValue))); setInputValue(''); }
  };

  const traverse = async (type) => {
    setVisitOrder([]);
    const v = [];
    const inOrder = async (node) => { if (!node) return; await inOrder(node.left); setHighlightLines([10]); setActiveNodes([node.val]); await waitForStep(); v.push(node.val); setVisitOrder([...v]); await inOrder(node.right); };
    const preOrder = async (node) => { if (!node) return; setHighlightLines([3]); setActiveNodes([node.val]); await waitForStep(); v.push(node.val); setVisitOrder([...v]); await preOrder(node.left); await preOrder(node.right); };
    const postOrder = async (node) => { if (!node) return; await postOrder(node.left); await postOrder(node.right); setHighlightLines([17]); setActiveNodes([node.val]); await waitForStep(); v.push(node.val); setVisitOrder([...v]); };
    const levelOrder = async (node) => {
      if (!node) return;
      const q = [node];
      while (q.length > 0) {
        let curr = q.shift();
        setActiveNodes([curr.val]); await waitForStep();
        v.push(curr.val); setVisitOrder([...v]);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    };
    
    if (type === 'in') await inOrder(root);
    if (type === 'pre') await preOrder(root);
    if (type === 'post') await postOrder(root);
    if (type === 'level') await levelOrder(root);
    setActiveNodes([]);
  };

  if (root) calculatePositions(root, 400, 40, 200);
  const renderTree = (node) => {
    if (!node) return null;
    const isActive = activeNodes.includes(node.val);
    return (
      <g key={node.val}>
        {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="var(--border-primary)" strokeWidth="2" />}
        {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="var(--border-primary)" strokeWidth="2" />}
        <circle cx={node.x} cy={node.y} r="24" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={isActive ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" />
        <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{node.val}</text>
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', flexWrap: 'wrap' }}>
        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Build BST val" style={inputStyle} />
        <button onClick={handleInsert} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Insert</button>
        <button onClick={() => traverse('pre')} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Pre-order</button>
        <button onClick={() => traverse('in')} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>In-order</button>
        <button onClick={() => traverse('post')} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Post-order</button>
        <button onClick={() => traverse('level')} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Level-order</button>
        <div style={{ flex: 1 }} />
        <Controls onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset} isPlaying={isPlaying} />
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <svg width="600" height="350" viewBox="0 0 800 400" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', flex: 1 }}>{renderTree(root)}</svg>
        <div style={{ width: '200px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px', color: 'var(--text-primary)', overflowY: 'auto', maxHeight: '350px' }}>
          <h3>Visit Order</h3>
          <ol style={{ paddingLeft: '20px' }}>
            {visitOrder.map((v, i) => <li key={i}>{v}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

// --- Trie ---
class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = {};
    this.isEndOfWord = false;
    this.x = 0; this.y = 0;
  }
}
function TrieVisualizer({ setGlobalHighlightLines, setGlobalCode }) {
  useEffect(() => { setGlobalCode(''); setGlobalHighlightLines([]); }, []);
  const [root, setRoot] = useState(new TrieNode(''));
  const [inputValue, setInputValue] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(false);
  const stepRef = useRef(false);

  const waitForStep = async () => {
    while (!playRef.current && !stepRef.current) await sleep(100);
    if (stepRef.current) stepRef.current = false;
    else await sleep(600);
  };
  const handlePlay = () => { playRef.current = true; setIsPlaying(true); };
  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { stepRef.current = true; };
  const handleReset = () => { setRoot(new TrieNode('')); setActiveNodes([]); handlePause(); };

  const handleInsert = async () => {
    if (!inputValue) return;
    const word = inputValue.toLowerCase();
    setInputValue('');
    let curr = root;
    let path = [curr];
    for (let char of word) {
      if (!curr.children[char]) curr.children[char] = new TrieNode(char);
      curr = curr.children[char];
      path.push(curr);
      setActiveNodes([...path]);
      await waitForStep();
    }
    curr.isEndOfWord = true;
    setRoot(Object.assign(Object.create(Object.getPrototypeOf(root)), root));
    setActiveNodes([]);
  };

  const handleSearch = async () => {
    if (!inputValue) return;
    const prefix = inputValue.toLowerCase();
    let curr = root;
    let path = [curr];
    for (let char of prefix) {
      if (!curr.children[char]) break;
      curr = curr.children[char];
      path.push(curr);
      setActiveNodes([...path]);
      await waitForStep();
    }
    setActiveNodes([]);
  };

  const calcTriePos = (node, x, y, dx) => {
    node.x = x; node.y = y;
    const keys = Object.keys(node.children);
    let startX = x - (keys.length - 1) * dx / 2;
    keys.forEach((k, i) => {
      calcTriePos(node.children[k], startX + i * dx, y + 80, dx / 1.5);
    });
  };
  calcTriePos(root, 400, 40, 200);

  const renderTrie = (node) => {
    if (!node) return null;
    const isActive = activeNodes.includes(node);
    return (
      <g key={node.x + '-' + node.y}>
        {Object.keys(node.children).map(k => {
          const child = node.children[k];
          const edgeActive = activeNodes.includes(node) && activeNodes.includes(child);
          return <line key={k} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke={edgeActive ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" />;
        })}
        <circle cx={node.x} cy={node.y} r="20" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={node.isEndOfWord ? 'var(--text-primary)' : 'var(--border-primary)'} strokeWidth="2" />
        <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{node.char || '*'}</text>
        {Object.values(node.children).map(renderTrie)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', flexWrap: 'wrap' }}>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Word / Prefix" style={inputStyle} />
        <button onClick={handleInsert} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Insert Word</button>
        <button onClick={handleSearch} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Search Prefix</button>
        <div style={{ flex: 1 }} />
        <Controls onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset} isPlaying={isPlaying} />
      </div>
      <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>{renderTrie(root)}</svg>
    </div>
  );
}

// --- Heap ---
function HeapVisualizer({ setGlobalHighlightLines, setGlobalCode }) {
  useEffect(() => { setGlobalCode(''); setGlobalHighlightLines([]); }, []);
  const [heap, setHeap] = useState([]);
  const [isMin, setIsMin] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(false);
  const stepRef = useRef(false);

  const waitForStep = async () => {
    while (!playRef.current && !stepRef.current) await sleep(100);
    if (stepRef.current) stepRef.current = false;
    else await sleep(600);
  };
  const handlePlay = () => { playRef.current = true; setIsPlaying(true); };
  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { stepRef.current = true; };
  const handleReset = () => { setHeap([]); setActiveIndex(-1); handlePause(); };

  const compare = (a, b) => isMin ? a < b : a > b;

  const handleInsert = async () => {
    if (!inputValue) return;
    const val = Number(inputValue);
    setInputValue('');
    let newHeap = [...heap, val];
    setHeap([...newHeap]);
    let i = newHeap.length - 1;
    setActiveIndex(i); await waitForStep();
    
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (compare(newHeap[i], newHeap[p])) {
        [newHeap[i], newHeap[p]] = [newHeap[p], newHeap[i]];
        setHeap([...newHeap]);
        setActiveIndex(p); await waitForStep();
        i = p;
      } else break;
    }
    setActiveIndex(-1);
  };

  const handleExtract = async () => {
    if (heap.length === 0) return;
    let newHeap = [...heap];
    newHeap[0] = newHeap.pop();
    setHeap([...newHeap]);
    if (newHeap.length === 0) return;
    let i = 0;
    setActiveIndex(i); await waitForStep();

    while (true) {
      let l = 2 * i + 1, r = 2 * i + 2, swapIdx = i;
      if (l < newHeap.length && compare(newHeap[l], newHeap[swapIdx])) swapIdx = l;
      if (r < newHeap.length && compare(newHeap[r], newHeap[swapIdx])) swapIdx = r;
      if (swapIdx !== i) {
        [newHeap[i], newHeap[swapIdx]] = [newHeap[swapIdx], newHeap[i]];
        setHeap([...newHeap]);
        setActiveIndex(swapIdx); await waitForStep();
        i = swapIdx;
      } else break;
    }
    setActiveIndex(-1);
  };

  const getHeapPos = (i, x, y, dx) => {
    if (i >= heap.length) return null;
    return {
      x, y, val: heap[i],
      left: getHeapPos(2 * i + 1, x - dx, y + 60, dx / 2),
      right: getHeapPos(2 * i + 2, x + dx, y + 60, dx / 2)
    };
  };
  const rootObj = getHeapPos(0, 400, 40, 200);

  const renderHeapTree = (node, index = 0) => {
    if (!node) return null;
    const isActive = activeIndex === index;
    return (
      <g key={index}>
        {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="var(--border-primary)" strokeWidth="2" />}
        {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="var(--border-primary)" strokeWidth="2" />}
        <circle cx={node.x} cy={node.y} r="20" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={isActive ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" />
        <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{node.val}</text>
        {renderHeapTree(node.left, 2 * index + 1)}
        {renderHeapTree(node.right, 2 * index + 2)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => { setIsMin(!isMin); handleReset(); }} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>{isMin ? 'Min Heap' : 'Max Heap'}</button>
        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" style={inputStyle} />
        <button onClick={handleInsert} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Insert</button>
        <button onClick={handleExtract} style={btnStyle('var(--bg-primary)', 'var(--text-primary)')}>Extract {isMin ? 'Min' : 'Max'}</button>
        <div style={{ flex: 1 }} />
        <Controls onPlay={handlePlay} onPause={handlePause} onStep={handleStep} onReset={handleReset} isPlaying={isPlaying} />
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <svg width="600" height="350" viewBox="0 0 800 400" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', flex: 1 }}>{renderHeapTree(rootObj)}</svg>
        <div style={{ width: '200px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px', color: 'var(--text-primary)', overflowY: 'auto', maxHeight: '350px' }}>
          <h3>Array</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {heap.map((v, i) => (
              <div key={i} style={{ padding: '8px', background: activeIndex === i ? 'var(--accent)' : 'var(--bg-primary)', color: activeIndex === i ? '#000' : 'var(--text-primary)', borderRadius: '4px', border: '1px solid var(--border-primary)' }}>
                [{i}] {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function TreeVisualizer() {
  const [highlightLines, setHighlightLines] = useState([]);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('bst');

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>
        {['bst', 'avl', 'traversals', 'trie', 'heap'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'bst' && <BSTVisualizer setGlobalHighlightLines={setHighlightLines} setGlobalCode={setCode} />}
        {activeTab === 'avl' && <AVLTreeVisualizer setGlobalHighlightLines={setHighlightLines} setGlobalCode={setCode} />}
        {activeTab === 'traversals' && <TraversalsVisualizer setGlobalHighlightLines={setHighlightLines} setGlobalCode={setCode} />}
        {activeTab === 'trie' && <TrieVisualizer setGlobalHighlightLines={setHighlightLines} setGlobalCode={setCode} />}
        {activeTab === 'heap' && <HeapVisualizer setGlobalHighlightLines={setHighlightLines} setGlobalCode={setCode} />}
      </div>
    </div>
      <CodeHighlightPanel playgroundTopic="bst-insert" code={code} highlightLines={highlightLines} />
    </div>
  );
}
