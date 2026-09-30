import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const OutputPanel = () => {
  const { output, isRunning } = useEditorStore();

  if (isRunning) return <div className="text-[var(--text-muted)] animate-pulse">Running...</div>;
  if (!output) return <div className="text-[var(--text-muted)]">No output yet.</div>;

  return (
    <pre className="font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap">
      {output}
    </pre>
  );
};

export default OutputPanel;
