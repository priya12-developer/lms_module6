import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedAnswer: {
      type: String, // Option text or 'true'/'false'
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    marksObtained: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  totalMarksObtained: {
    type: Number,
    required: true,
    default: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  timeTaken: {
    type: Number // in seconds
  }
}, {
  timestamps: true
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);