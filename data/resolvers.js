import fetch from 'node-fetch';


const { SPOTIFY_TOKEN } = process.env;
const headers = {
    "Accept": "application/json",
    "Authorization": "Bearer BQBg2HM1QmP0KXQN..."
};


headers.Authorization = "Bearer " + SPOTIFY_TOKEN;

export const fetchArtistsByName = (name) => {
    console.log(`debug: query artist ${name} `);
    return fetch(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
            headers
            })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data.artists.items || [];
        })
        .then((data) => {
            return data.map(artistRaw => spotifyJsonToArtist(artistRaw));
        });
};

export const fetchAlbumsOfArtist = (artistId, limit) => {
    console.log(`debug: query albums of artist ${artistId} `);

    return fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    method: 'GET',
    headers: headers
})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data.items || [];
        })
        .then((albumData) => {
            return albumData.map(albumRaw => spotifyJsonToAlbum(albumRaw));
        });
};

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