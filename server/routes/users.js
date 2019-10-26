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
    scope: [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'playlist-modify-private',
      'playlist-modify-public',
      'playlist-read-collaborative',
      'playlist-read-private',
    ],
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

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
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

router.get('/me/top/artists', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopArtists(req.user, (err, body) => {
      res.json(body);
    });
  }
});

router.get('/me/top/tracks', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopTracks(req.user, (err, body) => {
      res.json(body);
    });
  }
});

router.get('/me/recommendations', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopTracks(req.user, (err, body) => {
      const dat = JSON.parse(body);
      /*for (var prop in dat) {
      console.log("Key:" + prop);
        console.log("Value:" + dat[prop]);
      }
      console.log(dat['items']['0']['name']);*/
      seed_tracks = [];

      for (var i = 0; i < 5; i++) {
          seed_tracks.push(dat['items'][i]['id']);
      }
      var into = { 'seed_tracks' : seed_tracks };
      spotify.getRecommendations(req.user, (err, into) => {
        const data2 = JSON.parse(into);
        for (var i = 0; i < 5; i++) {
            seed_tracks.push(dat['items'][i]['id']);
        }
        res.json(into);
      });
    });
  }
});


router.get('/me/values', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    grouping.getValues(req.user, (err, body) => {
      res.json(body);
    });
  }
});

/*
router.get('/me/recommendations', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    //spotify.getTopTracks(req.user, (err, bodyA) => {
      spotify.getRecommendations(req.user, (err, bodyB) => {
        res.json(bodyB);
      });
    //});
  }
});*/

router.post('/group/top/tracks', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    spotify.getTopTracks(req.user, (err, body) => {
      res.json(body);
    });
  }
});

module.exports = router;
