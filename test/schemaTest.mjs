import { mockServer } from "@graphql-tools/mock";

import { schema } from "../data/schema.mjs";

let cnt = 0;

const simpleMockServer = mockServer(schema, {
    String: () => `name ${cnt++}`,
    Query: () => ({
        queryArtists: (args) =>
            ([{
                name: `Famous Artist: ${args.byName}`
            }]),
    }),
    Album: () => ({
        name: 'An album with a boring title'
    })
});

const result = simpleMockServer.query(`{
    queryArtists(byName: "Queen") {
        name
        albums {
            name
            tracks {
                name
            }
        }
    }
}`);

try {
    console.log('GraphQL result:');
    console.log(JSON.stringify(await result, '  ', 1));
} catch (error) {
    console.log('error: ', error);
}
