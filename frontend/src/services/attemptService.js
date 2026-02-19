import api from './api';

const attemptService = {
  submitAttempt: (attemptData) => api.post('/attempts', attemptData),
  getAttemptById: (id) => api.get(`/attempts/${id}`),
  getLearnerAttempts: (quizId) => api.get(`/attempts/quiz/${quizId}/learner`),
  getQuizAttempts: (quizId) => api.get(`/attempts/quiz/${quizId}/all`),
  getLearnerStats: () => api.get('/attempts/stats')
};

export default attemptService;