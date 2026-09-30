import axios from 'axios';

export const analyzeComplexity = async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });
  
  const prompt = `Analyze the time and space complexity of this ${language || 'code'}. Be precise. Consider edge cases and nested loops carefully. Respond in EXACTLY this format:
Time: O(...)
Space: O(...)
Explanation: One paragraph explanation of why.\n\nCode:\n${code}`;

  try {
    // Try Ollama first
    try {
      const ollamaRes = await axios.post('http://localhost:11434/api/generate', {
        model: 'qwen2.5-coder:3b', prompt, stream: false
      }, { timeout: 60000 });
      if (ollamaRes.data?.response) {
        return res.json({ analysis: ollamaRes.data.response });
      }
    } catch (e) { console.log('Ollama unavailable for complexity, trying Gemini...'); }
    
    // Gemini fallback
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    );
    const text = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return res.json({ analysis: text });
    throw new Error('Empty response');
  } catch (error) {
    console.error('Complexity analysis error:', error.message);
    res.status(500).json({ error: 'AI analysis unavailable' });
  }
};
