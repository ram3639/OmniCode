import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { CheckCircle, XCircle } from 'lucide-react';

const TestResults = () => {
  const { testResults, isRunning } = useEditorStore();

  if (isRunning) return <div className="text-[var(--text-muted)] animate-pulse">Running test cases...</div>;
  if (!testResults || testResults.length === 0) return <div className="text-[var(--text-muted)]">Run code to see test results.</div>;

  const passedCount = testResults.filter(t => t.passed).length;
  const allPassed = passedCount === testResults.length;

  return (
    <div className="space-y-4">
      <div className={`text-lg font-semibold ${allPassed ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
        {passedCount}/{testResults.length} Test Cases Passed
      </div>
      <div className="space-y-3">
        {testResults.map((t, idx) => (
          <div key={idx} className="bg-[var(--bg-elevated)] border border-[var(--glass-border)] rounded-[var(--radius-md)] overflow-hidden">
            <div className={`px-4 py-2 flex items-center gap-2 border-b border-[var(--glass-border)] ${t.passed ? 'bg-green-900/10' : 'bg-red-900/10'}`}>
              {t.passed ? <CheckCircle size={16} className="text-[var(--accent-success)]"/> : <XCircle size={16} className="text-[var(--accent-danger)]"/>}
              <span className="font-medium text-[var(--text-primary)]">Test Case {idx + 1}</span>
            </div>
            <div className="p-4 space-y-3 text-sm font-mono">
              <div>
                <div className="text-[var(--text-secondary)] mb-1">Input:</div>
                <div className="bg-[var(--bg-surface)] px-3 py-2 rounded border border-[var(--glass-border)] text-white">{t.input}</div>
              </div>
              <div>
                <div className="text-[var(--text-secondary)] mb-1">Expected Output:</div>
                <div className="bg-[var(--bg-surface)] px-3 py-2 rounded border border-[var(--glass-border)] text-white">{t.expected}</div>
              </div>
              <div>
                <div className="text-[var(--text-secondary)] mb-1">Actual Output:</div>
                <div className={`bg-[var(--bg-surface)] px-3 py-2 rounded border border-[var(--glass-border)] ${t.passed ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                  {t.actual || 'No output'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
