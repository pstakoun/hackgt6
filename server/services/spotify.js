const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: '1eaa04d6551348fa84e7966990e45aeb',
  clientSecret: '77f351092ac34ba7af26b9311be33c16',
  redirectUri: 'http://localhost:3000/users/auth/spotify/callback',
});

const getMe = (user) =>
  // TODO
  user;
exports.getMe = getMe;
