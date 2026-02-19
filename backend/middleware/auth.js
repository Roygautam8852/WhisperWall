const authenticateToken = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

module.exports = authenticateToken;
