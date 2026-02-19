const rateLimit = require('express-rate-limit');

const confessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 confessions per 15 minutes per user
  message: 'Too many confessions created, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.user, // Skip rate limiting for non-authenticated users
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  confessionLimiter,
  generalLimiter,
};
