import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Quiz Management
        </Link>
        
        <div style={styles.links}>
          {user ? (
            <>
              <span style={styles.userInfo}>
                {user.email} ({user.role})
              </span>
              
              {user.role === 'trainer' && (
                <>
                  <Link to="/quizzes" style={styles.link}>My Quizzes</Link>
                  <Link to="/quizzes/create" style={styles.link}>Create Quiz</Link>
                </>
              )}
              
              {user.role === 'learner' && (
                <>
                  <Link to="/available-quizzes" style={styles.link}>Available Quizzes</Link>
                  <Link to="/my-attempts" style={styles.link}>My Attempts</Link>
                </>
              )}
              
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    marginBottom: '2rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    transition: 'opacity 0.3s'
  },
  userInfo: {
    color: '#ecf0f1',
    fontSize: '0.9rem'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;