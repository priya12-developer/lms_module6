import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passingCriteria: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 60
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 30
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  allowMultipleAttempts: {
    type: Boolean,
    default: false
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Quiz', quizSchema);