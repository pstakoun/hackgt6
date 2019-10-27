const request = require('request');
const database = require('../services/database');
const spotify = require('../services/spotify');
const peter = require('../services/peter.json');

/*
const getLibParams = (user, done) => {
  const userArtists = [];
  const userTracks = [];
  const genres = [];
  const out = 'id';
  var option = { limit: 5 };
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
      for (var track in spotify.getArtistTracks(cur.items[i][out])) {
          userTracks.push(track.id);
      }
    }
    option = { limit: 50 };
    spotify.getTopTracks(user, option, (err, body) => {
      const cur = JSON.parse(body);
      for (let i = 0; i < cur.limit; i++) {
        if (userTracks.indexOf(cur.items[i][out]) === -1) {
          userTracks.push(cur.items[i][out]);
        }

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
          console.log(userTracks);

      const finished = { artist: userArtists, tracks: userTracks, genres };
      done(err, finished);
    });
}
*/

//todo ^MAKE WORK

const buildAverage = (user, songIds, out) => {
      spotify.getTrackFeat(user, songIds, arrayC => {
        let array = arrayC.audio_features;
        let info = {
           danceability: array.reduce((a,b) => a.danceability + b.danceability, 0) / array.length,
           energy: array.reduce((a,b) => a.energy + b.energy, 0) / array.length,
           loudness: array.reduce((a,b) => a.loudness + b.loudness, 0) / array.length,
           speechiness: array.reduce((a,b) => a.speechiness + b.speechiness, 0) / array.length,
           acousticness: array.reduce((a,b) => a.acousticness + b.acousticness, 0) / array.length,
           instrumentalness: array.reduce((a,b) => a.instrumentalness + b.instrumentalness, 0) / array.length,
           liveness: array.reduce((a,b) => a.liveness + b.liveness, 0) / array.length,
           valence: array.reduce((a,b) => a.valence + b.valence, 0) / array.length,
           tempo: array.reduce((a,b) => a.tempo + b.tempo, 0) / array.length
        };
        out(info);
      });
};


const getGroupAverage = (user, groupId, done) => {
  database.findUsersInGroup(groupId, (err, users) => {
    const group = {
       danceability: 0,
       energy: 0,
       loudness: 0,
       speechiness: 0,
       acousticness:  0,
       instrumentalness:  0,
       liveness:  0,
       valence: 0,
       tempo: 0
     }
     var count = 0;
    users.forEach((user) => {
      getValues(user, (err, prof) => {
        buildAverage(user, prof.tracks,  (err, body) => {
          group.danceability += body.danceability /users.length;
          group.energy += body.energy /users.length;
          group.loudness += body.loudness /users.length;
          group.speechiness += body.speechiness /users.length;
          group.acousticness += body.acousticness /users.length;
          group.instrumentalness += body.instrumentalness /users.length;
          group.liveness += body.liveness /users.length;
          group.valence += body.valence /users.length;
          group.tempo += body.tempo /users.length;
        if (count === users.length) {
          done(group);
        }
        count++;
    });
  });
});
});
};



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



/*
const predictValues = (user, done) => {
  getValues(user, (err, prof) => {

      const predictedTracks = prof.tracks;
      var opt = { seed_artists: '', seed_genres: '', seed_tracks: [] , limit : 70};
      var i = 0;
      for (; i < 5; i++) {
        opt.seed_tracks.push(body.tracks[i]);
      }
      opt.seed_tracks = opt.seed_tracks.join(',');
      spotify.getRecommendations(user, opt, (err, body) => {
        const opt = { seed_artists: '', seed_genres: '', seed_tracks: [] };




        res.json(predictedTracks);
      });

    });
};
*/
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
exports.getGroupAverage = getGroupAverage
