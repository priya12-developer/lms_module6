import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import attemptService from '../../services/attemptService';

const AttemptHistory = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsResponse = await attemptService.getLearnerStats();
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>My Quiz Attempts</h2>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalAttempts}</div>
            <div style={styles.statLabel}>Total Attempts</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#27ae60'}}>{stats.passed}</div>
            <div style={styles.statLabel}>Passed</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#e74c3c'}}>{stats.failed}</div>
            <div style={styles.statLabel}>Failed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.averagePercentage.toFixed(1)}%</div>
            <div style={styles.statLabel}>Average Score</div>
          </div>
        </div>
      )}

      <div style={styles.info}>
        <p>Your quiz attempt history will appear here. Take quizzes to see your progress!</p>
        <Link to="/available-quizzes">
          <button style={styles.browseBtn}>Browse Available Quizzes</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#7f8c8d'
  },
  info: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  browseBtn: {
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
    padding: '2rem'
  }
};

export default AttemptHistory;