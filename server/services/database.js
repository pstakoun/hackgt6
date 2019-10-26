const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb+srv://hackUser:hackpassword@cluster0-cixj1.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

const authUserSpotify = (profile, done) => {
  User.create({ spotifyId: profile.id }, (err, user) => {
    done(err, user);
  });
};

exports.authUserSpotify = authUserSpotify;
