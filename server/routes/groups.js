const express = require('express');
const passport = require('passport');

const router = express.Router();

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
