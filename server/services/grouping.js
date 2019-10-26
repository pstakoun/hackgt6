const request = require('request');
const database = require('../services/database');
const spotify = require('../services/spotify')

const getValues = (user, done) => {
    const userArtists = [];
    const userTracks = [];
    const out = 'name'
      spotify.getTopArtists(user, (err, body) => {
        const cur = JSON.parse(body);
        for (var i = 0; i < cur['limit']; i++) {
            userArtists.push(cur['items'][i][out]);
        }
        console.log(userArtists);

      });
      spotify.getTopTracks(user, (err, body) => {
        const cur = JSON.parse(body);
        for (var i = 0; i < cur['limit']; i++) {
            userTracks.push(cur['items'][i][out]);

            for (var j = 0; j < cur['items'][i]['album']['artists'].length; j++) {
            var artist = cur['items'][i]['album']['artists'][j][out]
              if (userArtists.indexOf(artist) == -1){
                 userArtists.push(artist);
              }
            }

              //console.log(cur['items'][i]['album']['artists'][j][out]);
              //console.log("AHPP")
              //userArtists.push(artist);

        }
        console.log(userArtists);

        console.log(userTracks);

        done(err, body);
      });

  };
exports.getValues = getValues;
