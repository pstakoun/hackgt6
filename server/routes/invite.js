const express = require('express');
const database = require('../services/database');
const sms = require('../grpc/sms_client');

const router = express.Router();

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
    // TODO: Validate the phone numbers are in the following format: +11234567890
    // TODO: Include the user doing the inviting in the message body.
    // TODO: Also make the message body not a fucking meme.
    sms.createGroupInvite('Ape Benison invited you to join unknown product name #69! Join'
      + ' using this link: ', JSON.parse(req.body.phoneNumbers)).then((response) => {
      invites[response.getTokenId()] = {
        phoneNumber: response.getPhoneNumber(),
        invitedFrom: req.user,
        expiration: response.getExpiration(),
        group: req.body.group,
      };
      res.status(200).json({ message: response });
    });
  }
});

/**
 * Join a group with an invite code.
 */
router.get('/join/:token', (req, res) => {
  if (!invites[req.params.token]) {
    res.status(404).send({ message: 'fuck off cunt' });
  }
  const invite = invites[req.params.token];
  // TODO
});

module.exports = router;
