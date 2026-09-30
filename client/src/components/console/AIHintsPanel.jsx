import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Lightbulb } from 'lucide-react';

const AIHintsPanel = () => {
  const { semanticScore, hints } = useEditorStore();

  if (!semanticScore && (!hints || hints.length === 0)) {
    return <div className="text-[var(--text-muted)] h-full flex items-center justify-center">Submit code to receive semantic analysis and hints.</div>;
  }

  const scoreColor = semanticScore >= 85 ? 'text-[var(--accent-success)]' : semanticScore >= 70 ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-danger)]';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-md)] border border-[var(--glass-border)]">
        <div className={`text-4xl font-bold ${scoreColor}`}>
          {semanticScore}%
        </div>
        <div>
          <div className="text-white font-medium">Semantic Quality Score</div>
          <div className="text-[var(--text-secondary)] text-sm">Based on logic, complexity, and best practices.</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-medium flex items-center gap-2"><Lightbulb size={18} className="text-[var(--accent-warning)]"/> AI Optimization Hints</h3>
        {hints.map((hint, i) => (
          <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)] text-[var(--text-primary)] text-sm">
            {hint}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIHintsPanel;
