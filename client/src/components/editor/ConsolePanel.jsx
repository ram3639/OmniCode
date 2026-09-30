import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import TestResults from './TestResults';
import OutputPanel from './OutputPanel';
import AIHintsPanel from './AIHintsPanel';

export default function ConsolePanel() {
  const [activeTab, setActiveTab] = useState('testResults');
  const { testResults, output, hints, isRunning } = useEditorStore();

  const tabs = [
    { id: 'testResults', label: 'Test Results' },
    { id: 'output', label: 'Output' },
    { id: 'hints', label: 'AI Hints' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', padding: '0 8px', backgroundColor: 'var(--bg-secondary)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', fontSize: '12px', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'color 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', backgroundColor: 'var(--bg-primary)' }}>
        {isRunning ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: '10px' }} />
            Running code...
          </div>
        ) : (
          <>
            {activeTab === 'testResults' && <TestResults />}
            {activeTab === 'output' && <OutputPanel />}
            {activeTab === 'hints' && <AIHintsPanel />}
          </>
        )}
      </div>
    </div>
  );
}
