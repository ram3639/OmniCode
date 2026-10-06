import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import { submitBatch, pollResults, mapLanguageId, parseResult } from '../services/judge0Service.js';
import { getSimilarityScore } from '../services/microserviceProxy.js';
import { getOptimizationHint } from '../services/geminiService.js';
import { updateProgress } from '../services/progressService.js';
import axios from 'axios';

/**
 * @route POST /api/submit
 * @desc Submit code for a challenge — runs against all test cases via Judge0
 * @access Private
 */
export const submitCode = async (req, res) => {
  try {
    const { challengeId, code, language } = req.body;
    const userId = req.user._id;

    if (!challengeId || !code || !language) {
      return res.status(400).json({ error: 'challengeId, code, and language are required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if Judge0 is reachable
    try {
      await axios.get(`${process.env.JUDGE0_API_URL || 'http://localhost:2358'}/about`, { timeout: 3000 });
    } catch {
      return res.status(503).json({ error: 'Code execution service (Judge0) is not running. Please start it with: docker-compose up -d' });
    }

    const allTestCases = [...challenge.publicTestCases, ...challenge.hiddenTestCases];
    
    if (!allTestCases.length) {
      return res.status(400).json({ error: 'This challenge has no test cases defined.' });
    }

    const langId = mapLanguageId(language);

    // Java fix: Judge0 expects /box/Main.java — ensure public class Main
    let processedCode = code;
    if (language === 'java') {
      // Replace 'public class XXX' → 'public class Main'
      if (/public\s+class\s+\w+/.test(processedCode)) {
        processedCode = processedCode.replace(/public\s+class\s+\w+/g, 'public class Main');
      }
      // If there's 'class XXX' without public, make it 'public class Main'
      else if (/^\s*class\s+\w+/m.test(processedCode)) {
        processedCode = processedCode.replace(/^\s*class\s+\w+/m, 'public class Main');
      }
      // If no class declaration at all, wrap the code
      else if (!/class\s+\w+/.test(processedCode)) {
        processedCode = `public class Main {\n${processedCode}\n}`;
      }
    }

    const isJava = langId === 62;
    const judge0Submissions = allTestCases.map(tc => ({
      language_id: langId,
      source_code: Buffer.from(processedCode).toString('base64'),
      stdin: Buffer.from((tc.input || '').trim() + '\n').toString('base64'),
      expected_output: Buffer.from((tc.expectedOutput || '').trim() + '\n').toString('base64'),
      memory_limit: isJava ? 8192000 : 512000,
      stack_limit: isJava ? 8192 : 65536,
      max_processes_and_or_threads: isJava ? 1024 : 120,
      enable_per_process_and_thread_memory_limit: true,
      enable_per_process_and_thread_time_limit: true
    }));

    const batchResponse = await submitBatch(judge0Submissions);
    
    if (!batchResponse || !Array.isArray(batchResponse) || batchResponse.length === 0) {
      return res.status(500).json({ error: 'Judge0 returned empty response. Ensure Judge0 is configured correctly.' });
    }

    const tokens = batchResponse.map(r => r.token);
    
    if (tokens.some(t => !t)) {
      return res.status(500).json({ error: 'Judge0 did not return valid tokens. Check Judge0 service.' });
    }

    const results = await pollResults(tokens);

    let allPassed = true;
    let totalRuntime = 0;
    let totalMemory = 0;
    let firstErrorStatus = null;
    
    const testResults = results.map((result, index) => {
      const parsed = parseResult(result);
      if (!parsed.passed) {
        allPassed = false;
        if (!firstErrorStatus) firstErrorStatus = parsed.status;
      }
      totalRuntime += parsed.runtime;
      totalMemory += parsed.memory;
      return {
        passed: parsed.passed,
        input: allTestCases[index].input,
        expectedOutput: allTestCases[index].expectedOutput,
        actualOutput: parsed.stdout || parsed.stderr || parsed.message,
        error: parsed.compile_output || parsed.stderr
      };
    });

    const finalStatus = allPassed ? 'Accepted' : (firstErrorStatus || 'Wrong Answer');
    const avgRuntime = testResults.length > 0 ? totalRuntime / testResults.length : 0;
    const avgMemory = testResults.length > 0 ? totalMemory / testResults.length : 0;

    let semanticScore = null;
    let aiHints = [];

    if (allPassed && challenge.optimalSolutions && challenge.optimalSolutions[language]) {
      try {
        semanticScore = await getSimilarityScore(code, challenge.optimalSolutions[language]);
        if (semanticScore < 0.85) {
          const hint = await getOptimizationHint(code, challenge.optimalSolutions[language], language);
          if (hint) aiHints.push(hint);
        }
      } catch (err) {
        console.error('AI scoring error:', err.message);
      }
    }

    // If code failed, try to get an AI hint about the error
    if (!allPassed) {
      try {
        const failedTest = testResults.find(t => !t.passed);
        const errorInfo = failedTest?.error || failedTest?.actualOutput || finalStatus;
        const { explainError } = await import('../services/geminiService.js');
        const errorHint = await explainError(errorInfo, code, language);
        if (errorHint) aiHints.push(errorHint);
      } catch (err) {
        console.error('AI error hint failed:', err.message);
      }
    }

    const submission = await Submission.create({
      userId,
      challengeId,
      code,
      language,
      status: finalStatus,
      testResults,
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.passed).length,
      runtime: avgRuntime,
      memory: avgMemory,
      semanticScore,
      aiHints
    });

    challenge.totalSubmissions += 1;
    if (finalStatus === 'Accepted') challenge.acceptedSubmissions += 1;
    await challenge.save();

    try {
      await updateProgress(userId, submission, challenge);
    } catch (err) {
      console.error('Progress update error:', err.message);
    }

    res.status(201).json({ submission });
  } catch (error) {
    console.error('SubmitCode error:', error);
    // Provide user-friendly error messages
    if (error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Cannot connect to Judge0. Make sure Docker is running and Judge0 is started.' });
    }
    if (error.message?.includes('timed out')) {
      return res.status(504).json({ error: 'Code execution timed out. Check for infinite loops.' });
    }
    res.status(500).json({ error: error.message || 'Submission failed' });
  }
};

/**
 * @route GET /api/submit/:challengeId
 * @desc Get user's submissions for a specific challenge
 * @access Private
 */
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      userId: req.user._id, 
      challengeId: req.params.challengeId 
    }).sort('-submittedAt');
    
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('GetSubmissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
