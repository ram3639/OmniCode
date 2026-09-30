import React, { useState } from 'react';
import TestResults from './TestResults';
import OutputPanel from './OutputPanel';
import AIHintsPanel from './AIHintsPanel';
import ASTTab from './ASTTab';

const ConsolePanel = () => {
  const [activeTab, setActiveTab] = useState('tests');

  const tabs = [
    { id: 'tests', label: 'Test Results' },
    { id: 'output', label: 'Output' },
    { id: 'ast', label: 'AST Visual' },
    { id: 'hints', label: 'AI Hints' }
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)]">
      <div className="flex bg-[var(--bg-elevated)] border-b border-[var(--glass-border)] px-2 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {activeTab === 'tests' && <TestResults />}
        {activeTab === 'output' && <OutputPanel />}
        {activeTab === 'ast' && <ASTTab />}
        {activeTab === 'hints' && <AIHintsPanel />}
      </div>
    </div>
  );
};

export default ConsolePanel;
