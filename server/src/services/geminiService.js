import axios from 'axios';

const generateContent = async (prompt) => {
  // Try Ollama first (generous timeout for local model generation)
  try {
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'qwen2.5-coder:3b',
      prompt: prompt,
      stream: false
    }, { timeout: 60000 }); // 60 seconds — local models need time to generate
    if (ollamaResponse.data?.response) {
      return ollamaResponse.data.response;
    }
  } catch (ollamaError) {
    console.log('Ollama not available, falling back to Gemini...');
  }

  // Fallback to Gemini API
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { timeout: 30000 }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini returned empty response');
    }
    return text;
  } catch (geminiError) {
    console.error('Gemini API Error:', geminiError.response?.data || geminiError.message);
    throw new Error('AI service unavailable. Ensure Ollama is running or check Gemini API key.');
  }
};

/**
 * Get an optimization hint
 */
export const getOptimizationHint = async (userCode, optimalCode, language) => {
  const prompt = `You are an expert ${language} coach.
User's code:
${userCode}

Optimal code:
${optimalCode}

Provide a conceptual hint on how to optimize the user's code to be closer to the optimal code. Do not give away the direct solution. Be brief and constructive.`;
  return await generateContent(prompt);
};

/**
 * Translate code from source language to target language
 */
export const translateCode = async (code, sourceLang, targetLang) => {
  const prompt = `Translate the following ${sourceLang} code to ${targetLang}.

RULES:
- Output ONLY the translated code
- Do NOT wrap in markdown code fences (\`\`\`)
- Do NOT add any explanation, preamble, or comments about the translation
- Preserve the same structure and line count where possible
- Keep blank lines and comments in the same relative positions

Code:
${code}`;
  return await generateContent(prompt);
};

/**
 * Explain a compilation or runtime error
 */
export const explainError = async (errorMsg, code, language) => {
  const prompt = `Explain the following error in this ${language} code concisely and suggest how to fix it without giving the exact code.

Error:
${errorMsg}

Code:
${code}`;
  return await generateContent(prompt);
};
