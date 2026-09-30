import api from './api';

export const getProgress = () => api.get('/progress/me');
export const getRecommendations = () => api.get('/progress/recommendations');
export const getStats = () => api.get('/progress/stats');
