import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../services/quizService';

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getAllQuizzes({ isPublished: true });
      setQuizzes(response.data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading quizzes...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Available Quizzes</h2>
      <p style={styles.subtitle}>Choose a quiz to test your knowledge</p>

      {quizzes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No quizzes available at the moment. Check back later!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} style={styles.card}>
              <h3>{quiz.title}</h3>
              <p style={styles.description}>{quiz.description}</p>
              
              <div style={styles.meta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Duration:</span>
                  <span style={styles.metaValue}>{quiz.duration} min</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Total Marks:</span>
                  <span style={styles.metaValue}>{quiz.totalMarks}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Passing:</span>
                  <span style={styles.metaValue}>{quiz.passingCriteria}%</span>
                </div>
              </div>

              <div style={styles.features}>
                {quiz.allowMultipleAttempts && (
                  <span style={styles.badge}>Multiple Attempts</span>
                )}
                {quiz.shuffleQuestions && (
                  <span style={styles.badge}>Shuffled</span>
                )}
              </div>

              <Link to={`/take-quiz/${quiz._id}`}>
                <button style={styles.startBtn}>Start Quiz</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  description: {
    color: '#666',
    marginBottom: '1.5rem',
    flex: 1
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  metaLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  metaValue: {
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  features: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  badge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem'
  },
  startBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#999'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default AvailableQuizzes;