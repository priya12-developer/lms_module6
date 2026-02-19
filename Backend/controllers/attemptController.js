import QuizAttempt from '../models/QuizAttempt.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers, startTime } = req.body;
    const learnerId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Quiz is not published yet'
      });
    }

    if (!quiz.allowMultipleAttempts) {
      const existingAttempt = await QuizAttempt.findOne({ quizId, learnerId });
      if (existingAttempt) {
        return res.status(400).json({
          success: false,
          message: 'Multiple attempts not allowed for this quiz'
        });
      }
    }

    const questions = await Question.find({ quizId });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let totalMarksObtained = 0;
    const evaluatedAnswers = answers.map(answer => {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return { ...answer, isCorrect: false, marksObtained: 0 };
      }

      let isCorrect = false;
      if (question.questionType === 'MCQ') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = answer.selectedAnswer === correctOption?.optionText;
      } else if (question.questionType === 'TRUE_FALSE') {
        isCorrect = answer.selectedAnswer?.toLowerCase() === question.correctAnswer?.toLowerCase();
      }

      const marksObtained = isCorrect ? question.marks : 0;
      totalMarksObtained += marksObtained;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        marksObtained
      };
    });

    const endTime = new Date();
    const timeTaken = Math.floor((endTime - new Date(startTime)) / 1000);
    const percentage = quiz.totalMarks > 0
      ? (totalMarksObtained / quiz.totalMarks) * 100
      : 0;
    const passed = percentage >= quiz.passingCriteria;

    const attempt = new QuizAttempt({
      quizId,
      learnerId,
      answers: evaluatedAnswers,
      totalMarksObtained,
      totalMarks: quiz.totalMarks,
      percentage,
      passed,
      startTime,
      endTime,
      timeTaken
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      data: attempt,
      message: passed
        ? 'Congratulations! You passed the quiz.'
        : 'Quiz submitted. Keep learning!'
    });
  } catch (error) {
    console.error('submitQuizAttempt error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    const quiz = await Quiz.findById(attempt.quizId);

    const attemptData = {
      _id: attempt._id,
      quizId: {
        _id: quiz?._id,
        title: quiz?.title,
        passingCriteria: quiz?.passingCriteria
      },
      learnerId: attempt.learnerId,
      answers: attempt.answers,
      totalMarksObtained: attempt.totalMarksObtained,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      timeTaken: attempt.timeTaken,
      createdAt: attempt.createdAt
    };

    res.json({ success: true, data: attemptData });
  } catch (error) {
    console.error('getAttemptById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLearnerAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const learnerId = req.user.id;

    const attempts = await QuizAttempt.find({ quizId, learnerId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('getLearnerAttempts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempts = await QuizAttempt.find({ quizId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('getQuizAttempts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLearnerStats = async (req, res) => {
  try {
    const learnerId = req.user.id;
    const attempts = await QuizAttempt.find({ learnerId });

    const stats = {
      totalAttempts: attempts.length,
      passed: attempts.filter(a => a.passed).length,
      failed: attempts.filter(a => !a.passed).length,
      averagePercentage: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
        : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('getLearnerStats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};