import axios from 'axios';

export const mapLanguageId = (language) => {
  const map = {
    python: 71,
    cpp: 54,
    c: 50,
    java: 62
  };
  return map[language] || 71;
};

export const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=true&wait=false`,
      { submissions },
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    console.error('Judge0 Batch Submit Error:', error.message);
    throw error;
  }
};

export const pollResults = async (tokens, maxAttempts = 10) => {
  let attempts = 0;
  const tokensParam = tokens.join(',');
  
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch?tokens=${tokensParam}&base64_encoded=true`,
        { timeout: 30000 }
      );
      
      const allDone = response.data.submissions.every(s => s.status.id !== 1 && s.status.id !== 2);
      
      if (allDone) {
        return response.data.submissions;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(1.5, attempts))); // Exponential backoff
      attempts++;
    } catch (error) {
      console.error('Judge0 Poll Error:', error.message);
      throw error;
    }
  }
  throw new Error('Judge0 polling timed out');
};

export const parseResult = (submission) => {
  const statusMap = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    8: 'Runtime Error (SIGXFSZ)',
    9: 'Runtime Error (SIGFPE)',
    10: 'Runtime Error (SIGABRT)',
    11: 'Runtime Error (NZEC)',
    12: 'Runtime Error (Other)',
    13: 'Internal Error',
    14: 'Exec Format Error'
  };

  const decodeBase64 = (str) => {
      if (!str) return '';
      return Buffer.from(str, 'base64').toString('utf-8');
  };

  return {
    status: statusMap[submission.status.id] || 'Unknown',
    stdout: decodeBase64(submission.stdout),
    stderr: decodeBase64(submission.stderr),
    compile_output: decodeBase64(submission.compile_output),
    message: decodeBase64(submission.message),
    runtime: submission.time ? parseFloat(submission.time) * 1000 : 0,
    memory: submission.memory || 0,
    passed: submission.status.id === 3
  };
};
