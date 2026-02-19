import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';

const QuizList = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchQuizzes();
  } else {
    setTimeout(() => {
      fetchQuizzes();
    }, 500);
  }
}, [filter]);

  const fetchQuizzes = async () => {
    try {
      const params = {};
      if (user.role === 'trainer') {
        params.trainerId = user.id;
      }
      if (filter !== 'all') {
        params.isPublished = filter === 'published';
      }

      const response = await quizService.getAllQuizzes(params);
      setQuizzes(response.data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await quizService.deleteQuiz(id);
      fetchQuizzes();
    } catch (error) {
      alert('Failed to delete quiz');
    }
  };

  const togglePublish = async (quiz) => {
    try {
      await quizService.updateQuiz(quiz._id, {
        isPublished: !quiz.isPublished
      });
      fetchQuizzes();
    } catch (error) {
      alert('Failed to update quiz');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading quizzes...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Quizzes</h2>
        <Link to="/quizzes/create">
          <button style={styles.createBtn}>Create New Quiz</button>
        </Link>
      </div>

      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={filter === 'all' ? styles.activeFilter : styles.filter}
        >
          All
        </button>
        <button
          onClick={() => setFilter('published')}
          style={filter === 'published' ? styles.activeFilter : styles.filter}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('draft')}
          style={filter === 'draft' ? styles.activeFilter : styles.filter}
        >
          Drafts
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No quizzes found. Create your first quiz!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>{quiz.title}</h3>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: quiz.isPublished ? '#27ae60' : '#f39c12'
                  }}
                >
                  {quiz.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <p style={styles.description}>{quiz.description}</p>
              
              <div style={styles.meta}>
                <span>📝 Passing: {quiz.passingCriteria}%</span>
                <span>⏱️ {quiz.duration} min</span>
                <span>📊 {quiz.totalMarks} marks</span>
              </div>

              <div style={styles.cardActions}>
                <Link to={`/quizzes/${quiz._id}`}>
                  <button style={styles.viewBtn}>View Details</button>
                </Link>
                <button
                  onClick={() => togglePublish(quiz)}
                  style={styles.publishBtn}
                >
                  {quiz.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  createBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  filter: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activeFilter: {
    backgroundColor: '#3498db',
    color: 'white',
    border: '1px solid #3498db',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    color: 'white',
    fontWeight: 'bold'
  },
  description: {
    color: '#666',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  publishBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default QuizList;