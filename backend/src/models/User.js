const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: '' },
    photo: { type: String, default: '' },
    provider: { type: String, default: 'google' },
  },
  { timestamps: true },
);

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    googleId: user.googleId,
    email: user.email,
    name: user.name,
    photo: user.photo,
    createdAt: user.createdAt,
  };
}

module.exports = {
  User: mongoose.model('User', userSchema),
  toPublicUser,
};
