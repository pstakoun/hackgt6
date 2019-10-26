const express = require('express');
const database = require('../services/database');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  }
  database.getGroups(req.user.id, (err, groups) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(groups);
    }
  });
});

router.post('/', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  }
  database.createGroup(req.user.id, (err, group) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(group);
    }
  });
});

module.exports = router;
