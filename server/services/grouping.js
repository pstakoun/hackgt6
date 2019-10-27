const request = require('request');
const database = require('../services/database');
const spotify = require('../services/spotify');
const peter = require('../services/peter.json');

const getValues = (user, done) => {
  const userArtists = [];
  const userTracks = [];
  const genres = [];
  const out = 'id';
  const option = { limit: 50 };
  spotify.getTopArtists(user, option, (err, body) => {
    const cur = JSON.parse(body);
    for (let i = 0; i < cur.limit; i++) {
      userArtists.push(cur.items[i][out]);
      for (let j = 0; j < cur.items[i].genres.length; j++) {
        const genre = cur.items[i].genres[j];
        if (genres.indexOf(genre) === -1) {
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
          if (userArtists.indexOf(artist) === -1) {
            userArtists.push(artist);
          }
        }
        // console.log(cur['items'][i]['album']['artists'][j][out]);
        // console.log("AHPP")
        // userArtists.push(artist);
      }
      /* console.log(userArtists);

          console.log(userTracks); */

      const finished = { artist: userArtists, tracks: userTracks, genres };
      done(err, finished);
    });
  });
};

const getIndividualOverlap = (groupArr, done) => {
    let total = groupArr[0];
    let mapping = {};
    for(var i = 1; i < groupArr.length; i++) {
       total = total.filter(x => groupArr[i].includes(x));
         for (let val in total) {
           if (!mapping[val]) {
             mapping[val] = 1;
           } else {
              mapping[val]++;
           }
         }
    }
    done(mapping, total);
};




const getOverlap = (groupId, done) => {
  database.findUsersInGroup(groupId, (err, users) => {
    const genres = [];
    const tracks = [];
    const artist = [];
     users.forEach((user) => {
      getValues(user, (err, prof) => {
          genres.push(prof.genres);
          tracks.push(prof.tracks);
          artist.push(prof.artist);
          if (genres.length === users.length) {
            //profiles.push(peter);
            genres.push(peter.genres);
            tracks.push(peter.tracks);
            artist.push(peter.artist);

            console.log(genres);
            const out = {};
            getIndividualOverlap(genres, (map, lap) => {
              out.genres = lap;
              getIndividualOverlap(artist, (map2, lap) => {
                out.artists = lap;
                getIndividualOverlap(tracks, (map3, lap4) => {
                  //out.tracks = map3;
                  out.tracks = lap4
                  //console.log(out);
                  done(err, out);
                });
              });
            });
            //const finished = { artists: userArtists, tracks: userTracks, genres };
          };
        });
      });
   });
};


exports.getValues = getValues;
exports.getOverlap = getOverlap;
