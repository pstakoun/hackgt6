const express = require('express');

const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const database = require('../services/database');
const User = require('../models/user');

passport.use(
  new SpotifyStrategy(
    {
      clientID: '1eaa04d6551348fa84e7966990e45aeb',
      clientSecret: '77f351092ac34ba7af26b9311be33c16',
      callbackURL: 'http://localhost:3000/users/auth/spotify/callback',
    },
    ((accessToken, refreshToken, expires_in, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      database.authUserSpotify(profile.id, done);
    }),
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

router.get('/auth/spotify', passport.authenticate('spotify'), (req, res, next) => {
});

router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/users/auth/spotify/failure' }), (req, res, next) => {
  res.send('Authentication success');
});

router.get('/auth/spotify/failure', (req, res, next) => {
  res.send('Authentication failure');
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
