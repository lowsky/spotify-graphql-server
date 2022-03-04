let {
    buildSchema
} = require('graphql');

const schema = buildSchema(`
# The root of all queries:

type Query {
  # Just returns "Hello world!"
  hi(message: String = "Hi"): String
  queryArtists(byName: String = "Red Hot Chili Peppers"): [Artist]
  queryPlaylists(byPlaylistName: String = "Albatross"): [Playlist]
  queryIndividualPlaylist(byPlaylistId: String = "0FzPhBWC2VvP9jl8GnJTEYdfga"): Playlist
}
type Artist {
  name: String!
  id: ID
  image: String
  albums(limit: Int = 10): [Album]
}
type Album {
  name: String
  id: ID
  image: String
  tracks: [Track]
}
type Playlist {
  name: String
  id: ID
  image: String
  description: String
  spotify_url: String
  owner_name: String
  tracks: [Track]
}
type Track {
  name: String!
  preview_url: String
  id: ID
  image: String
  album_name: String
  added_at: String
  artist_name: String
}
`);

module.exports = schema;
