import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Quiz Management System</h1>
        <p style={styles.subtitle}>
          Create, manage, and take quizzes with automatic evaluation
        </p>

        {!user ? (
          <Link to="/login">
            <button style={styles.ctaBtn}>Get Started</button>
          </Link>
        ) : (
          <div style={styles.userActions}>
            {user.role === 'trainer' && (
              <>
                <Link to="/quizzes">
                  <button style={styles.primaryBtn}>My Quizzes</button>
                </Link>
                <Link to="/quizzes/create">
                  <button style={styles.secondaryBtn}>Create New Quiz</button>
                </Link>
              </>
            )}
            {user.role === 'learner' && (
              <>
                <Link to="/available-quizzes">
                  <button style={styles.primaryBtn}>Browse Quizzes</button>
                </Link>
                <Link to="/my-attempts">
                  <button style={styles.secondaryBtn}>My Attempts</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>Features</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📝</div>
            <h3>Create Quizzes</h3>
            <p>Easily create quizzes with MCQ and True/False questions</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚙️</div>
            <h3>Auto-Evaluation</h3>
            <p>Automatic grading with instant results for learners</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3>Passing Criteria</h3>
            <p>Set custom passing percentage for each quiz</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⏱️</div>
            <h3>Timed Quizzes</h3>
            <p>Set time limits and track quiz duration</p>
          </div>
        </div>
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
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '3rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '3rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#7f8c8d',
    marginBottom: '2rem'
  },
  ctaBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 3rem',
    borderRadius: '4px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  userActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  secondaryBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  features: {
    textAlign: 'center'
  },
  featuresTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  }
};

export default Home;