const express = require('express');
const database = require('../services/database');
const spotify = require('../services/spotify');
const grouping = require('../services/grouping');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.getGroups(req.user.id, (err, groups) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(groups);
      }
    });
  }
});

router.post('/', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.createGroup(req.user.id, req.body.name, (err, group) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(group);
      }
    });
  }
});

router.get('/:group/users', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.findUsersInGroup(req.params.group, (err, users) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(users);
      }
    });
  }
});

router.get('/:group/playlists', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.getPlaylists(req.params.group, (err, playlists) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(playlists);
      }
    });
  }
});

router.post('/:group/playlists', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    const opts = { name: req.params.group, public: false, collaborative: true };
    spotify.createPlaylist(req.user, opts, (err, body) => {
      database.createPlaylist(req.params.group, body.id, (err, playlist) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(playlist);
        }
      });
      grouping.getValues(req.user, (err, values) => {
        const opt = { seed_artists: '', seed_genres: '', seed_tracks: [] };
        for (let i = 0; i < 5; i++) {
          opt.seed_tracks.push(values.tracks[i]);
        }
        opt.seed_tracks = opt.seed_tracks.join(',');
        spotify.getRecommendations(req.user, opt, (err, recommendations) => {
          spotify.addToPlaylist(req.user, body.id, recommendations.tracks.map((t) => t.id), (err, done) => {
            // TODO
          //  addToPlaylist = (user, playlist, tracks,
            res(done);
          });
        });
      });
    });
  }
});

router.post('/:group/playlistFinal', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    const opts = { name: req.params.group, public: false, collaborative: true };
    spotify.createPlaylist(req.user, opts, (err, body) => {
      database.createPlaylist(req.params.group, body.id, (err, playlist) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(playlist);
        }
      });
      grouping.getOverlap(req.params.group, (err, values) => {
        const opt = { seed_artists: '', seed_genres: '', seed_tracks: [] };
        for (let i = 0; i < 5 && i < values.artists.length; i++) {
          opt.seed_tracks.push(values.artists[i]);
        }
        opt.seed_tracks = opt.seed_tracks.join(',');
        spotify.getRecommendations(req.user, opt, (err, recommendations) => {
          console.log(recommendations);
          spotify.addToPlaylist(req.user, body.id, recommendations.tracks.map((t) => t.id), (err, done) => {
            // TODO
          });
        });
      });
    });
  }
});

/*
router.post('/:group/groupIdentity', (req, res) => {

}*/

router.post('/:group/playlists/:playlist/play', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.getPlaylist(req.params.playlist, (err, playlist) => {
      if (err) {
        res.json({ error: err });
      } else {
        spotify.playPlaylist(req.user, playlist.spotifyId, (err, result) => {
          res.json(result);
        });
      }
    });
  }
});

// FOR TESTING PURPOSES ONLY!
router.get('/:group/histogram', (req, res) => {
  grouping.getOverlap(req.params.group, (err, out) => {
    console.log(out);
    res.json(out);
  });
});


module.exports = router;
