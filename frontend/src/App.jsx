import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Quiz components
import QuizList from './components/quiz/QuizList';
import QuizForm from './components/quiz/QuizForm';
import QuizDetails from './components/quiz/QuizDetails';

// Attempt components
import TakeQuiz from './components/attempt/TakeQuiz';
import QuizResult from './components/attempt/QuizResult';
import AttemptHistory from './components/attempt/AttemptHistory';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import AvailableQuizzes from './pages/AvailableQuizzes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            
            {/* Trainer Routes */}
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <QuizList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/create"
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <QuizForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id"
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <QuizDetails />
                </ProtectedRoute>
              }
            />
            
            {/* Learner Routes */}
            <Route
              path="/available-quizzes"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <AvailableQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/take-quiz/:id"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attempt-result/:id"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <QuizResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-attempts"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <AttemptHistory />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;