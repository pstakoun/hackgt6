const mongoose = require('mongoose');

const SongSetSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  user: {
    type: String,
  },
  songs: {
    type: [String],
  },
});

const SongSet = mongoose.model('SongSet', SongSetSchema);

module.exports = SongSet;
