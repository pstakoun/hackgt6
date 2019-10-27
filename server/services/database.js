const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');
const Playlist = require('../models/playlist');

mongoose.connect('mongodb+srv://hackUser:hackpassword@cluster0-cixj1.gcp.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getUser = (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
};

const getUserSpotify = (id, done) => {
  User.findOne({ spotifyId: id }, (err, user) => {
    done(err, user);
  });
};

const createUser = (data, done) => {
  User.create(data, (err, user) => {
    done(err, user);
  });
};

const createUserSpotify = (profile, done) => {
  User.create({ spotifyId: profile.id }, (err, user) => {
    done(err, user);
  });
};

const setUserSpotifyAuthCode = (id, code, done) => {
  User.updateOne({ _id: id }, { spotifyAuthorizationCode: code }, (err, res) => {
    done(err, res);
  });
};

const updateUserTokensSpotify = (profile, access, refresh, done) => {
  User.updateOne({ spotifyId: profile.id }, { spotifyAccessToken: access, spotifyRefreshToken: refresh }, (err, res) => {
    done(err, res);
  });
};

const getGroups = (userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) {
      done(err, null);
    } else {
      Group.find({ _id: { $in: user.groups } }, (err, groups) => {
        done(err, groups);
      });
    }
  });
};

const createGroup = (userId, name, done) => {
  Group.create({ owner: userId, name }, (err, group) => {
    if (err) {
      done(err, group);
    } else {
      User.updateOne({ _id: userId }, { $push: { groups: group._id } }, (err, res) => {
        done(err, group);
      });
    }
  });
};

const addUserToGroup = (userId, groupId, done) => {
  User.updateOne({ _id: userId }, { $push: { groups: groupId } }, (err, res) => {
    done(err, res);
  });
};

const getPlaylists = (groupId, done) => {
  Playlist.find({ group: groupId }, (err, playlists) => {
    if (err) {
      done(err, null);
    } else {
      done(err, playlists);
    }
  });
};

const getPlaylist = (id, done) => {
  Playlist.findById(id, (err, playlist) => {
    done(err, playlist);
  });
};

const createPlaylist = (groupId, spotifyId, done) => {
  Playlist.create({ group: groupId, spotifyId }, (err, playlist) => {
    if (err) {
      done(err, null);
    } else {
      Group.updateOne({ _id: groupId }, { $push: { playlists: playlist._id } }, (err, res) => {
        done(err, playlist);
      });
    }
  });
};

const findUsersInGroup = (groupId, done) => {
  User.find({ groups: groupId }, (err, users) => {
    if (err) {
      done(err, null);
    } else {
      done(err, users);
    }
  });
};

exports.getUser = getUser;
exports.getUserSpotify = getUserSpotify;
exports.createUser = createUser;
exports.createUserSpotify = createUserSpotify;
exports.setUserSpotifyAuthCode = setUserSpotifyAuthCode;
exports.updateUserTokensSpotify = updateUserTokensSpotify;
exports.getGroups = getGroups;
exports.createGroup = createGroup;
exports.addUserToGroup = addUserToGroup;
exports.getPlaylists = getPlaylists;
exports.getPlaylist = getPlaylist;
exports.createPlaylist = createPlaylist;
exports.findUsersInGroup = findUsersInGroup;
