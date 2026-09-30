import React, { useState, useRef, useEffect } from 'react';

function ArrayVisualizer() {
  const [array, setArray] = useState([10, 20, 30, 40, 50]);
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const handlePush = () => {
    if (inputValue) {
      setArray([...array, Number(inputValue)]);
      setInputValue('');
    }
  };

  const handlePop = () => {
    setArray(array.slice(0, -1));
  };

  const handleInsertAt = () => {
    const idx = Number(indexValue);
    if (inputValue && idx >= 0 && idx <= array.length) {
      const newArr = [...array];
      newArr.splice(idx, 0, Number(inputValue));
      setArray(newArr);
      setInputValue('');
      setIndexValue('');
    }
  };

  const handleRemoveAt = () => {
    const idx = Number(indexValue);
    if (idx >= 0 && idx < array.length) {
      const newArr = [...array];
      newArr.splice(idx, 1);
      setArray(newArr);
      setIndexValue('');
    }
  };

  const handleSearch = async () => {
    const target = Number(inputValue);
    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      await new Promise(r => setTimeout(r, 500));
      if (array[i] === target) {
        break;
      }
    }
    setTimeout(() => setActiveIndex(-1), 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
        <input 
          type="number" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          placeholder="Value" 
          style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} 
        />
        <input 
          type="number" 
          value={indexValue} 
          onChange={e => setIndexValue(e.target.value)} 
          placeholder="Index" 
          style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} 
        />
        
        <button onClick={handlePush} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Push</button>
        <button onClick={handlePop} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Pop</button>
        <button onClick={handleInsertAt} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Insert At</button>
        <button onClick={handleRemoveAt} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Remove At</button>
        <button onClick={handleSearch} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {array.map((val, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: activeIndex === idx ? 'var(--warning)' : 'var(--bg-primary)',
                color: activeIndex === idx ? '#000' : 'var(--text-primary)',
                border: '2px solid var(--border-primary)',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}>
                {val}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{idx}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackQueueVisualizer() {
  const [stack, setStack] = useState([1, 2, 3]);
  const [queue, setQueue] = useState([1, 2, 3]);
  const [stackInput, setStackInput] = useState('');
  const [queueInput, setQueueInput] = useState('');

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Stack */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Stack (LIFO)</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="number" 
            value={stackInput} 
            onChange={e => setStackInput(e.target.value)} 
            style={{ flex: 1, padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }} 
          />
          <button onClick={() => { if(stackInput) { setStack([...stack, Number(stackInput)]); setStackInput(''); } }} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Push</button>
          <button onClick={() => setStack(stack.slice(0, -1))} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Pop</button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', justifyContent: 'flex-start', border: '4px solid var(--border-primary)', borderTop: 'none', padding: '16px', overflowY: 'auto', gap: '8px' }}>
          {stack.map((val, idx) => (
            <div key={idx} style={{
              width: '120px', padding: '16px', textAlign: 'center',
              background: idx === stack.length - 1 ? 'var(--accent)' : 'var(--bg-primary)',
              color: idx === stack.length - 1 ? '#000' : 'var(--text-primary)',
              border: '1px solid var(--border-primary)', borderRadius: '4px',
              fontWeight: 'bold', transition: 'all 0.3s'
            }}>
              {val}
            </div>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Queue (FIFO)</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="number" 
            value={queueInput} 
            onChange={e => setQueueInput(e.target.value)} 
            style={{ flex: 1, padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }} 
          />
          <button onClick={() => { if(queueInput) { setQueue([...queue, Number(queueInput)]); setQueueInput(''); } }} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enqueue</button>
          <button onClick={() => setQueue(queue.slice(1))} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Dequeue</button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderTop: '4px solid var(--border-primary)', borderBottom: '4px solid var(--border-primary)', padding: '16px', overflowX: 'auto', gap: '8px' }}>
          {queue.map((val, idx) => (
            <div key={idx} style={{
              minWidth: '80px', padding: '16px', textAlign: 'center',
              background: idx === 0 ? 'var(--warning)' : 'var(--bg-primary)',
              color: idx === 0 ? '#000' : 'var(--text-primary)',
              border: '1px solid var(--border-primary)', borderRadius: '4px',
              fontWeight: 'bold', transition: 'all 0.3s'
            }}>
              {val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

function BSTVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  
  // Create initial tree
  useEffect(() => {
    const vals = [50, 30, 70, 20, 40, 60, 80];
    let newRoot = null;
    vals.forEach(v => {
      newRoot = insertNode(newRoot, v);
    });
    setRoot(newRoot);
  }, []);

  const insertNode = (node, val) => {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insertNode(node.left, val);
    else if (val > node.val) node.right = insertNode(node.right, val);
    return node;
  };

  const handleInsert = () => {
    if (inputValue) {
      setRoot(insertNode(JSON.parse(JSON.stringify(root)), Number(inputValue)));
      setInputValue('');
    }
  };

  const traverse = async (type) => {
    const visited = [];
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      visited.push(node.val);
      inorder(node.right);
    };
    const preorder = (node) => {
      if (!node) return;
      visited.push(node.val);
      preorder(node.left);
      preorder(node.right);
    };
    const postorder = (node) => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      visited.push(node.val);
    };

    if (type === 'in') inorder(root);
    if (type === 'pre') preorder(root);
    if (type === 'post') postorder(root);

    for (let i = 0; i < visited.length; i++) {
      setActiveNodes([visited[i]]);
      await new Promise(r => setTimeout(r, 500));
    }
    setActiveNodes([]);
  };

  const calculatePositions = (node, x, y, level, dx) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    calculatePositions(node.left, x - dx, y + 80, level + 1, dx / 2);
    calculatePositions(node.right, x + dx, y + 80, level + 1, dx / 2);
  };

  if (root) {
    calculatePositions(root, 400, 40, 1, 200);
  }

  const renderTree = (node) => {
    if (!node) return null;
    const isActive = activeNodes.includes(node.val);
    return (
      <g key={node.val}>
        {node.left && (
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="var(--border-primary)" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="var(--border-primary)" strokeWidth="2" />
        )}
        <circle 
          cx={node.x} 
          cy={node.y} 
          r="24" 
          fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} 
          stroke={isActive ? 'var(--accent)' : 'var(--border-primary)'}
          strokeWidth="2"
          style={{ transition: 'all 0.3s' }}
        />
        <text 
          x={node.x} 
          y={node.y} 
          textAnchor="middle" 
          dy=".3em" 
          fill={isActive ? '#000' : 'var(--text-primary)'}
          fontWeight="bold"
        >
          {node.val}
        </text>
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
        <input 
          type="number" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          placeholder="Value" 
          style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '120px' }} 
        />
        <button onClick={handleInsert} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Insert</button>
        <button onClick={() => setRoot(null)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
        <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 8px' }} />
        <button onClick={() => traverse('in')} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>In-order</button>
        <button onClick={() => traverse('pre')} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Pre-order</button>
        <button onClick={() => traverse('post')} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Post-order</button>
      </div>
      
      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {renderTree(root)}
        </svg>
      </div>
    </div>
  );
}


export default function DataStructureVisualizer() {
  const [activeTab, setActiveTab] = useState('array');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>
        {['array', 'stack', 'bst'].map(tab => (
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
            {tab === 'stack' ? 'Stack & Queue' : tab === 'bst' ? 'Binary Search Tree' : tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'array' && <ArrayVisualizer />}
        {activeTab === 'stack' && <StackQueueVisualizer />}
        {activeTab === 'bst' && <BSTVisualizer />}
      </div>
    </div>
  );
}
