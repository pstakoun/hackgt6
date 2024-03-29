const express = require('express');

const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const bodyParser = require('body-parser');
const database = require('../services/database');
const spotify = require('../services/spotify');
const grouping = require('../services/grouping');

passport.use(
  new SpotifyStrategy(
    {
      clientID: '1eaa04d6551348fa84e7966990e45aeb',
      clientSecret: '77f351092ac34ba7af26b9311be33c16',
      callbackURL: 'http://mixtape.fratstar.org/users/auth/spotify/callback',
    },
    ((accessToken, refreshToken, expires_in, profile, done) => {
      database.getUserSpotify(profile.id, (err, user) => {
        if (!user) {
          database.createUserSpotify(profile, done);
        } else {
          database.updateUserTokensSpotify(profile, accessToken, refreshToken, (err, res) => {
            database.generateSongSetIfNotExists(user);
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
    scope: [
      'user-read-email',
      'user-read-private',
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-top-read',
      'user-modify-playback-state',
      'playlist-modify-private',
      'playlist-modify-public',
      'playlist-read-collaborative',
      'playlist-read-private',
      'user-library-modify',
    ],
  }), (req, res) => {
});

router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/users/auth/spotify' }), (req, res) => {
  if (req.session.inviteGroup) {
    database.addUserToGroup(req.user.id, req.session.inviteGroup, (err, result) => {
      req.session.inviteGroup = null;
      database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
        res.redirect('/users/me');
      });
    });
  } else {
    database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
      res.redirect('/users/me');
    });
  }
});

router.get('/auth/spotify/authorize', (req, res) => {
  if (req.user) {
    database.setUserSpotifyAuthCode(req.user.id, req.query.code, (err, user) => {
      res.json(user);
    });
  } else {
    database.createUser({ spotifyAccessToken: req.query.token }, (err, user) => {
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          res.send('Error');
        } else {
          res.json(user);
        }
      });
      /* database.setUserSpotifyAuthCode(user.id, req.query.code, (err, result) => {
        req.login(user, (err) => {
          if (err) {
            console.log(err);
            res.send('Error');
          } else {
            res.json(user);
          }
        });
      }); */
    });
  }
});

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getMe(req.user, (err, body) => {
      res.json({
        database: req.user,
        spotify: body,
      });
    });
  }
});

router.get('/me/current', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getCurrentTrack(req.user, (err, body) => {
      res.json(body);
    });
  }
});

router.post('/me/current/save', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getCurrentTrack(req.user, (err, body) => {
      if (err || !body || !JSON.parse(body).item) {
        res.json({});
        return;
      }
      spotify.saveTrack(req.user, JSON.parse(body).item.id, (err, result) => {
        res.json(result);
      });
    });
  }
});

router.post('/me/skip', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.skipTrack(req.user, (err, body) => {
      res.json(body);
    });
  }
});

// For testing
router.get('/me/top/artists', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopArtists(req.user, (err, body) => {
      res.json(body);
    });
  }
});

// For testing
router.get('/me/top/tracks', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopTracks(req.user, (err, body) => {
      res.json(body);
    });
  }
});

// For testing
router.get('/me/values', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    grouping.getValues(req.user, (err, body) => {
      res.json(body);
    });
  }
});

// For testing
router.post('/me/playlist', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    const opts = { name: 'playlisting', public: false, collaborative: true };
    spotify.createPlaylist(req.user, opts, (err, body) => {
      res.json(body);
    });
  }
});

// For testing
router.get('/me/recommendations', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    grouping.getValues(req.user, (err, body) => {
      console.log(body);
      const opt = { seed_artists: '', seed_genres: '', seed_tracks: [] };
      for (let i = 0; i < 5; i++) {
        opt.seed_tracks.push(body.tracks[i]);
      }
      opt.seed_tracks = opt.seed_tracks.join(',');
      spotify.getRecommendations(req.user, opt, (err, body) => {
        res.json(body);
      });
    });
  }
});

module.exports = router;
