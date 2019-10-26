const request = require('request');
const database = require('../services/database');
const spotify = require('../services/spotify');

const getValues = (user, done) => {
  const userArtists = [];
  const userTracks = [];
  const genres = [];
  const out = 'name';
  const option = { limit: 50 };
  spotify.getTopArtists(user, option, (err, body) => {
    const cur = JSON.parse(body);
    for (let i = 0; i < cur.limit; i++) {
      userArtists.push(cur.items[i][out]);
      for (let j = 0; j < cur.items[i].genres.length; j++) {
        const genre = cur.items[i].genres[j];
        if (genres.indexOf(genre) == -1) {
          genres.push(genre);
        }
      }
    }
    spotify.getTopTracks(user, option, (err, body) => {
      const cur = JSON.parse(body);
      for (let i = 0; i < cur.limit; i++) {
        userTracks.push(cur.items[i][out]);

        for (let j = 0; j < cur.items[i].album.artists.length; j++) {
          const artist = cur.items[i].album.artists[j][out];
          //  console.log(cur['items'][i]['album']['artists'][j])
          if (userArtists.indexOf(artist) == -1) {
            userArtists.push(artist);
          }
        }
        // console.log(cur['items'][i]['album']['artists'][j][out]);
        // console.log("AHPP")
        // userArtists.push(artist);
      }
      /* console.log(userArtists);
          console.log(userTracks); */

      const finished = { artists: userArtists, tracks: userArtists, genres };
      done(err, finished);
    });
  });
};
exports.getValues = getValues;
