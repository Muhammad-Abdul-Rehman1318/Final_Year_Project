const authMiddleware = (req, res, next) => {
  // Authentication removed - allow all requests
  next();
};

module.exports = authMiddleware;