const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
  clientId: '1eaa04d6551348fa84e7966990e45aeb',
  clientSecret: '77f351092ac34ba7af26b9311be33c16',
  redirectUri: 'http://localhost:3000/users/auth/spotify/callback',
});

const getMe = (user) => {
  console.log(user);
  return user;
};

const createPlaylist = (name, user) => {
  spotifyApi.authorizationCodeGrant(user.spotifyAuthorizationCode)
    .then((data) => {
      console.log("test! ")
      spotifyApi.setAccessToken(data.body.access_token);
      return spotifyApi.createPlaylist(name, {'public' : false});
    }).then((data) => {
      console.log('Created playlist!');
    }).catch((err) => {
      console.log('Something went wrong!', err);
    });
};

// TODO MAKE THIS A post


/*
const createPlaylist = (user) => {

}

const getTracks

*/


exports.getMe = getMe;
exports.createPlaylist = createPlaylist;
