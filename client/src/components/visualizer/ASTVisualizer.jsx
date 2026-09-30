import React, { useState } from 'react';
import CodeEditor from '../editor/CodeEditor';
import ASTFlowChart from './ASTFlowChart';
import { Network, Play } from 'lucide-react';
import { parseAST } from '../../services/astService';

const HELLO_WORLD = {
  python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(result)
`,
  cpp: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}
`,
  java: `public class Main {
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}
`,
  c: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("%d\\n", fibonacci(10));
    return 0;
}
`
};

export default function ASTVisualizer() {
  const [code, setCode] = useState(HELLO_WORLD.python);
  const [language, setLanguage] = useState('python');
  const [astData, setAstData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const languages = ['python', 'cpp', 'c', 'java'];

  const handleVisualize = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    try {
      const res = await parseAST(code, language);
      setAstData(res.data);
    } catch (err) {
      console.error('AST parse error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLangChange = (newLang) => {
    setLanguage(newLang);
    setCode(HELLO_WORLD[newLang] || '');
    setAstData(null);
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-primary)' }}>
        <div style={{ height: '42px', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>
            <Network size={16} />
            AST Visualizer
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select value={language} onChange={(e) => handleLangChange(e.target.value)}
              style={{ padding: '4px 8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <button onClick={handleVisualize} disabled={isRunning || !code.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: (isRunning || !code.trim()) ? 'not-allowed' : 'pointer', opacity: (isRunning || !code.trim()) ? 0.5 : 1 }}>
              <Play size={12} />
              Visualize
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <CodeEditor code={code} onChange={setCode} language={language} />
        </div>
      </div>

      <div style={{ width: '50%', position: 'relative', backgroundColor: 'var(--bg-primary)' }}>
        {astData ? (
          <ASTFlowChart astData={astData} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Network size={40} style={{ marginBottom: '12px', color: 'var(--text-muted)', opacity: 0.4 }} />
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>No AST to display</p>
            <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Write code and click Visualize</p>
          </div>
        )}
      </div>
    </div>
  );
}
