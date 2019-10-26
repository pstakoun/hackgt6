const mongoose = require('mongoose');

const UserPlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const UserPlaylist = mongoose.model('UserPlaylist', UserPlaylistSchema);

module.exports = UserPlaylist;
