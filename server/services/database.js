const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');

mongoose.connect('mongodb+srv://hackUser:hackpassword@cluster0-cixj1.gcp.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createUserSpotify = (profile, done) => {
  User.create({ spotifyId: profile.id }, (err, user) => {
    done(err, user);
  });
};

const getUserSpotify = (id, done) => {
  User.findOne({ spotifyId: id }, (err, user) => {
    done(err, user);
  });
};

const setUserSpotifyAuthCode = (id, code, done) => {
  User.updateOne({ _id: id }, { spotifyAuthorizationCode: code }, (err, res) => {
    done(err, res);
  });
};

const getUser = (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
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
      User.updateOne({ _id: userId }, { $push: { groups: group._id } }, (err, user) => {
        done(err, group);
      });
    }
  });
};

exports.createUserSpotify = createUserSpotify;
exports.getUserSpotify = getUserSpotify;
exports.setUserSpotifyAuthCode = setUserSpotifyAuthCode;
exports.getUser = getUser;
exports.getGroups = getGroups;
exports.createGroup = createGroup;
