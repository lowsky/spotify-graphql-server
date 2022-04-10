# spotify-graphql-server

This demonstrates how to build a GraphQL server which fetches data from an external API (Spotify),
see [german blog post](https://blog.codecentric.de/2017/09/graphql-mit-spotify-teil-1-server) or
 [english blog post](https://blog.codecentric.de/en/2017/01/lets-build-spotify-graphql-server)

Use the [Live Demo](https://spotify-graphql-server.herokuapp.com/) as a playground for graphql queries.

## Get started

### prerequisites

For running this example locally, you must 
[register your own application at spotify](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/).
Then create an [.env](./.env) file with the generated token, based on the example [.env.example](./.env.example) file.

Have a modern `node.js` version ( >=14 ) installed.

Run `yarn install`. 

### run server

`yarn start` to start the graphql server, then open http://localhost:4000/

`yarn watch` to start the graphql server which automatically restarts when any sources were changed (driven by `nodemon`)

### run tests

`yarn test`

### print GraphQL schema idl

`yarn run printSchema`