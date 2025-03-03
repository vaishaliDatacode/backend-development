const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    if (roles && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;