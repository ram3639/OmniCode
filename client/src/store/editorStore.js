import { create } from 'zustand';
import { submitCode } from '../services/executionService';
import { parseAST } from '../services/astService';

export const useEditorStore = create((set, get) => ({
  code: '',
  language: 'python',
  isRunning: false,
  testResults: [],
  output: '',
  astData: null,
  semanticScore: null,
  hints: [],
  runtime: null,
  memory: null,
  status: null,
  passedTests: 0,
  totalTests: 0,

  setCode: (code) => set({ code }),
  
  setLanguage: (language) => set({ language }),

  loadStarterCode: (starterCode, language) => {
    if (starterCode && starterCode[language]) {
      set({ code: starterCode[language], language });
    }
  },

  runCode: async (challengeId) => {
    const { code, language } = get();
    set({ isRunning: true, testResults: [], output: '', semanticScore: null, hints: [], status: null });
    try {
      const res = await submitCode({ challengeId, code, language });
      const sub = res.data.submission;
      set({
        testResults: sub.testResults || [],
        output: sub.testResults?.map(t => t.actualOutput).join('\n') || '',
        semanticScore: sub.semanticScore || null,
        hints: sub.aiHints || [],
        runtime: sub.runtime || null,
        memory: sub.memory || null,
        status: sub.status,
        passedTests: sub.passedTests || 0,
        totalTests: sub.totalTests || 0,
        isRunning: false
      });
    } catch (error) {
      set({ output: error.response?.data?.error || error.message, isRunning: false, status: 'Error' });
    }
  },

  fetchAST: async () => {
    const { code, language } = get();
    if (!code.trim()) return;
    try {
      const res = await parseAST(code, language);
      set({ astData: res.data });
    } catch (error) {
      console.error('Failed to parse AST:', error);
    }
  },

  reset: () => set({
    testResults: [], output: '', astData: null, semanticScore: null,
    hints: [], runtime: null, memory: null, status: null, passedTests: 0, totalTests: 0
  })
}));
