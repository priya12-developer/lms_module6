import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import quizRoutes from './routes/quizRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import { mockLogin } from './middleware/auth.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mock login route
app.post('/api/auth/login', mockLogin);

// Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz Management API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});