const mongoose = require('mongoose');

const GroupPlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const GroupPlaylist = mongoose.model('GroupPlaylist', GroupPlaylistSchema);

module.exports = GroupPlaylist;
