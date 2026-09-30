import api from './api';

export const getChallenges = (params) => api.get('/challenges', { params });
export const getChallenge = (slug) => api.get(`/challenges/${slug}`);
export const createChallenge = (data) => api.post('/challenges', data);
