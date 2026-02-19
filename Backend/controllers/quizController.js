import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

export const createQuiz = async (req, res) => {
  try {
    const quizData = { ...req.body, trainerId: req.user.id };
    const quiz = new Quiz(quizData);
    await quiz.save();
    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully'
    });
  } catch (error) {
    console.error('createQuiz error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const { courseId, trainerId, isPublished } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (trainerId) filter.trainerId = trainerId;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('getAllQuizzes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('getQuizById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    if (quiz.trainerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }
    Object.assign(quiz, req.body);
    await quiz.save();
    res.json({
      success: true,
      data: quiz,
      message: 'Quiz updated successfully'
    });
  } catch (error) {
    console.error('updateQuiz error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    if (quiz.trainerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }
    await Question.deleteMany({ quizId: req.params.id });
    await quiz.deleteOne();
    res.json({
      success: true,
      message: 'Quiz and questions deleted successfully'
    });
  } catch (error) {
    console.error('deleteQuiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    if (quiz.trainerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add questions'
      });
    }
    const questionData = { ...req.body, quizId: req.params.id };
    const question = new Question(questionData);
    await question.save();
    res.status(201).json({
      success: true,
      data: question,
      message: 'Question added successfully'
    });
  } catch (error) {
    console.error('addQuestion error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getQuizQuestions = async (req, res) => {
  try {
    const { includeAnswers } = req.query;
    let questions = await Question.find({
      quizId: req.params.id
    }).sort({ orderIndex: 1 });

    if (includeAnswers !== 'true') {
      questions = questions.map(q => {
        const qObj = q.toObject();
        if (qObj.questionType === 'MCQ') {
          qObj.options = qObj.options.map(opt => ({
            optionText: opt.optionText,
            _id: opt._id
          }));
        } else {
          delete qObj.correctAnswer;
        }
        return qObj;
      });
    }

    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('getQuizQuestions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.trainerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }
    Object.assign(question, req.body);
    await question.save();
    res.json({
      success: true,
      data: question,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('updateQuestion error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.trainerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }
    await question.deleteOne();
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('deleteQuestion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};