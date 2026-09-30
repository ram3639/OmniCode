import api from './api';

export const translateCode = (code, sourceLang, targetLang) => 
  api.post('/translate', { code, sourceLang, targetLang });
