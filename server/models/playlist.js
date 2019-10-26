const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
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

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;
