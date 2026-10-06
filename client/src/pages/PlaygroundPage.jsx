import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Pause, RotateCcw, Lightbulb, Code2, AlertCircle, CheckCircle2, SkipForward, ChevronRight, Eye, EyeOff, Gauge, Terminal, X } from 'lucide-react';
import { CATEGORIES, LANGS, getTemplatesByCategory, getTemplateById } from '../components/playground/templates';
import api from '../services/api';

const LANG_LABELS = { javascript: 'JavaScript', python: 'Python', java: 'Java', cpp: 'C++' };

export default function PlaygroundPage() {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic');

  const initTemplate = useMemo(() => {
    if (initialTopic) { const t = getTemplateById(initialTopic); if (t) return t; }
    return getTemplatesByCategory(CATEGORIES[0])[0];
  }, [initialTopic]);

  const [selectedCategory, setSelectedCategory] = useState(initTemplate.category);
  const [selectedTemplate, setSelectedTemplate] = useState(initTemplate);
  const [language, setLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState(initTemplate.starters.javascript);
  const [showSolution, setShowSolution] = useState(false);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(400);

  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const timerRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicking inside the output panel, do nothing
      if (outputRef.current && outputRef.current.contains(e.target)) return;
      // If clicking on a button that opens the output (like Run or AI Hint), let it handle itself
      if (e.target.closest('button')) return; 
      
      setShowOutput(false);
    };

    if (showOutput) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOutput]);

  // URL param
  useEffect(() => {
    if (initialTopic) {
      const t = getTemplateById(initialTopic);
      if (t) { setSelectedCategory(t.category); setSelectedTemplate(t); setUserCode(t.starters[language]); resetState(); }
    }
  }, [initialTopic]);

  const resetState = () => {
    setSteps([]); setCurrentStep(0); setIsRunning(false); setError(''); setSuccess(''); setFeedback(''); setShowSolution(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTemplateChange = (t) => {
    setSelectedTemplate(t); setUserCode(t.starters[language]); resetState();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat); const ts = getTemplatesByCategory(cat); handleTemplateChange(ts[0]);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (showSolution) { setUserCode(selectedTemplate.solutions[lang]); }
    else { setUserCode(selectedTemplate.starters[lang]); }
    resetState(); // CRITICAL: clear old steps when switching languages
  };

  const toggleSolution = () => {
    if (showSolution) { setUserCode(selectedTemplate.starters[language]); setShowSolution(false); }
    else { setUserCode(selectedTemplate.solutions[language]); setShowSolution(true); }
  };

  // Animation
  useEffect(() => {
    if (isRunning && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) { setIsRunning(false); clearInterval(timerRef.current); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, steps.length, speed]);

  // Run
  const runCode = useCallback(async () => {
    resetState();
    
    // Check user actually wrote code (not just starter)
    if (userCode.trim() === selectedTemplate.starters[language].trim()) {
      setError('Please write your implementation first. The starter code is empty.');
      setShowOutput(true);
      return;
    }
    
    if (language === 'javascript') {
      // Client-side JS execution
      try {
        const result = selectedTemplate.run(userCode, selectedTemplate.testData);
        if (!result || result.length === 0) {
          setError('No steps generated. Check your implementation.');
          setShowOutput(true);
          return;
        }
        setSteps(result);
        setCurrentStep(0);
        setIsRunning(true);
        setSuccess(`${result.length} steps generated.`);
      } catch (err) {
        setError(err.message || 'Execution error. Check syntax.');
        setShowOutput(true);
      }
    } else {
      // For non-JS: Validate via AI, then visualize using JS solution
      setFeedback('Validating your code...');
      setFeedbackLoading(true);
      try {
        const res = await api.post('/playground/validate', {
          code: userCode,
          topic: selectedTemplate.category,
          functionName: selectedTemplate.label,
          language,
          solution: selectedTemplate.solutions[language],
          mode: 'validate' // tell backend to check correctness
        });
        const fb = res.data.feedback || '';
        setFeedbackLoading(false);
        
        // Check if AI says it's correct
        const isCorrect = fb.toLowerCase().includes('correct') && 
                          !fb.toLowerCase().includes('incorrect') && 
                          !fb.toLowerCase().includes('not correct');
        
        if (isCorrect) {
          // Code validated! Generate vis from JS solution
          try {
            const result = selectedTemplate.run(
              selectedTemplate.solutions.javascript,
              selectedTemplate.testData
            );
            if (result && result.length > 0) {
              setSteps(result);
              setCurrentStep(0);
              setIsRunning(true);
              setSuccess(`✓ Code validated. ${result.length} visualization steps.`);
              setFeedback('');
            }
          } catch (e) {
            setError('Visualization error: ' + e.message);
            setShowOutput(true);
          }
        } else {
          // Code has issues - show feedback
          setFeedback(fb);
          setError('Code validation failed. See feedback below.');
          setShowOutput(true);
        }
      } catch (err) {
        setFeedbackLoading(false);
        setFeedback('Could not validate. Make sure backend and Ollama are running.');
        setShowOutput(true);
      }
    }
  }, [selectedTemplate, userCode, language]);

  const getHintDirect = async () => {
    setFeedbackLoading(true); setFeedback('');
    try {
      const res = await api.post('/playground/validate', { code: userCode, topic: selectedTemplate.category, error: error || undefined, functionName: selectedTemplate.label, language });
      setFeedback(res.data.feedback);
    } catch { setFeedback('Could not reach AI. Make sure backend and Ollama are running.'); }
    finally { setFeedbackLoading(false); }
  };

  const getHint = async () => { setShowOutput(true); setFeedbackLoading(true); setFeedback(''); await getHintDirect(); };

  const stepForward = () => { if (currentStep < steps.length - 1) { setIsRunning(false); if (timerRef.current) clearInterval(timerRef.current); setCurrentStep(p => p + 1); } };

  // ─── Visualizer ───
  const renderVisualizer = () => {
    if (steps.length === 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '12px' }}>
        <Code2 size={40} style={{ opacity: 0.3 }} />
        <p style={{ fontSize: '13px', margin: 0 }}>Write your code and click <b>Run</b></p>
      </div>
    );

    const step = steps[Math.min(currentStep, steps.length - 1)];
    const cat = selectedTemplate.category;

    if (cat === 'Sorting') {
      const arr = step.state || []; const maxVal = Math.max(...arr, 1);
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', height: '100%', padding: '20px 16px' }}>
          {arr.map((val, idx) => {
            let c = '#444';
            if ((step.comparing||[]).includes(idx)) c = '#eab308';
            if ((step.swapping||[]).includes(idx)) c = 'var(--accent)';
            if (step.action === 'done') c = '#4CAF50';
            return (<div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '40px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>{val}</span>
              <div style={{ width: '100%', height: `${(val / maxVal) * 200}px`, minHeight: '8px', backgroundColor: c, borderRadius: '3px 3px 0 0', transition: 'all 0.15s' }} />
            </div>);
          })}
        </div>
      );
    }

    if (cat === 'Searching') {
      const arr = step.state || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {arr.map((val, idx) => {
              let bg = 'var(--bg-secondary)', bc = 'var(--border-primary)', tc = 'var(--text-primary)';
              if (step.checking === idx && step.found) { bg = '#4CAF50'; bc = '#4CAF50'; tc = '#000'; }
              else if (step.checking === idx) { bg = 'var(--accent)'; bc = 'var(--accent)'; tc = '#000'; }
              if (step.action === 'done' && step.resultIndex === idx && step.found) { bg = '#4CAF50'; bc = '#4CAF50'; tc = '#000'; }
              return <div key={idx} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bg, border: `2px solid ${bc}`, borderRadius: '6px', fontWeight: 600, fontSize: '14px', color: tc, transition: 'all 0.15s' }}>{val}</div>;
            })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Target: <b style={{ color: 'var(--accent)' }}>{step.target}</b>
            {step.action === 'done' && (step.found ? <span style={{ color: '#4CAF50', marginLeft: '12px' }}>Found at index {step.resultIndex}!</span> : <span style={{ color: '#ef4444', marginLeft: '12px' }}>Not Found</span>)}
          </div>
        </div>
      );
    }

    if (cat === 'Stack') {
      const arr = step.state || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '4px' }}>
          {step.lastOp && <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>{step.lastOp}</div>}
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '3px' }}>
            {arr.map((val, idx) => <div key={idx} style={{ width: '90px', padding: '10px', textAlign: 'center', borderRadius: '5px', backgroundColor: idx === arr.length-1 ? 'var(--accent)' : 'var(--bg-secondary)', border: `1px solid ${idx === arr.length-1 ? 'var(--accent)' : 'var(--border-primary)'}`, color: idx === arr.length-1 ? '#000' : 'var(--text-primary)', fontWeight: 700, transition: 'all 0.2s' }}>{val}</div>)}
          </div>
          {arr.length > 0 && <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--text-muted)', borderRadius: '2px', marginTop: '4px' }} />}
          {arr.length === 0 && <div style={{ color: 'var(--text-muted)' }}>Empty Stack</div>}
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>TOP ↑</div>
        </div>
      );
    }

    if (cat === 'Queue') {
      const arr = step.state || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
          {step.lastOp && <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>{step.lastOp}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Front</span>
            <div style={{ display: 'flex', gap: '3px', padding: '8px', border: '2px solid var(--border-primary)', borderRadius: '6px', minWidth: '100px', minHeight: '50px', alignItems: 'center' }}>
              {arr.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 auto' }}>Empty</span>}
              {arr.map((val, idx) => <div key={idx} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: step.highlight === idx ? 'var(--accent)' : 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontWeight: 700, color: step.highlight === idx ? '#000' : 'var(--text-primary)' }}>{val}</div>)}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rear</span>
          </div>
        </div>
      );
    }

    if (cat === 'Linked List') {
      const arr = step.state || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', padding: '20px' }}>
          {step.lastOp && <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>{step.lastOp}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {arr.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Empty List (null)</span>}
            {arr.map((val, idx) => (
              <React.Fragment key={idx}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: idx === step.highlight ? 'var(--accent)' : 'var(--bg-secondary)', border: '2px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === step.highlight ? '#000' : 'var(--text-primary)', fontWeight: 700 }}>{val}</div>
                {idx < arr.length - 1 && <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
              </React.Fragment>
            ))}
            {arr.length > 0 && <><ChevronRight size={16} style={{ color: 'var(--text-muted)' }} /><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>null</span></>}
          </div>
        </div>
      );
    }

    if (cat === 'Trees') {
      const tree = step.tree;
      if (!tree) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Empty Tree</div>;
      const nodes = [], edges = [];
      const layout = (node, x, y, spread, parent) => {
        if (!node) return;
        nodes.push({ val: node.val, x, y, isNew: node.val === step.newVal });
        if (parent) edges.push({ x1: parent.x, y1: parent.y, x2: x, y2: y });
        layout(node.left, x - spread, y + 60, spread * 0.55, { x, y });
        layout(node.right, x + spread, y + 60, spread * 0.55, { x, y });
      };
      layout(tree, 250, 30, 100, null);
      return (
        <div style={{ height: '100%', overflow: 'auto', padding: '10px' }}>
          {step.lastOp && <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>{step.lastOp}</div>}
          <svg width="500" height="300" viewBox="0 0 500 300" style={{ display: 'block', margin: '0 auto' }}>
            {edges.map((e, i) => <line key={i} x1={e.x1} y1={e.y1+16} x2={e.x2} y2={e.y2-16} stroke="var(--border-primary)" strokeWidth="2" />)}
            {nodes.map((n, i) => (<g key={i}><circle cx={n.x} cy={n.y} r="16" fill={n.isNew ? 'var(--accent)' : 'var(--bg-secondary)'} stroke="var(--border-primary)" strokeWidth="2" /><text x={n.x} y={n.y+4} textAnchor="middle" fill={n.isNew ? '#000' : 'var(--text-primary)'} fontSize="12" fontWeight="600">{n.val}</text></g>))}
          </svg>
          {step.values && step.values.length > 0 && <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Output: [{step.values.join(', ')}]</div>}
        </div>
      );
    }

    if (cat === 'Graphs') {
      const allNodes = Object.keys(selectedTemplate.testData.graph);
      const visitedSet = new Set(step.visited || []);
      const count = allNodes.length;
      const cx = 200, cy = 130, r = 90;
      const pos = {};
      allNodes.forEach((n, i) => { const a = (2*Math.PI*i)/count - Math.PI/2; pos[n] = { x: cx+r*Math.cos(a), y: cy+r*Math.sin(a) }; });
      const drawn = new Set(), edgeLines = [];
      for (const [n, nbs] of Object.entries(selectedTemplate.testData.graph)) for (const nb of nbs) { const k = [n,nb].sort().join('-'); if (!drawn.has(k)) { drawn.add(k); edgeLines.push({ from: pos[n], to: pos[nb] }); } }
      return (
        <div style={{ height: '100%', overflow: 'auto', padding: '10px' }}>
          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Visit: [{(step.visited||[]).join(' → ')}]</div>
          <svg width="400" height="280" viewBox="0 0 400 280" style={{ display: 'block', margin: '0 auto' }}>
            {edgeLines.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#444" strokeWidth="2" />)}
            {allNodes.map(n => {
              const p = pos[n]; let f = '#333';
              if (step.current === n) f = 'var(--accent)';
              else if (visitedSet.has(n)) f = '#4CAF50';
              return (<g key={n}><circle cx={p.x} cy={p.y} r="20" fill={f} stroke={visitedSet.has(n)?'#4CAF50':'#666'} strokeWidth="2" /><text x={p.x} y={p.y+4} textAnchor="middle" fill={f==='#333'?'#aaa':'#000'} fontSize="14" fontWeight="700">{n}</text></g>);
            })}
          </svg>
        </div>
      );
    }

    return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No visualizer for this topic.</div>;
  };

  const lineCount = userCode.split('\n').length;
  const lineNums = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', backgroundColor: 'transparent', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Unified Toolbar */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', flexShrink: 0 }}>
        
        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Topic:</span>
          <select 
            value={selectedCategory} 
            onChange={e => handleCategoryChange(e.target.value)} 
            style={{ 
              padding: '8px 36px 8px 14px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', 
              borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontSize: '13px',
              appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cdcecf%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto'
            }}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Template Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Algorithm:</span>
          <select 
            value={selectedTemplate.id} 
            onChange={e => handleTemplateChange(getTemplatesByCategory(selectedCategory).find(t => t.id === e.target.value))} 
            style={{ 
              padding: '8px 36px 8px 14px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', 
              borderRadius: '8px', color: 'var(--accent)', outline: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235227FF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto'
            }}>
            {getTemplatesByCategory(selectedCategory).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* Language Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Language:</span>
          <select 
            value={language} 
            onChange={e => handleLanguageChange(e.target.value)} 
            style={{ 
              padding: '8px 36px 8px 14px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', 
              borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontSize: '13px',
              appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cdcecf%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto'
            }}>
            {LANGS.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        {/* Unified Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setSpeed(s => s === 150 ? 400 : s === 400 ? 800 : 150)} style={{ padding: '8px 14px', background: 'none', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={14} /> Speed: {speed <= 150 ? 'Fast' : speed <= 400 ? 'Normal' : 'Slow'}
          </button>
          <button onClick={() => { setUserCode(selectedTemplate.starters[language]); resetState(); }} style={{ padding: '8px 14px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={getHint} disabled={feedbackLoading} style={{ padding: '8px 14px', backgroundColor: 'rgba(196,149,106,0.08)', color: 'var(--accent)', border: '1px solid rgba(196,149,106,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', opacity: feedbackLoading ? 0.6 : 1 }}>
            <Lightbulb size={14} /> {feedbackLoading ? 'Thinking...' : 'AI Hint'}
          </button>
          <button onClick={runCode} disabled={feedbackLoading} style={{ padding: '8px 18px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: feedbackLoading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', opacity: feedbackLoading ? 0.7 : 1 }}>
            <Play size={14} /> {feedbackLoading && language !== 'javascript' ? 'Validating...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor */}
        <div style={{ flex: 1, borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Task Description */}
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'rgba(196,149,106,0.04)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTemplate.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>{LANG_LABELS[language]}</span>
              </div>
              <button onClick={toggleSolution} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(196,149,106,0.3)', background: showSolution ? 'rgba(196,149,106,0.15)' : 'transparent', color: 'var(--accent)', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                {showSolution ? <><EyeOff size={12} /> Hide Solution</> : <><Eye size={12} /> Show Solution</>}
              </button>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--accent)' }}>{selectedTemplate.description}</p>
            <p style={{ margin: '3px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{selectedTemplate.instructions}</p>
          </div>

          {/* Code Editor */}
          <div style={{ flex: 1, display: 'flex', backgroundColor: '#0d0d0d', overflow: 'hidden' }}>
            <div style={{ padding: '10px 6px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a', color: '#444', fontFamily: "'Consolas','Monaco',monospace", fontSize: '13px', textAlign: 'right', userSelect: 'none', overflowY: 'hidden', lineHeight: '20px', minWidth: '36px' }}>
              {lineNums.map(l => <div key={l}>{l}</div>)}
            </div>
            <textarea value={userCode} onChange={e => { setUserCode(e.target.value); if (showSolution) setShowSolution(false); }} spellCheck="false"
              style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: '#d4d4d4', fontFamily: "'Consolas','Monaco',monospace", fontSize: '13px', lineHeight: '20px', resize: 'none', outline: 'none', whiteSpace: 'pre', overflowX: 'auto', overflowY: 'auto', tabSize: 2 }}
              onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); const s = e.target.selectionStart; setUserCode(userCode.substring(0,s)+'  '+userCode.substring(e.target.selectionEnd)); setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s+2; }, 0); } }}
            />
          </div>
        </div>

        {/* Visualizer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>{renderVisualizer()}</div>

          {steps.length > 0 && (
            <div style={{ position: 'relative', padding: '7px 16px', borderTop: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexShrink: 0 }}>
              <button onClick={() => { setCurrentStep(0); setIsRunning(false); if (timerRef.current) clearInterval(timerRef.current); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}><RotateCcw size={15} /></button>
              <button onClick={() => setIsRunning(!isRunning)} style={{ background: 'var(--accent)', border: 'none', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {isRunning ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={stepForward} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}><SkipForward size={15} /></button>
              
              <div style={{ position: 'absolute', right: '16px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Step {currentStep+1} / {steps.length}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Full-Width Collapsible Output Panel */}
      <div 
        ref={outputRef}
        style={{ 
          height: showOutput ? '180px' : '0px', 
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
          overflowY: 'auto', 
          backgroundColor: 'var(--bg-primary)',
          borderTop: showOutput ? '1px solid var(--border-primary)' : 'none',
          flexShrink: 0
        }}
      >
        <div style={{ padding: '16px', lineHeight: 1.5 }}>
          <button onClick={() => setShowOutput(false)} style={{ position: 'absolute', top: '12px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
          {error && <div style={{ color: '#ef4444', fontSize: '12.5px', display: 'flex', gap: '8px', alignItems: 'flex-start', paddingRight: '24px' }}><AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /><span style={{ whiteSpace: 'pre-wrap' }}>{error}</span></div>}
          {success && !error && !feedback && <div style={{ color: '#4CAF50', fontSize: '12.5px', display: 'flex', gap: '8px', alignItems: 'center', paddingRight: '24px' }}><CheckCircle2 size={16} /> {success}</div>}
          {feedback && <div style={{ color: 'var(--text-primary)', fontSize: '12.5px', display: 'flex', gap: '8px', alignItems: 'flex-start', paddingRight: '24px' }}><Lightbulb size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} /><span style={{ whiteSpace: 'pre-wrap' }}>{feedback}</span></div>}
          {!error && !success && !feedback && <div style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>Output and AI feedback will appear here.</div>}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div style={{ 
        height: showOutput ? '0px' : '32px', 
        opacity: showOutput ? 0 : 1,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-primary)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: showOutput ? '0 16px' : '0 16px', 
        flexShrink: 0 
      }}>
        <button 
          onClick={() => setShowOutput(true)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px' }}
        >
          <Terminal size={13} /> Show Output
        </button>
      </div>

    </div>
  );
}
