import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';

const QuizForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '507f1f77bcf86cd799439011', // Mock course ID
    passingCriteria: 60,
    duration: 30,
    totalMarks: 100,
    isPublished: false,
    allowMultipleAttempts: false,
    shuffleQuestions: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await quizService.createQuiz(formData);
    const newQuizId = response.data.data._id;
    navigate(`/quizzes/${newQuizId}`);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create quiz');
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <h2>Create New Quiz</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={styles.textarea}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Passing Criteria (%) *</label>
            <input
              type="number"
              name="passingCriteria"
              value={formData.passingCriteria}
              onChange={handleChange}
              min="0"
              max="100"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Total Marks *</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Publish immediately
          </label>

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="allowMultipleAttempts"
              checked={formData.allowMultipleAttempts}
              onChange={handleChange}
            />
            Allow multiple attempts
          </label>

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="shuffleQuestions"
              checked={formData.shuffleQuestions}
              onChange={handleChange}
            />
            Shuffle questions
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            style={styles.cancelBtn}
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem',
    flex: 1
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  }
};

export default QuizForm;