const express = require('express');
const router = express.Router();
const confessionController = require('../controllers/confessionController');
const authenticateToken = require('../middleware/auth');
const { confessionLimiter } = require('../middleware/rateLimiter');

// GET - Get all confessions (public)
router.get('/', confessionController.getConfessions);

// GET - Get single confession (public)
router.get('/:id', confessionController.getConfessionById);

// POST - Create confession (protected)
router.post('/', authenticateToken, confessionLimiter, confessionController.createConfession);

// PUT - Update confession (protected)
router.put('/:id', authenticateToken, confessionController.updateConfession);

// DELETE - Delete confession (protected)
router.delete('/:id', authenticateToken, confessionController.deleteConfession);

// POST - Add reaction (protected)
router.post('/:id/react', authenticateToken, confessionController.addReaction);

// GET - Get user confessions (protected)
router.get('/user/confessions/my', authenticateToken, confessionController.getUserConfessions);

module.exports = router;
