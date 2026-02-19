import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionType: {
    type: String,
    enum: ['MCQ', 'TRUE_FALSE'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    optionText: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String, // For TRUE_FALSE type
    enum: ['true', 'false', null]
  },
  marks: {
    type: Number,
    required: true,
    default: 1
  },
  orderIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Validation: MCQ must have options, TRUE_FALSE must have correctAnswer
questionSchema.pre('save', function(next) {
  if (this.questionType === 'MCQ') {
    if (!this.options || this.options.length < 2) {
      return next(new Error('MCQ must have at least 2 options'));
    }
    const correctOptions = this.options.filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) {
      return next(new Error('MCQ must have exactly one correct answer'));
    }
  } else if (this.questionType === 'TRUE_FALSE') {
    if (!this.correctAnswer) {
      return next(new Error('TRUE_FALSE question must have a correct answer'));
    }
  }
  next();
});

export default mongoose.model('Question', questionSchema);