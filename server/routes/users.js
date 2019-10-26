const express = require('express');

const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const database = require('../services/database');
const spotify = require('../services/spotify');

passport.use(
  new SpotifyStrategy(
    {
      clientID: '1eaa04d6551348fa84e7966990e45aeb',
      clientSecret: '77f351092ac34ba7af26b9311be33c16',
      callbackURL: 'http://localhost:3000/users/auth/spotify/callback',
    },
    ((accessToken, refreshToken, expires_in, profile, done) => {
      database.createUserSpotify(profile, done);
    }),
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  database.getUser(id, done);
});

router.get('/auth/spotify', passport.authenticate('spotify'), (req, res) => {
});

router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/users/auth/spotify' }), (req, res) => {
  database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
    res.redirect('/users/me');
  });
});

router.get('/auth/spotify/authorize', (req, res) => {
  database.createUserSpotify({}, (err, user) => {
    database.setUserSpotifyAuthCode(user.id, req.query.code, (err, user) => {
      req.user = user;
      res.redirect('/users/me');
    });
  });
});

router.get('/me', (req, res) => {
  if (!req.user) {
    res.redirect('/users/auth/spotify');
  } else {
    res.json(spotify.getMe(req.user));
  }
});

module.exports = router;
