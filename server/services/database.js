const mongoose = require('mongoose');
const User = require('../models/user');

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
  User.findByIdAndUpdate(id, { spotifyAuthorizationCode: code }, (err, user) => {
    done(err, user);
  });
};

const getUser = (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
};

exports.createUserSpotify = createUserSpotify;
exports.getUserSpotify = getUserSpotify;
exports.setUserSpotifyAuthCode = setUserSpotifyAuthCode;
exports.getUser = getUser;
