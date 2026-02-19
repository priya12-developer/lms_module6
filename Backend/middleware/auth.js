import jwt from 'jsonwebtoken';

// Mock authentication middleware (replace with your actual auth later)
export const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeTrainer = (req, res, next) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ message: 'Access denied. Trainer only.' });
  }
  next();
};

export const authorizeLearner = (req, res, next) => {
  if (req.user.role !== 'learner') {
    return res.status(403).json({ message: 'Access denied. Learner only.' });
  }
  next();
};

// Mock login endpoint for testing (remove when integrating with your auth module)
export const mockLogin = (req, res) => {
  const { email, role } = req.body;
  
  const token = jwt.sign(
    { id: '507f1f77bcf86cd799439011', email, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: { email, role } });
};