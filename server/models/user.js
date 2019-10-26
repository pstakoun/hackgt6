const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  spotifyId: {
    type: String,
  },
  spotifyAuthorizationCode: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
