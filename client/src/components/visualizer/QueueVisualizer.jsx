import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function enqueue(queue, val):
  if isFull(queue):
    return
  queue.push(val)

function dequeue(queue):
  if isEmpty(queue):
    return null
  return queue.shift()

function peek(queue):
  if isEmpty(queue):
    return 'Queue is empty'
  return queue[front]`;

export default function QueueVisualizer() {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('');
  const [activeTab, setActiveTab] = useState('single'); // single, double, circular, priority
  const [showLL, setShowLL] = useState(false);
  const [msg, setMsg] = useState('');
  const [highlightLines, setHighlightLines] = useState([]);
  
  const MAX_SIZE = 8;

  const handleEnqueue = (front = false) => {
    if (!inputValue) return;
    setHighlightLines([1, 2, 3, 4]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (queue.length >= MAX_SIZE) {
      setMsg('Queue is Full!');
      return;
    }
    
    let newItem = { id: Date.now(), val: inputValue, priority: Number(priorityValue) || 0 };
    let newQueue = [...queue];

    if (activeTab === 'priority') {
      let inserted = false;
      for (let i = 0; i < newQueue.length; i++) {
        if (newItem.priority < newQueue[i].priority) { // lower number = higher priority
          newQueue.splice(i, 0, newItem);
          inserted = true;
          break;
        }
      }
      if (!inserted) newQueue.push(newItem);
    } else if (front && activeTab === 'double') {
      newQueue.unshift(newItem);
    } else {
      newQueue.push(newItem);
    }

    setQueue(newQueue);
    setInputValue('');
    setPriorityValue('');
    setMsg(`Enqueued ${inputValue}`);
  };

  const handleDequeue = (rear = false) => {
    setHighlightLines([6, 7, 8, 9]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (queue.length === 0) {
      setMsg('Queue is Empty!');
      return;
    }
    let newQueue = [...queue];
    let val;
    if (rear && activeTab === 'double') {
      val = newQueue.pop().val;
    } else {
      val = newQueue.shift().val;
    }
    setQueue(newQueue);
    setMsg(`Dequeued ${val}`);
  };

  const handlePeek = () => {
    setHighlightLines([11, 12, 13, 14]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (queue.length === 0) {
      setMsg('Queue is Empty!');
    } else {
      setMsg(`Front is ${queue[0].val}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>
          {['single', 'double', 'circular', 'priority'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setQueue([]); setMsg(''); }}
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
              {tab === 'single' ? 'Single-ended' : tab === 'double' ? 'Deque' : tab}
            </button>
          ))}
        </div>
  
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} />
          {activeTab === 'priority' && (
            <input type="number" value={priorityValue} onChange={e => setPriorityValue(e.target.value)} placeholder="Priority" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '100px' }} />
          )}
          
          {activeTab === 'double' && <button onClick={() => handleEnqueue(true)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Enqueue Front</button>}
          <button onClick={() => handleEnqueue(false)} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Enqueue {activeTab === 'double' && 'Rear'}</button>
          <button onClick={() => handleDequeue(false)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Dequeue {activeTab === 'double' && 'Front'}</button>
          {activeTab === 'double' && <button onClick={() => handleDequeue(true)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Dequeue Rear</button>}
          
          <button onClick={handlePeek} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Peek</button>
          <button onClick={() => setQueue([])} style={{ padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
          <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 8px' }} />
          <button onClick={() => setShowLL(!showLL)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Toggle Implementation</button>
        </div>
        
        <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Queue ({queue.length}/{MAX_SIZE})</h3>
              <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>{msg}</span>
            </div>
  
            {activeTab === 'circular' ? (
               <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '4px dashed var(--border-primary)', position: 'absolute' }} />
                 {Array.from({length: MAX_SIZE}).map((_, i) => {
                   const angle = (i * 360 / MAX_SIZE) * (Math.PI / 180);
                   const r = 100;
                   const x = Math.sin(angle) * r;
                   const y = -Math.cos(angle) * r;
                   const item = queue[i];
                   return (
                     <div key={i} style={{
                       position: 'absolute',
                       transform: `translate(${x}px, ${y}px)`,
                       width: '50px', height: '50px',
                       background: item ? 'var(--accent)' : 'var(--bg-primary)',
                       color: item ? '#000' : 'var(--text-muted)',
                       borderRadius: '50%',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontWeight: 'bold', border: '1px solid var(--border-primary)'
                     }}>
                       {item ? item.val : '-'}
                     </div>
                   );
                 })}
               </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderTop: '4px solid var(--border-primary)', borderBottom: '4px solid var(--border-primary)', padding: '16px', overflowX: 'auto', gap: '8px', minHeight: '120px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Front ➔</div>
                {queue.map((item, idx) => (
                  <div key={item.id} style={{
                    minWidth: '80px', padding: '16px', textAlign: 'center',
                    background: idx === 0 ? 'var(--warning)' : 'var(--bg-primary)',
                    color: idx === 0 ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--border-primary)', borderRadius: '4px',
                    fontWeight: 'bold', transition: 'all 0.3s', display: 'flex', flexDirection: 'column'
                  }}>
                    <span>{item.val}</span>
                    {activeTab === 'priority' && <span style={{ fontSize: '10px', marginTop: '4px' }}>Pri: {item.priority}</span>}
                  </div>
                ))}
                {queue.length === 0 && <div style={{ color: 'var(--text-muted)' }}>Empty</div>}
                <div style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>➔ Rear</div>
              </div>
            )}
          </div>
  
          <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Implementation: {showLL ? 'Linked List' : 'Array'}</h3>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {showLL ? `class Node {
    value: any
    next: Node
  }
  
  class Queue {
    front: Node = null
    rear: Node = null
  
    enqueue(value) {
      let node = new Node(value)
      if (!rear) {
        front = rear = node
        return
      }
      rear.next = node
      rear = node
    }
  
    dequeue() {
      if (!front) return null
      let val = front.value
      front = front.next
      if (!front) rear = null
      return val
    }
  }` : `class Queue {
    arr: Array = []
    front: int = 0
    rear: int = 0
  
    enqueue(value) {
      if (isFull()) return
      arr[rear] = value
      rear++
    }
  
    dequeue() {
      if (isEmpty()) return null
      let val = arr[front]
      front++
      return val
    }
  }`}
            </pre>
          </div>
        </div>
      </div>
      <CodeHighlightPanel playgroundTopic="queue-enqueue" code={CODE} highlightLines={highlightLines} title="Queue Operations" language="Pseudocode" />
    </div>
  );
}

