const mongoose = require('mongoose');

const GroupPlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  group: {
    type: String,
  },
  spotifyId: {
    type: String,
  },
  songs: {
    type: [String],
  },
});

const GroupPlaylist = mongoose.model('GroupPlaylist', GroupPlaylistSchema);

module.exports = GroupPlaylist;
