import express from 'express';
import {
  submitQuizAttempt,
  getAttemptById,
  getLearnerAttempts,
  getQuizAttempts,
  getLearnerStats
} from '../controllers/attemptController.js';
import { authenticate, authorizeTrainer } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, submitQuizAttempt);
router.get('/stats', authenticate, getLearnerStats);
router.get('/:id', authenticate, getAttemptById);
router.get('/quiz/:quizId/learner', authenticate, getLearnerAttempts);
router.get('/quiz/:quizId/all', authenticate, authorizeTrainer, getQuizAttempts);

export default router;