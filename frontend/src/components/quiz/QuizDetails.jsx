import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import QuestionForm from './QuestionForm';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

 useEffect(() => {
  if (id) {
    const token = localStorage.getItem('token');
    if (token) {
      fetchQuizDetails();
    } else {
      setTimeout(() => {
        fetchQuizDetails();
      }, 500);
    }
  }
}, [id]);
  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const [quizRes, questionsRes] = await Promise.all([
        quizService.getQuizById(id),
        quizService.getQuizQuestions(id, true)
      ]);
      setQuiz(quizRes.data.data);
      setQuestions(questionsRes.data.data);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      setError('Failed to load quiz details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await quizService.deleteQuestion(id, questionId);
      fetchQuizDetails();
    } catch (error) {
      alert('Failed to delete question');
    }
  };

  const handleQuestionSaved = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
    fetchQuizDetails();
  };

  const handleTogglePublish = async () => {
    try {
      await quizService.updateQuiz(id, { isPublished: !quiz.isPublished });
      fetchQuizDetails();
    } catch (error) {
      alert('Failed to update quiz');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading quiz details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={() => navigate('/quizzes')} style={styles.backBtn}>
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <p>Quiz not found!</p>
          <button onClick={() => navigate('/quizzes')} style={styles.backBtn}>
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{quiz.title}</h2>
        <button onClick={() => navigate('/quizzes')} style={styles.backBtn}>
          Back to Quizzes
        </button>
      </div>

      <div style={styles.quizInfo}>
        <p><strong>Description:</strong> {quiz.description}</p>
        <div style={styles.meta}>
          <span>✅ Passing: {quiz.passingCriteria}%</span>
          <span>⏱️ Duration: {quiz.duration} min</span>
          <span>📊 Total Marks: {quiz.totalMarks}</span>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: quiz.isPublished ? '#27ae60' : '#f39c12'
            }}
          >
            {quiz.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <button
          onClick={handleTogglePublish}
          style={{
            ...styles.publishBtn,
            backgroundColor: quiz.isPublished ? '#f39c12' : '#27ae60'
          }}
        >
          {quiz.isPublished ? 'Unpublish Quiz' : 'Publish Quiz'}
        </button>
      </div>

      <div style={styles.questionsSection}>
        <div style={styles.sectionHeader}>
          <h3>Questions ({questions.length})</h3>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setShowQuestionForm(!showQuestionForm);
            }}
            style={styles.addBtn}
          >
            {showQuestionForm ? 'Cancel' : 'Add Question'}
          </button>
        </div>

        {showQuestionForm && (
          <QuestionForm
            quizId={id}
            question={editingQuestion}
            onSave={handleQuestionSaved}
            onCancel={() => {
              setShowQuestionForm(false);
              setEditingQuestion(null);
            }}
          />
        )}

        {questions.length === 0 && !showQuestionForm ? (
          <div style={styles.emptyState}>
            <p>No questions added yet.</p>
            <p>Click "Add Question" to start adding questions!</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question._id} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <h4>Q{index + 1}. {question.questionText}</h4>
                <div style={styles.questionMeta}>
                  <span style={styles.typeBadge}>{question.questionType}</span>
                  <span>{question.marks} marks</span>
                </div>
              </div>

              {question.questionType === 'MCQ' && (
                <div style={styles.options}>
                  {question.options.map((option, i) => (
                    <div
                      key={option._id || i}
                      style={{
                        ...styles.option,
                        ...(option.isCorrect ? styles.correctOption : {})
                      }}
                    >
                      {String.fromCharCode(65 + i)}. {option.optionText}
                      {option.isCorrect && (
                        <span style={styles.correctLabel}> ✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {question.questionType === 'TRUE_FALSE' && (
                <div style={styles.answer}>
                  Correct Answer: <strong>{question.correctAnswer?.toUpperCase()}</strong>
                </div>
              )}

              <div style={styles.questionActions}>
                <button
                  onClick={() => {
                    setEditingQuestion(question);
                    setShowQuestionForm(true);
                  }}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  backBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  quizInfo: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  meta: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    color: '#666',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  statusBadge: {
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  publishBtn: {
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  questionsSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  addBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  questionCard: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  questionMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  typeBadge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem'
  },
  options: {
    marginBottom: '1rem'
  },
  option: {
    padding: '0.75rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  correctOption: {
    backgroundColor: '#d4edda',
    borderLeft: '3px solid #28a745'
  },
  correctLabel: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  answer: {
    padding: '0.75rem',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  questionActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  editBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#999'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#666'
  }
};

export default QuizDetails;