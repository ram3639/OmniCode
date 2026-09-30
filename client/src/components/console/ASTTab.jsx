import React, { useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import ASTFlowChart from '../ast/ASTFlowChart';

const ASTTab = () => {
  const { astData, fetchAST, code } = useEditorStore();

  useEffect(() => {
    fetchAST();
  }, [code, fetchAST]);

  if (!astData) return <div className="text-[var(--text-muted)] flex h-full items-center justify-center">Parsing AST...</div>;

  return (
    <div className="h-full w-full">
      <ASTFlowChart data={astData} />
    </div>
  );
};

export default ASTTab;
