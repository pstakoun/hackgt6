const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');
const GroupPlaylist = require('../models/group-playlist');

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

const createGroup = (userId, done) => {
  Group.create({ owner: userId }, (err, group) => {
    if (err) {
      done(err, group);
    } else {
      User.updateOne({ _id: userId }, { $push: { groups: group._id } }, (err, res) => {
        done(err, group);
      });
    }
  });
};

const getGroupPlaylists = (groupId, done) => {
  GroupPlaylist.find({ group: groupId }, (err, groupPlaylists) => {
    if (err) {
      done(err, null);
    } else {
      done(err, groupPlaylists);
    }
  });
};

const createGroupPlaylist = (groupId, spotifyId, done) => {
  GroupPlaylist.create({ group: groupId, spotifyId: spotifyId }, (err, groupPlaylist) => {
    if (err) {
      done(err, null);
    } else {
      Group.updateOne({ _id: groupId }, { $push: { playlists: groupPlaylist._id } }, (err, res) => {
        done(err, groupPlaylist);
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
exports.createUserSpotify = createUserSpotify;
exports.setUserSpotifyAuthCode = setUserSpotifyAuthCode;
exports.updateUserTokensSpotify = updateUserTokensSpotify;
exports.getGroups = getGroups;
exports.createGroup = createGroup;
exports.getGroupPlaylists = getGroupPlaylists;
exports.createGroupPlaylist = createGroupPlaylist;
exports.findUsersInGroup = findUsersInGroup;
