const request = require('request');
const database = require('../services/database');

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

const getCurrentTrack = (user, done) => {
  getToken(user, (err, body) => {
    request.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getTopArtists = (user, options, done) => {
  const opt = Object.keys(options).map((key) => `${key}=${options[key]}`).join('&');
  getToken(user, (err, body) => {
    request.get(`https://api.spotify.com/v1/me/top/artists?${opt}`, {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getRecommendations = (user, options, done) => {
  const opt = Object.keys(options).map((key) => `${key}=${options[key]}`).join('&');
  getToken(user, (err, body) => {
    request.get(`https://api.spotify.com/v1/recommendations?${opt}`, {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, JSON.parse(body));
    });
  });
};

const createPlaylist = (user, options, done) => {
  getToken(user, (err, body) => {
    request.post(`https://api.spotify.com/v1/users/${user.spotifyId}/playlists`, {
      json: options,
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const addToPlaylist = (user, playlist, tracks, done) => {
  getToken(user, (err, body) => {
    request.post(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
      json: {
        uris: tracks.map((t) => `spotify:track:${t}`),
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getTopTracks = (user, options, done) => {
  const opt = Object.keys(options).map((key) => `${key}=${options[key]}`).join('&');
  getToken(user, (err, body) => {
    request.get(`https://api.spotify.com/v1/me/top/tracks?${opt}`, {
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};

const getGroupTracks = (groupId, done) => {
  database.findUsersInGroup(groupId, (err, users) => {
    const userResults = [];
    users.forEach((user) => {
      getTopTracks(user, (err, body) => {
        userResults.push(body);
        if (userResults.length === users.length) {
          // TODO
        }
      });
    });
  });
};

const getGroupArtists = (user, groupId, done) => {
  database.findUsersInGroup(groupId, (err, users) => {
    const userResults = [];
    users.forEach((user) => {
      getTopArtists(user, (err, body) => {
        userResults.push(body);
        if (userResults.length === users.length) {
          // TODO
        }
      });
    });
  });
};

const playPlaylist = (user, id, done) => {
  getToken(user, (err, body) => {
    request.put('https://api.spotify.com/v1/me/player/play', {
      json: {
        context_uri: `spotify:playlist:${id}`,
      },
      headers: {
        Authorization: `Bearer ${body.access_token}`,
      },
    }, (err, res, body) => {
      done(err, body);
    });
  });
};


exports.getMe = getMe;
exports.getCurrentTrack = getCurrentTrack;
exports.getTopArtists = getTopArtists;
exports.getTopTracks = getTopTracks;
exports.getGroupTracks = getGroupTracks;
exports.getGroupArtists = getGroupArtists;
exports.playPlaylist = playPlaylist;
exports.createPlaylist = createPlaylist;
exports.addToPlaylist = addToPlaylist;
exports.getRecommendations = getRecommendations;
