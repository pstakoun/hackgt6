const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: String,
  },
  playlists: {
    type: [String],
  },
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
