const request = require('request');

const clientId = '1eaa04d6551348fa84e7966990e45aeb';
const clientSecret = '77f351092ac34ba7af26b9311be33c16';
const redirectUri = 'http://localhost:3000/users/auth/spotify/callback';

const getToken = (user, done) => {
  if (user.spotifyAccessToken) {
    done(null, { access_token: user.spotifyAccessToken });
    return;
  }
  // TODO probably doesn't work
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: user.spotifyAuthorizationCode,
      redirect_uri: redirectUri,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  }, (err, res, body) => {
    done(err, body);
  });
};

const getMe = (user, done) => {
  getToken(user, (err, body) => {
    request.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getTopArtists = (user, done) => {
  getToken(user, (err, body) => {
    request.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getTopTracks = (user, done) => {
  getToken(user, (err, body) => {
    request.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

exports.getMe = getMe;
exports.getTopArtists = getTopArtists;
exports.getTopTracks = getTopTracks;
