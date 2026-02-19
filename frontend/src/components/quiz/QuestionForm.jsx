import { useState, useEffect } from 'react';
import quizService from '../../services/quizService';

const QuestionForm = ({ quizId, question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    questionType: 'MCQ',
    questionText: '',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ],
    correctAnswer: 'true',
    marks: 1,
    orderIndex: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        questionType: question.questionType,
        questionText: question.questionText,
        options: question.options || [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ],
        correctAnswer: question.correctAnswer || 'true',
        marks: question.marks,
        orderIndex: question.orderIndex
      });
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      questionType: newType,
      options: newType === 'MCQ' ? [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ] : [],
      correctAnswer: newType === 'TRUE_FALSE' ? 'true' : ''
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { optionText: '', isCorrect: false }]
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      alert('Must have at least 2 options');
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const validateForm = () => {
    if (!formData.questionText.trim()) {
      setError('Question text is required');
      return false;
    }

    if (formData.questionType === 'MCQ') {
      if (formData.options.length < 2) {
        setError('MCQ must have at least 2 options');
        return false;
      }
      if (formData.options.some(opt => !opt.optionText.trim())) {
        setError('All options must have text');
        return false;
      }
      if (!formData.options.some(opt => opt.isCorrect)) {
        setError('Please select the correct answer');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (question) {
        await quizService.updateQuestion(quizId, question._id, formData);
      } else {
        await quizService.addQuestion(quizId, formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>{question ? 'Edit Question' : 'Add New Question'}</h3>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Question Type *</label>
          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleQuestionTypeChange}
            style={styles.select}
          >
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="TRUE_FALSE">True/False</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Question Text *</label>
          <textarea
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            rows="3"
            required
            style={styles.textarea}
          />
        </div>

        {formData.questionType === 'MCQ' && (
          <div style={styles.formGroup}>
            <label>Options *</label>
            {formData.options.map((option, index) => (
              <div key={index} style={styles.optionRow}>
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => handleOptionChange(index, 'isCorrect', true)}
                  style={styles.radio}
                />
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                  style={styles.optionInput}
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              style={styles.addOptionBtn}
            >
              Add Option
            </button>
          </div>
        )}

        {formData.questionType === 'TRUE_FALSE' && (
          <div style={styles.formGroup}>
            <label>Correct Answer *</label>
            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Marks *</label>
            <input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Order Index</label>
            <input
              type="number"
              name="orderIndex"
              value={formData.orderIndex}
              onChange={handleChange}
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Saving...' : question ? 'Update Question' : 'Add Question'}
          </button>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '2px solid #3498db'
  },
  form: {
    marginTop: '1rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
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
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  optionRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  optionInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  addOptionBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
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

export default QuestionForm;