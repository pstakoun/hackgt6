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

      const finished = { artists: userArtists, tracks: userTracks, genres };
      done(err, finished);
    });
  });
};

const getIndividualOverlap = (groupArr, done) => {
    let total = groupArr[0];
    let mapping = {};
    for(var i = 1; i < group.length - 1; i++) {
       total = total.filter(x => groupArr[i].includes(x));
         for(let val in total){
           if (mapping.contains(val)) {
              mapping[val]++;
           } else {
              mapping[val] = 1;
           }
         }
    }
    done(mapping, total);
};





const getOverlap = (group, done) => {
  database.findUsersInGroup(group._id, (err, users) => {
    const profiles = []
     users.forEach((user) => {
      getValues(user, (err, prof) => {
          profiles.push(prof);
          if (profiles.length === users.length) {
            profiles.push(peter);

            const out = {};
            getIndividualOverlap(profiles[genres], (map, lap) => {
              out[genres] = map;
              getIndividualOverlap(profiles[artist], (map, lap) => {
                out[genres] = map;
                getIndividualOverlap(profiles[tracks], (map, lap) => {
                  out[tracks] = map;
                  out[tracksAdd] = lap
                  done(err, out);
                };
              };
            };
            //const finished = { artists: userArtists, tracks: userTracks, genres };
          };
        });
      });
   });
};




const getGrouping = (group, done) => {
  opt = {"}; //priority queue on data from getOverlap
  getOverlap(group, out => {

  });
}; //return an opt and a list of tracks.

exports.getValues = getValues;
