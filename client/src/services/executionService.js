import api from './api';

export const submitCode = (data) => api.post('/submit', data);
export const getSubmissions = (challengeId) => api.get(`/submit/${challengeId}`);
