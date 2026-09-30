import { translateCode } from '../services/geminiService.js';

export const handleTranslateCode = async (req, res) => {
  const { code, sourceLang, targetLang } = req.body;
  
  if (!code || !sourceLang || !targetLang) {
    return res.status(400).json({ error: 'code, sourceLang, and targetLang are required' });
  }
  
  try {
    const translation = await translateCode(code, sourceLang, targetLang);
    // Gemini returns a string, wrap it properly
    res.json({ translation: typeof translation === 'string' ? translation : String(translation) });
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
};
