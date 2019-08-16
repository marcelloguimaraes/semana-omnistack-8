const { Schema, model } = require('mongoose');

const devSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  bio: String,
  avatar_url: {
    type: String,
    required: true,
  },
  html_url: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'dev',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'dev'
  }],
}, {
  timestamps: true,
  });

module.exports = model('dev', devSchema);