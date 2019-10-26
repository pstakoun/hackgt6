const express = require('express');
const sms = require('../grpc/sms_client');

const router = express.Router();

/**
 * Routes:
 * - POST / (create invitation)
 * - GET /join/token/{tokenId} (accept invitation)
 */

/**
 * Invite a list of phone numbers to a group.
 * The POST body must contain a list of phone numbers in the specified format.
 */
router.post('/', (req, res) => {
  if (!req.user) {
    res.json({ error: 'Not authorized' });
  } else if (!req.body.phoneNumbers) {
    res.status(400).json({ error: 'Request body missing phone numbers.' });
  } else {
    // TODO: Validate the phone numbers are in the following format: +11234567890
    // TODO: Include the user doing the inviting in the message body.
    // TODO: Also make the message body not a fucking meme.
    sms.createGroupInvite('', req.body.phoneNumbers);
  }
});

/**
 * Join a group with an invite code.
 */
router.get('/join/:token', (req, res) => {
  // TODO: Is token valid and unexpired?
  // TODO: Join the group
  res.send({ message: 'fuck off cunt' });
});


module.exports = router;
