import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `class LinkedList {
  insert(val, pos) {
    let node = new Node(val);
    if (pos === 0) {
      node.next = this.head;
      this.head = node;
      return;
    }
    let curr = this.head;
    for (let i = 0; i < pos - 1; i++) {
      curr = curr.next;
    }
    node.next = curr.next;
    curr.next = node;
  }
}`;

export default function LinkedListVisualizer() {
  const [list, setList] = useState([10, 20, 30]);
  const [val, setVal] = useState('');
  const [pos, setPos] = useState('');
  const [activeTab, setActiveTab] = useState('singly'); // singly, doubly, circular
  const [activeIndices, setActiveIndices] = useState([]);
  const [msg, setMsg] = useState('');
  const [highlightLines, setHighlightLines] = useState([]);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const insertAt = async () => {
    let idx = pos === '' ? list.length : Number(pos);
    if (idx < 0 || idx > list.length || !val) return;
    
    // Animate traversal
    for (let i = 0; i < idx; i++) {
      setActiveIndices([i]);
      setMsg(`Traversing node ${i}`);
      setHighlightLines([9, 10, 11]);
      await delay(500);
    }
    
    setHighlightLines([13, 14]);
    let newList = [...list];
    newList.splice(idx, 0, Number(val));
    setList(newList);
    setActiveIndices([idx]);
    setMsg(`Inserted ${val} at ${idx}`);
    await delay(1000);
    setActiveIndices([]);
    setHighlightLines([]);
  };

  const deleteAt = async () => {
    let idx = pos === '' ? list.length - 1 : Number(pos);
    if (idx < 0 || idx >= list.length) return;

    for (let i = 0; i <= idx; i++) {
      setActiveIndices([i]);
      setMsg(`Traversing node ${i}`);
      await delay(500);
    }
    
    let newList = [...list];
    let removed = newList.splice(idx, 1)[0];
    setList(newList);
    setMsg(`Deleted ${removed} from ${idx}`);
    setActiveIndices([]);
  };

  const search = async () => {
    if (!val) return;
    let target = Number(val);
    for (let i = 0; i < list.length; i++) {
      setActiveIndices([i]);
      setMsg(`Comparing ${list[i]} with ${target}`);
      await delay(600);
      if (list[i] === target) {
        setMsg(`Found ${target} at index ${i}`);
        await delay(1000);
        setActiveIndices([]);
        return;
      }
    }
    setMsg(`Not found`);
    setActiveIndices([]);
  };

  const reverseList = async () => {
    setMsg('Reversing List...');
    let newList = [];
    for (let i = list.length - 1; i >= 0; i--) {
      setActiveIndices([i]);
      newList.push(list[i]);
      await delay(500);
    }
    setList(newList);
    setActiveIndices([]);
    setMsg('Reversed');
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>
          {['singly', 'doubly', 'circular'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setList([10, 20, 30]); setMsg(''); }}
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
              {tab} Linked List
            </button>
          ))}
        </div>
  
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} />
          <input type="number" value={pos} onChange={e => setPos(e.target.value)} placeholder="Index (opt)" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} />
          
          <button onClick={insertAt} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Insert</button>
          <button onClick={deleteAt} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
          <button onClick={search} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
          <button onClick={reverseList} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Reverse</button>
          <button onClick={() => setList([])} style={{ padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
          <span style={{ marginLeft: 'auto', alignSelf: 'center', color: 'var(--warning)', fontWeight: 'bold' }}>{msg}</span>
        </div>
        
        <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', overflow: 'auto', display: 'flex', alignItems: 'center', padding: '24px' }}>
          <svg width={Math.max(800, list.length * 150 + 100)} height="200" style={{ margin: 'auto' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
              </marker>
              <marker id="arrowhead-rev" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
                <polygon points="10 0, 0 3.5, 10 7" fill="var(--text-muted)" />
              </marker>
            </defs>
            
            {list.map((item, i) => {
              const x = 50 + i * 150;
              const y = 100;
              const isActive = activeIndices.includes(i);
              return (
                <g key={i}>
                  {/* Nodes */}
                  <rect x={x} y={y - 25} width="60" height="50" rx="8" fill={isActive ? 'var(--accent)' : 'var(--bg-primary)'} stroke={isActive ? '#000' : 'var(--border-primary)'} strokeWidth="2" style={{ transition: 'all 0.3s' }} />
                  <text x={x + 30} y={y + 5} textAnchor="middle" fill={isActive ? '#000' : 'var(--text-primary)'} fontWeight="bold">{item}</text>
                  <text x={x + 30} y={y + 40} textAnchor="middle" fill="var(--text-muted)" fontSize="12">{i}</text>
                  
                  {/* Next Pointer */}
                  {i < list.length - 1 && (
                    <line x1={x + 60} y1={activeTab === 'doubly' ? y - 10 : y} x2={x + 150} y2={activeTab === 'doubly' ? y - 10 : y} stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  )}
                  
                  {/* Prev Pointer (Doubly) */}
                  {activeTab === 'doubly' && i < list.length - 1 && (
                    <line x1={x + 150} y1={y + 10} x2={x + 60} y2={y + 10} stroke="var(--text-muted)" strokeWidth="2" markerStart="url(#arrowhead-rev)" />
                  )}
                </g>
              );
            })}
            
            {/* Circular Pointer */}
            {activeTab === 'circular' && list.length > 0 && (
              <path 
                d={`M ${50 + (list.length - 1) * 150 + 60} 100 Q ${50 + (list.length - 1) * 150 + 100} 180, ${50 + (list.length * 150) / 2} 180 Q 20 180, 50 125`}
                fill="none" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5"
              />
            )}
  
            {list.length === 0 && <text x="50%" y="50%" textAnchor="middle" fill="var(--text-muted)">Empty List</text>}
          </svg>
        </div>
      </div>
      <CodeHighlightPanel playgroundTopic="linked-list-insert" code={CODE} highlightLines={highlightLines} title="Linked List Insertion" language="Pseudocode" />
    </div>
  );
}

