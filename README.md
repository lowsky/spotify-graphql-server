# spotify-graphql-server

[![Greenkeeper badge](https://badges.greenkeeper.io/lowsky/spotify-graphql-server.svg)](https://greenkeeper.io/)
This demonstrates how to build a GraphQL server which fetches data from an external API (Spotify),
see [german blog post](https://blog.codecentric.de/2017/09/graphql-mit-spotify-teil-1-server) or
 [english blog post](https://blog.codecentric.de/en/2017/01/lets-build-spotify-graphql-server)

**NOTE:** Sorry, but this demo **is currently broken**, because of Spotify closed their the access to their data per API, and needs an oauth token on each request, see
https://github.com/lowsky/spotify-graphql-server/issues/42 and [spotify announcement](http://developer.spotify.com/news-stories/2017/01/27/removing-unauthenticated-calls-to-the-web-api)

Use the [Live Demo](https://spotify-graphql-server.herokuapp.com/) as a playground for graphql queries.

For running this example locally, you need to adapt the [./.env.example] file (see there).
