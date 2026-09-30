import api from './api';

export const parseAST = (code, language) => api.post('/ast/parse', { code, language });
