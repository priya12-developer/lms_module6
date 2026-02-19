import api from './api';

const quizService = {
  // Quiz operations
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  getAllQuizzes: (params) => api.get('/quizzes', { params }),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  
  // Question operations
  addQuestion: (quizId, questionData) => api.post(`/quizzes/${quizId}/questions`, questionData),
  getQuizQuestions: (quizId, includeAnswers = false) => 
    api.get(`/quizzes/${quizId}/questions`, { params: { includeAnswers } }),
  updateQuestion: (quizId, questionId, questionData) => 
    api.put(`/quizzes/${quizId}/questions/${questionId}`, questionData),
  deleteQuestion: (quizId, questionId) => 
    api.delete(`/quizzes/${quizId}/questions/${questionId}`)
};

export default quizService;