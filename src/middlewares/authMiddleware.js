const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // Get the token from the request header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      // Attach the user details to the request object
      req.user = decoded;

      // Check if the user has the required role
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
};

module.exports = authMiddleware;