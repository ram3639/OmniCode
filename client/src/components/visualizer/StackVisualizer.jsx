import React, { useState, useRef, useEffect } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `class Stack {
  push(val) {
    if (this.isFull()) return;
    this.stack.push(val);
  }
  pop() {
    if (this.isEmpty()) return null;
    return this.stack.pop();
  }
  peek() {
    if (this.isEmpty()) return null;
    return this.stack[this.stack.length - 1];
  }
}`;

export default function StackVisualizer() {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [exprValue, setExprValue] = useState('');
  const [activeIndices, setActiveIndices] = useState([]);
  const [showLL, setShowLL] = useState(false);
  const [msg, setMsg] = useState('');
  const [highlightLines, setHighlightLines] = useState([]);
  const MAX_SIZE = 10;

  const handlePush = () => {
    if (!inputValue) return;
    setHighlightLines([1, 2, 3]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (stack.length >= MAX_SIZE) {
      setMsg('Stack is Full!');
      return;
    }
    setStack([...stack, inputValue]);
    setInputValue('');
    setMsg(`Pushed ${inputValue}`);
  };

  const handlePop = () => {
    setHighlightLines([5, 6, 7]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (stack.length === 0) {
      setMsg('Stack is Empty!');
      return;
    }
    const val = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMsg(`Popped ${val}`);
  };

  const handlePeek = () => {
    setHighlightLines([9, 10, 11]);
    setTimeout(() => setHighlightLines([]), 1000);
    if (stack.length === 0) {
      setMsg('Stack is Empty!');
      return;
    }
    setActiveIndices([stack.length - 1]);
    setMsg(`Top is ${stack[stack.length - 1]}`);
    setTimeout(() => setActiveIndices([]), 1000);
  };

  const evaluatePostfix = async () => {
    if (!exprValue) return;
    setStack([]);
    setMsg('Evaluating Postfix...');
    const tokens = exprValue.trim().split(/\s+/);
    let currentStack = [];

    for (let token of tokens) {
      if (!isNaN(token)) {
        currentStack.push(token);
        setStack([...currentStack]);
        setMsg(`Pushed ${token}`);
      } else {
        if (currentStack.length < 2) {
          setMsg('Invalid Expression');
          return;
        }
        const b = Number(currentStack.pop());
        const a = Number(currentStack.pop());
        let res = 0;
        if (token === '+') res = a + b;
        else if (token === '-') res = a - b;
        else if (token === '*') res = a * b;
        else if (token === '/') res = Math.floor(a / b);
        currentStack.push(res.toString());
        setStack([...currentStack]);
        setMsg(`Evaluated ${a} ${token} ${b} = ${res}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    setMsg(`Result: ${currentStack[0]}`);
  };

  const evaluatePrefix = async () => {
    if (!exprValue) return;
    setStack([]);
    setMsg('Evaluating Prefix...');
    const tokens = exprValue.trim().split(/\s+/).reverse();
    let currentStack = [];

    for (let token of tokens) {
      if (!isNaN(token)) {
        currentStack.push(token);
        setStack([...currentStack]);
        setMsg(`Pushed ${token}`);
      } else {
        if (currentStack.length < 2) {
          setMsg('Invalid Expression');
          return;
        }
        const a = Number(currentStack.pop());
        const b = Number(currentStack.pop());
        let res = 0;
        if (token === '+') res = a + b;
        else if (token === '-') res = a - b;
        else if (token === '*') res = a * b;
        else if (token === '/') res = Math.floor(a / b);
        currentStack.push(res.toString());
        setStack([...currentStack]);
        setMsg(`Evaluated ${a} ${token} ${b} = ${res}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    setMsg(`Result: ${currentStack[0]}`);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '80px' }} />
          <button onClick={handlePush} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Push</button>
          <button onClick={handlePop} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Pop</button>
          <button onClick={handlePeek} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Peek</button>
          <button onClick={() => setStack([])} style={{ padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
          <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 8px' }} />
          <input type="text" value={exprValue} onChange={e => setExprValue(e.target.value)} placeholder="e.g. 3 4 + 2 *" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '150px' }} />
          <button onClick={evaluatePostfix} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Eval Postfix</button>
          <button onClick={evaluatePrefix} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Eval Prefix</button>
          <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 8px' }} />
          <button onClick={() => setShowLL(!showLL)} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Toggle Implementation</button>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Stack</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stack.length} / {MAX_SIZE}</span>
            </div>
            <div style={{ color: 'var(--warning)', minHeight: '20px', fontSize: '14px' }}>{msg}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', justifyContent: 'flex-start', border: '4px solid var(--border-primary)', borderTop: 'none', padding: '16px', overflowY: 'auto', gap: '8px' }}>
              {stack.map((val, idx) => (
                <div key={idx} style={{
                  width: '100%', padding: '16px', textAlign: 'center',
                  background: activeIndices.includes(idx) ? 'var(--warning)' : idx === stack.length - 1 ? 'var(--accent)' : 'var(--bg-primary)',
                  color: (activeIndices.includes(idx) || idx === stack.length - 1) ? '#000' : 'var(--text-primary)',
                  border: '1px solid var(--border-primary)', borderRadius: '4px',
                  fontWeight: 'bold', transition: 'all 0.3s'
                }}>
                  {val}
                </div>
              ))}
              {stack.length === 0 && <div style={{ color: 'var(--text-muted)' }}>Empty</div>}
            </div>
          </div>
  
          <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Implementation: {showLL ? 'Linked List' : 'Array'}</h3>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {showLL ? `class Node {
    value: any
    next: Node
  }
  
  class Stack {
    top: Node = null
    size: int = 0
  
    push(value) {
      let newNode = new Node(value)
      newNode.next = top
      top = newNode
      size++
    }
  
    pop() {
      if (isEmpty()) return null
      let val = top.value
      top = top.next
      size--
      return val
    }
  }` : `class Stack {
    arr: Array = []
    top: int = -1
  
    push(value) {
      if (isFull()) return
      top++
      arr[top] = value
    }
  
    pop() {
      if (isEmpty()) return null
      let val = arr[top]
      top--
      return val
    }
  }`}
            </pre>
          </div>
        </div>
      </div>
      <CodeHighlightPanel playgroundTopic="stack-push" code={CODE} highlightLines={highlightLines} title="Stack Operations" language="Pseudocode" />
    </div>
  );
}
