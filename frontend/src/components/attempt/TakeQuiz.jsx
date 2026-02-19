import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import attemptService from '../../services/attemptService';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (quiz && quiz.duration) {
      setTimeLeft(quiz.duration * 60); // Convert to seconds
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionsRes] = await Promise.all([
        quizService.getQuizById(id),
        quizService.getQuizQuestions(id, false)
      ]);
      setQuiz(quizRes.data.data);
      
      let quizQuestions = questionsRes.data.data;
      if (quizRes.data.data.shuffleQuestions) {
        quizQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
      }
      setQuestions(quizQuestions);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz');
      navigate('/available-quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const unanswered = questions.filter(q => !answers[q._id]);
    if (unanswered.length > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const attemptData = {
        quizId: id,
        startTime: startTime.toISOString(),
        answers: questions.map(q => ({
          questionId: q._id,
          selectedAnswer: answers[q._id] || ''
        }))
      };

      const response = await attemptService.submitAttempt(attemptData);
      navigate(`/attempt-result/${response.data.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div style={styles.loading}>Loading quiz...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
        </div>
        {timeLeft !== null && (
          <div style={{
            ...styles.timer,
            color: timeLeft < 60 ? '#e74c3c' : '#2c3e50'
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div style={styles.info}>
        <span>Total Marks: {quiz.totalMarks}</span>
        <span>Passing Criteria: {quiz.passingCriteria}%</span>
        <span>Questions: {questions.length}</span>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={question._id} style={styles.questionCard}>
            <h3 style={styles.questionTitle}>
              Question {index + 1} <span style={styles.marks}>({question.marks} marks)</span>
            </h3>
            <p style={styles.questionText}>{question.questionText}</p>

            {question.questionType === 'MCQ' && (
              <div style={styles.options}>
                {question.options.map((option, i) => (
                  <label key={option._id} style={styles.optionLabel}>
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option.optionText}
                      checked={answers[question._id] === option.optionText}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      style={styles.radio}
                    />
                    <span>{String.fromCharCode(65 + i)}. {option.optionText}</span>
                  </label>
                ))}
              </div>
            )}

            {question.questionType === 'TRUE_FALSE' && (
              <div style={styles.options}>
                <label style={styles.optionLabel}>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value="true"
                    checked={answers[question._id] === 'true'}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    style={styles.radio}
                  />
                  <span>True</span>
                </label>
                <label style={styles.optionLabel}>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value="false"
                    checked={answers[question._id] === 'false'}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    style={styles.radio}
                  />
                  <span>False</span>
                </label>
              </div>
            )}
          </div>
        ))}

        <div style={styles.submitSection}>
          <button
            type="submit"
            disabled={submitting}
            style={styles.submitBtn}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/available-quizzes')}
            style={styles.cancelBtn}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  timer: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  info: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#e8f4f8',
    borderRadius: '4px'
  },
  questionCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  questionTitle: {
    marginBottom: '0.5rem',
    color: '#2c3e50'
  },
  marks: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    fontWeight: 'normal'
  },
  questionText: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    lineHeight: '1.6'
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  submitSection: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem 3rem',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default TakeQuiz;