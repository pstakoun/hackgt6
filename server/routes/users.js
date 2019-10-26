const express = require('express');

const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const bodyParser = require('body-parser');
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
      database.getUserSpotify(profile.id, (err, user) => {
        if (!user) {
          database.createUserSpotify(profile, done);
        } else {
          database.updateUserTokensSpotify(profile, accessToken, refreshToken, (err, res) => {
            done(err, user);
          });
        }
      });
    }),
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  database.getUser(id, done);
});

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


router.get('/auth/spotify', passport.authenticate('spotify',
  {
    scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative', 'playlist-read-private',
    ], /* ,
    showDialog: true, */
  }), (req, res) => {
});

router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/users/auth/spotify' }), (req, res) => {
  database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
    res.redirect('/users/me');
  });
});

router.get('/auth/spotify/authorize', (req, res) => {
  if (req.user) {
    database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
      res.json(user);
    });
  } else {
    database.createUserSpotify({}, (err, user) => {
      database.setUserSpotifyAuthCode(user.id, req.query.code, (err, result) => {
        req.login(user, (err) => {
          if (err) {
            console.log(err);
            res.send('Error');
          } else {
            res.json(user);
          }
        });
      });
    });
  }
});

router.get('/me', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getMe(req.user, (err, body) => {
      res.json(body);
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

router.get('/playlists', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    console.log(req.user);
    res.json(spotify.createPlaylist('test', req.user));
  }
});

module.exports = router;
