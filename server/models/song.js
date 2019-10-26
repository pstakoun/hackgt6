const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;
