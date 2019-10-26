const express = require('express');
const database = require('../services/database');

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
    database.createGroup(req.user.id, (err, group) => {
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

router.post('/:group/invite', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else {
    const { invites } = req.body;
    // TODO invite users to group
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
    database.createGroupPlaylist(req.params.group, (err, groupPlaylist) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(groupPlaylist);
      }
    });
  }
});

module.exports = router;
