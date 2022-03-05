const fetch = require('node-fetch');

function errorMsg(error) {
  if (error) {
    const { status = '', message = 'no details' } = error;
    return `Error: ${status}: ${message}`;
  }
  return 'An unknown error!';
}

function throwExceptionOnError(data) {
  if (data.error) {
    throw new Error(errorMsg(data.error));
  }
}

const headers = {
  Accept: 'application/json',
  Authorization: '',
};

const client_credentials = require('./client_credentials');

let awaitingAuthorization;

// const spotifyProxy = async ()  => {
const spotifyProxy = () => {
  if (awaitingAuthorization && !client_credentials.isExpired()) {
    // use existing promise, if not expired
    return awaitingAuthorization;
  }
  if (!awaitingAuthorization || client_credentials.isExpired()) {
    awaitingAuthorization = new Promise((resolve, reject) => {
      client_credentials
        .authenticate()
        .then((token) => {
          headers.Authorization = 'Bearer ' + token.access_token;
          resolve(headers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return awaitingAuthorization;
};

const haveHeadersWithAuthToken = async () => {
  return await spotifyProxy();
};

module.exports.fetchArtistsByName = async (name) => {
  console.log(`debug: query artist ${name} `);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${name}&type=artist`,
    {
      headers: await haveHeadersWithAuthToken(),
    }
  );
  const data = await response.json();
  throwExceptionOnError(data);

  return (data.artists.items || []).map((artistRaw) =>
    spotifyJsonToArtist(artistRaw)
  );
};

module.exports.fetchPlaylistByName = async (name) => {
  console.log(`debug: query playlist ${name} `);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${name}&type=playlist`,
    {
      headers: await haveHeadersWithAuthToken(),
    }
  );
  const data = await response.json();
  throwExceptionOnError(data);

  return (data.playlists.items || []).map((playlistRaw) =>
    spotifyJsonToPlaylist(playlistRaw)
  );
};

module.exports.fetchPlaylistById = async (id) => {
  console.log(`debug: query playlist ${id} `);

  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: await haveHeadersWithAuthToken(),
  });
  const data = await response.json();
  throwExceptionOnError(data);

  data.tracks = data.tracks.items.map((trackRaw) =>
    spotifyJsonToTrack({
      ...trackRaw.track,
      added_at: readableDate(trackRaw.added_at),
    })
  );

  return spotifyJsonToPlaylistById(data);
};

const fetchAlbumsOfArtist = async (artistId, limit) => {
  console.log(`debug: query albums of artist ${artistId} `);

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      headers: await haveHeadersWithAuthToken(),
    }
  );
  const data = await response.json();
  throwExceptionOnError(data);

  return (data.items || []).map((albumRaw) => spotifyJsonToAlbum(albumRaw));
};

const fetchTracksOfPlaylist = async (playlistId, limit) => {
  console.log(`debug: query tracks of playlist ${playlistId} `);

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: await haveHeadersWithAuthToken(),
    }
  );
  const data = await response.json();
  throwExceptionOnError(data);

  return (data.items || []).map((trackRaw) =>
    // spotifyJsonToTrack(trackRaw.track)
    spotifyJsonToTrack({
      ...trackRaw.track,
      added_at: readableDate(trackRaw.added_at),
    })
  );
};

const fetchTracksOfAlbum = async (albumId, limit) => {
  console.log(`debug: query tracks of playlist ${albumId} `);

  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: await haveHeadersWithAuthToken(),
    }
  );
  const data = await response.json();
  throwExceptionOnError(data);

  return (data.items || []).map((trackRaw) => spotifyJsonToTrack(trackRaw));
};

module.exports.fetchAlbumsOfArtist = fetchAlbumsOfArtist;

const spotifyJsonToArtist = async (raw) => {
  return {
    // fills with raw data (by ES6 spread operator):
    ...raw,

    // This needs extra logic: defaults to an empty string, if there is no image
    // else: just takes URL of the first image
    image: raw.images[0] ? raw.images[0].url : '',

    // .. needs to fetch the artist's albums:
    albums: (args, object) => {
      // this is similar to fetchArtistsByName()
      // returns a Promise which gets resolved asynchronously !
      const artistId = raw.id;
      const { limit = 1 } = args;
      return fetchAlbumsOfArtist(artistId, limit);
    },
  };
};

const spotifyJsonToPlaylistById = async (raw) => {
  return {
    // fills with raw data (by ES6 spread operator):
    ...raw,

    // This needs extra logic: defaults to an empty string, if there is no image
    // else: just takes URL of the first image
    image: raw.images[0] ? raw.images[0].url : '',

    spotify_url: raw.external_urls.spotify,
    owner_name: raw.owner ? raw.owner.display_name : '',

    // .. needs to fetch the playlist's tracks:
    tracks: (args, object) => {
      // this is similar to fetchArtistsByName()
      // returns a Promise which gets resolved asynchronously !
      const playlistId = raw.id;
      const { limit = 1 } = args;
      return fetchTracksOfPlaylist(playlistId, limit);
    },
  };
};

const spotifyJsonToPlaylist = async (raw) => {
  return {
    // fills with raw data (by ES6 spread operator):
    ...raw,

    // This needs extra logic: defaults to an empty string, if there is no image
    // else: just takes URL of the first image
    image: raw.images[0] ? raw.images[0].url : '',

    spotify_url: raw.external_urls.spotify,
    owner_name: raw.owner ? raw.owner.display_name : '',

    // .. needs to fetch the playlist's tracks:
    tracks: (args, object) => {
      // this is similar to fetchArtistsByName()
      // returns a Promise which gets resolved asynchronously !
      const playlistId = raw.id;
      const { limit = 1 } = args;
      return fetchTracksOfPlaylist(playlistId, limit);
    },
  };
};

const spotifyJsonToAlbum = (albumRaw) => {
  return {
    // fills with raw data (by ES6 spread operator):
    ...albumRaw,

    // This needs extra logic: defaults to an empty string, if there is no image
    // else: just takes URL of the first image
    image: albumRaw.images[0] ? albumRaw.images[0].url : '',

    tracks: (args, object) => {
      // this is similar to fetchArtistsByName()
      // returns a Promise which gets resolved asynchronously !
      const albumId = albumRaw.id;
      const { limit = 1 } = args;
      return fetchTracksOfAlbum(albumId, limit);
    },
  };
};

const spotifyJsonToTrack = (trackRaw) => {
  return {
    // fills with raw data (by ES6 spread operator):
    ...trackRaw,

    // This needs extra logic: defaults to an empty string, if there is no image
    // else: just takes URL of the first image
    image:
      trackRaw.album && trackRaw.album.images[0]
        ? trackRaw.album.images[0].url
        : '',
    album_name: (trackRaw.album && trackRaw.album.name) || '',
    artist_name: (trackRaw.artists && trackRaw.artists[0].name) || '',

    // tracks: [] // TODO implement fetching of tracks of album
  };
};

const readableDate = (str) => {
  const date = new Date(str);

  return date.toDateString();
};
