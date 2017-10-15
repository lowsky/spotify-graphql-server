const fetch = require ('node-fetch');

function errorMsg (error) {
    if (error) {
        const { status = '', message = 'no details' } = error;
        return `Error: ${status}: ${message}`;
    }
    return 'An unknown error!'
}

function throwExceptionOnError (data) {
    if (data.error) {
        throw new Error(errorMsg(data.error));
    }
}


const { SPOTIFY_TOKEN } = process.env;
const headers = {
    'Accept': 'application/json',
    'Authorization': ''
};

headers.Authorization = "Bearer " + SPOTIFY_TOKEN;

module.exports.fetchArtistsByName = (name) => {
    console.log(`debug: query artist ${name} `);
    return fetch(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
        headers
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            throwExceptionOnError(data);
            return data.artists.items || [];
        })
        .then((data) => {
            return data.map(artistRaw => spotifyJsonToArtist(artistRaw));
        });
};

const fetchAlbumsOfArtist = (artistId, limit) => {
    console.log(`debug: query albums of artist ${artistId} `);

    return fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        method: 'GET',
        headers: headers
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            throwExceptionOnError(data);
            return data.items || [];
        })
        .then((albumData) => {
            return albumData.map(albumRaw => spotifyJsonToAlbum(albumRaw));
        });
};
module.exports.fetchAlbumsOfArtist = fetchAlbumsOfArtist;

const spotifyJsonToArtist = (raw) => {
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
            const { limit=1 } = args;
            return fetchAlbumsOfArtist(artistId, limit);
        }
    };
};

const spotifyJsonToAlbum = (albumRaw) => {
    return {
        // fills with raw data (by ES6 spread operator):
        ...albumRaw,

        // This needs extra logic: defaults to an empty string, if there is no image
        // else: just takes URL of the first image
        image: albumRaw.images[0] ? albumRaw.images[0].url : '',

        tracks: [] // TODO implement fetching of tracks of album
    };
};