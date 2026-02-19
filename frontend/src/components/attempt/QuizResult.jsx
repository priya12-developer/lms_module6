import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import attemptService from '../../services/attemptService';

const QuizResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAttempt();
    }
  }, [id]);

  const fetchAttempt = async () => {
    try {
      setLoading(true);
      const response = await attemptService.getAttemptById(id);
      setAttempt(response.data.data);
    } catch (error) {
      console.error('Error fetching attempt:', error);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0 min 0 sec';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p>{error}</p>
          <button
            onClick={() => navigate('/available-quizzes')}
            style={styles.backBtn}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p>Result not found!</p>
          <button
            onClick={() => navigate('/available-quizzes')}
            style={styles.backBtn}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const isPassed = attempt.passed;

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.resultCard,
        borderTop: `5px solid ${isPassed ? '#27ae60' : '#e74c3c'}`
      }}>

        <div style={styles.resultHeader}>
          <h2>{isPassed ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h2>
          <div style={{
            ...styles.resultBadge,
            backgroundColor: isPassed ? '#27ae60' : '#e74c3c'
          }}>
            {isPassed ? 'PASSED' : 'FAILED'}
          </div>
        </div>

        <h3 style={styles.quizTitle}>
          {attempt.quizId?.title || 'Quiz Result'}
        </h3>

        <div style={styles.scoreSection}>
          <div style={styles.scoreCircle}>
            <div style={styles.percentage}>
              {attempt.percentage?.toFixed(1)}%
            </div>
            <div style={styles.scoreLabel}>Your Score</div>
          </div>

          <div style={styles.stats}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Marks Obtained</div>
              <div style={styles.statValue}>
                {attempt.totalMarksObtained} / {attempt.totalMarks}
              </div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Passing Criteria</div>
              <div style={styles.statValue}>
                {attempt.quizId?.passingCriteria}%
              </div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Time Taken</div>
              <div style={styles.statValue}>
                {formatTime(attempt.timeTaken)}
              </div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Correct Answers</div>
              <div style={styles.statValue}>
                {attempt.answers?.filter(a => a.isCorrect).length} / {attempt.answers?.length}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.answerBreakdown}>
          <h3 style={{ marginBottom: '1rem' }}>Answer Breakdown</h3>
          {attempt.answers?.map((answer, index) => (
            <div
              key={answer._id || index}
              style={{
                ...styles.answerItem,
                borderLeft: `4px solid ${answer.isCorrect ? '#27ae60' : '#e74c3c'}`
              }}
            >
              <div style={styles.answerHeader}>
                <span style={styles.questionNumber}>
                  Question {index + 1}
                </span>
                <span style={{
                  ...styles.answerStatus,
                  color: answer.isCorrect ? '#27ae60' : '#e74c3c'
                }}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <div style={styles.answerDetail}>
                <strong>Your Answer:</strong>{' '}
                {answer.selectedAnswer || 'Not answered'}
              </div>
              <div style={styles.answerMarks}>
                Marks: {answer.marksObtained}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <Link to="/available-quizzes">
            <button style={styles.primaryBtn}>Back to Quizzes</button>
          </Link>
          <Link to="/my-attempts">
            <button style={styles.secondaryBtn}>View All Attempts</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem'
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  resultBadge: {
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  quizTitle: {
    color: '#7f8c8d',
    marginBottom: '2rem',
    fontWeight: 'normal'
  },
  scoreSection: {
    display: 'flex',
    gap: '3rem',
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    flexWrap: 'wrap'
  },
  scoreCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '150px'
  },
  percentage: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  scoreLabel: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginTop: '0.5rem'
  },
  stats: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  answerBreakdown: {
    marginBottom: '2rem'
  },
  answerItem: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  answerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  questionNumber: {
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  answerStatus: {
    fontWeight: 'bold'
  },
  answerDetail: {
    marginBottom: '0.5rem',
    color: '#555'
  },
  answerMarks: {
    fontSize: '0.9rem',
    color: '#7f8c8d'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  secondaryBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  errorBox: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center'
  },
  backBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#666'
  }
};

export default QuizResult;