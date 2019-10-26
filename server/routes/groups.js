const express = require('express');
const database = require('../services/database');
const spotify = require('../services/spotify');

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
    database.getGroupPlaylists(req.params.group, (err, groupPlaylists) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(groupPlaylists);
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
      database.createGroupPlaylist(req.params.group, body.id, (err, groupPlaylist) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(groupPlaylist);
        }
      });
    });
  }
});

router.post('/:group/playlists/:playlist/play', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    database.getGroupPlaylist(req.params.playlist, (err, groupPlaylist) => {
      if (err) {
        res.json({ error: err });
      } else {
        spotify.playPlaylist(req.user, groupPlaylist.spotifyId, (err, result) => {
          res.json(result);
        });
      }
    });
  }
});

module.exports = router;
