import { create } from 'zustand';
import { submitCode, getSubmissions } from '../services/executionService';
import { parseAST } from '../services/astService';
import { useAuthStore } from './authStore';

export const useEditorStore = create((set, get) => ({
  code: '',
  language: 'python',
  starterCodeCache: null,
  submissionsCache: [],
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
  
  setLanguage: (language) => {
    const { submissionsCache, starterCodeCache } = get();
    // Find the latest submission for the selected language
    const latestSub = submissionsCache.find(s => s.language === language);
    
    if (latestSub && latestSub.code) {
      set({ language, code: latestSub.code });
    } else if (starterCodeCache && starterCodeCache[language]) {
      set({ language, code: starterCodeCache[language] });
    } else {
      set({ language });
    }
  },

  loadWorkspace: async (challengeId, starterCode, initLanguage = 'python') => {
    set({ starterCodeCache: starterCode });
    try {
      const res = await getSubmissions(challengeId);
      const subs = res.data.submissions || [];
      set({ submissionsCache: subs });
      
      // If they have previous submissions, default to the language of their most recent submission
      const langToUse = subs.length > 0 ? subs[0].language : initLanguage;
      const latestSub = subs.find(s => s.language === langToUse);
      
      if (latestSub && latestSub.code) {
        set({ code: latestSub.code, language: langToUse });
      } else if (starterCode && starterCode[langToUse]) {
        set({ code: starterCode[langToUse], language: langToUse });
      } else {
        set({ language: langToUse });
      }
    } catch (err) {
      // Fallback if not logged in or error
      if (starterCode && starterCode[initLanguage]) {
        set({ code: starterCode[initLanguage], language: initLanguage });
      }
    }
  },

  runCode: async (challengeId) => {
    const { code, language, submissionsCache } = get();
    set({ isRunning: true, testResults: [], output: '', semanticScore: null, hints: [], status: null });
    try {
      const res = await submitCode({ challengeId, code, language });
      const sub = res.data.submission;
      
      if (sub.status === 'Accepted') {
        useAuthStore.getState().addSolvedChallenge(challengeId);
      }

      // Update our cache with the new submission so switching away and back preserves it
      const newSubs = [sub, ...submissionsCache.filter(s => s._id !== sub._id)];

      set({
        submissionsCache: newSubs,
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
    hints: [], runtime: null, memory: null, status: null, passedTests: 0, totalTests: 0,
    submissionsCache: [], starterCodeCache: null
  })
}));
