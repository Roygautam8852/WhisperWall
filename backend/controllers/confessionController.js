const Confession = require('../models/Confession');
const User = require('../models/User');
const Joi = require('joi');

// Validation schemas
const confessionValidation = Joi.object({
  text: Joi.string().min(10).max(2000).required(),
  secretCode: Joi.string().min(4).required(),
  category: Joi.string().valid('Crush', 'Study', 'Funny', 'Rant', 'General'),
  hashtags: Joi.array().items(Joi.string().trim().lowercase()),
});

const updateConfessionValidation = Joi.object({
  text: Joi.string().min(10).max(2000).required(),
  secretCode: Joi.string().min(4).required(),
  category: Joi.string().valid('Crush', 'Study', 'Funny', 'Rant', 'General'),
  hashtags: Joi.array().items(Joi.string().trim().lowercase()),
  currentSecretCode: Joi.string().min(4).required(),
});

// POST - Create a new confession
exports.createConfession = async (req, res, next) => {
  try {
    const { error, value } = confessionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { text, secretCode, category, hashtags } = value;

    // Find or create user display name
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.displayName) {
      user.displayName = `Anon#${Math.floor(Math.random() * 10000)}`;
      await user.save();
    }

    const newConfession = new Confession({
      userId: req.user.id,
      text,
      secretCode,
      category,
      hashtags: hashtags || [],
    });

    await newConfession.save();
    await newConfession.populate('userId', 'displayName avatar');

    res.status(201).json({
      message: 'Confession created successfully',
      confession: {
        _id: newConfession._id,
        text: newConfession.text,
        category: newConfession.category,
        hashtags: newConfession.hashtags,
        reactions: newConfession.reactions,
        userId: newConfession.userId,
        createdAt: newConfession.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET - Get all confessions
exports.getConfessions = async (req, res, next) => {
  try {
    const { sortBy, category } = req.query;
    let query = { isDeleted: false };

    if (category && category !== 'All') {
      query.category = category;
    }

    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'trending') {
      sort = { 'reactions.like': -1, 'reactions.love': -1, createdAt: -1 };
    }

    const confessions = await Confession.find(query)
      .sort(sort)
      .populate('userId', 'displayName avatar email')
      .lean();

    res.json({
      confessions,
      total: confessions.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET - Get single confession
exports.getConfessionById = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id)
      .populate('userId', 'displayName avatar email');

    if (!confession || confession.isDeleted) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.json(confession);
  } catch (error) {
    next(error);
  }
};

// PUT - Update confession (with secret code verification)
exports.updateConfession = async (req, res, next) => {
  try {
    const { error, value } = updateConfessionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { text, secretCode, category, hashtags, currentSecretCode } = value;

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    if (confession.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify current secret code
    const isCodeValid = await confession.verifySecretCode(currentSecretCode);
    if (!isCodeValid) {
      return res.status(401).json({ error: 'Incorrect secret code' });
    }

    // Update confession
    confession.text = text;
    confession.secretCode = secretCode;
    confession.category = category;
    confession.hashtags = hashtags || [];

    await confession.save();

    res.json({
      message: 'Confession updated successfully',
      confession: {
        _id: confession._id,
        text: confession.text,
        category: confession.category,
        hashtags: confession.hashtags,
        reactions: confession.reactions,
        createdAt: confession.createdAt,
        updatedAt: confession.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete confession (with secret code verification)
exports.deleteConfession = async (req, res, next) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode || secretCode.length < 4) {
      return res.status(400).json({ error: 'Secret code is required and must be at least 4 characters' });
    }

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    if (confession.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify secret code
    const isCodeValid = await confession.verifySecretCode(secretCode);
    if (!isCodeValid) {
      return res.status(401).json({ error: 'Incorrect secret code' });
    }

    confession.isDeleted = true;
    await confession.save();

    res.json({ message: 'Confession deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// POST - Add reaction to confession
exports.addReaction = async (req, res, next) => {
  try {
    const { reactionType } = req.body;

    if (!['like', 'love', 'laugh'].includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Check if user already reacted
    const existingReaction = confession.userReactions.find(
      (r) => r.userId.toString() === req.user.id
    );

    if (existingReaction) {
      // Remove old reaction
      confession.reactions[existingReaction.reactionType]--;
      confession.userReactions = confession.userReactions.filter(
        (r) => r.userId.toString() !== req.user.id
      );
    }

    // Add new reaction
    confession.reactions[reactionType]++;
    confession.userReactions.push({
      userId: req.user.id,
      reactionType,
    });

    await confession.save();

    res.json({
      message: 'Reaction added',
      reactions: confession.reactions,
    });
  } catch (error) {
    next(error);
  }
};

// GET - Get user confessions
exports.getUserConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find({
      userId: req.user.id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName avatar')
      .lean();

    res.json({
      confessions,
      total: confessions.length,
    });
  } catch (error) {
    next(error);
  }
};
