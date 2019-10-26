const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  artist: {
    type: String,
  },
  image: {
    type: String,
  },
  spotifyId: {
    type: String,
  },
  upvotes: {
    type: [String],
  },
  downvotes: {
    type: [String],
  },
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;
