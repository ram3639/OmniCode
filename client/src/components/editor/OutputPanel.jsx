import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function OutputPanel() {
  const { output } = useEditorStore();

  if (!output) {
    return <div className="text-[var(--text-muted)] text-sm font-mono">No output generated.</div>;
  }

  return (
    <div className="font-mono text-sm whitespace-pre-wrap text-[var(--text-primary)]">
      {output}
    </div>
  );
}
