/**
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */
const fetch = require('node-fetch');

require('dotenv').config()

const {
    CLIENT_ID = 'invalid',
    CLIENT_SECRET = 'invalid'
} = process.env;

const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    }
};

let expireTime = 0;

module.exports = {
    isExpired: () => {
        if(expireTime) {
            return Date.now() > expireTime;
        }
        return false;
    },
    authenticate: () => {
        const Authorization64 = new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json",
                'Authorization': `Basic ${Authorization64}`
            },
            method: 'POST',
            body: 'grant_type=client_credentials'
        };
        return fetch(authOptions.url, options)
            .then((response) => {
                return response.json();
            })
            .then(token => {
                const time = Date.now();
                const expires_in = Number.parseInt(token.expires_in, 10);
                expireTime = time + expires_in * 1000;
                return token;
            });
    }
};
