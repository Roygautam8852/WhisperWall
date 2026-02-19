const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const confessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
      trim: true,
    },
    secretCode: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Crush', 'Study', 'Funny', 'Rant', 'General'],
      default: 'General',
    },
    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    reactions: {
      like: {
        type: Number,
        default: 0,
        min: 0,
      },
      love: {
        type: Number,
        default: 0,
        min: 0,
      },
      laugh: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    userReactions: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reactionType: {
          type: String,
          enum: ['like', 'love', 'laugh'],
        },
      },
    ],
    reports: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reason: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash secret code before saving
confessionSchema.pre('save', async function (next) {
  if (!this.isModified('secretCode')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.secretCode = await bcrypt.hash(this.secretCode, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare secret code
confessionSchema.methods.verifySecretCode = async function (plainCode) {
  try {
    return await bcrypt.compare(plainCode, this.secretCode);
  } catch (error) {
    throw new Error('Error verifying secret code');
  }
};

module.exports = mongoose.model('Confession', confessionSchema);
