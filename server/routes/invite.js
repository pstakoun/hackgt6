const express = require('express');
const session = require('express-session');
const phone = require('phone');
const sms = require('../grpc/sms_client');
const database = require('../services/database');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// This is temporary
// #hackathon lyfe
const invites = {};

/**
 * Invite a list of phone numbers to a group.
 * The POST body must contain a list of phone numbers in the specified format.
 */
router.post('/', (req, res) => {
  if (req.user) {
    res.json({ error: 'Not authorized' });
  } else if (!req.body.phoneNumbers) {
    res.status(400).json({ error: 'Request body missing phone numbers.' });
  } else {
    // const phoneNumbers = req.body.phoneNumbers.filter((s) => phone(s)).map((s) => phone(s)[0]);
    console.log(req.body.phoneNumbers);
    sms.createGroupInvite('You have been invited to join Mixtape! Access your account now at: ', req.body.phoneNumbers).then((responses) => {
      for (const response of responses) {
        invites[response.getTokenId()] = {
          phoneNumber: response.getPhoneNumber(),
          invitedFrom: req.user.id,
          expiration: response.getExpiration(),
          group: req.body.group,
        };
      }
      res.status(200).json({ message: responses });
    }).catch((err) => res.status(500).json({ message: err }));
  }
});

/**
 * Join a group with an invite code.
 */
router.get('/join/:token', (req, res) => {
  if (!invites[req.params.token]) {
    res.status(404).send({ message: 'Invalid token' });
  } else {
    req.session.inviteGroup = invites[req.params.token].group;
    return res.redirect('/users/auth/spotify');
  }
});

module.exports = router;
