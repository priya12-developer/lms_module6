import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getQuizQuestions,
  updateQuestion,
  deleteQuestion
} from '../controllers/quizController.js';
import { authenticate, authorizeTrainer } from '../middleware/auth.js';

const router = express.Router();

// Quiz routes
router.post('/', authenticate, authorizeTrainer, createQuiz);
router.get('/', authenticate, getAllQuizzes);
router.get('/:id', authenticate, getQuizById);
router.put('/:id', authenticate, authorizeTrainer, updateQuiz);
router.delete('/:id', authenticate, authorizeTrainer, deleteQuiz);

// Question routes
router.post('/:id/questions', authenticate, authorizeTrainer, addQuestion);
router.get('/:id/questions', authenticate, getQuizQuestions);
router.put('/:id/questions/:questionId', authenticate, authorizeTrainer, updateQuestion);
router.delete('/:id/questions/:questionId', authenticate, authorizeTrainer, deleteQuestion);

export default router;