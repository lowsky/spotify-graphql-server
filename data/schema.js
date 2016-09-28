import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root of all evals. :)',
    fields: {
        helloWorld: {
            type: GraphQLString,
            description: 'Hello!',
            resolve: () => {
                return 'Hello world.';
            }
        }
    },
});

const schema = new GraphQLSchema({
    query: QueryType,
});

export default schema;
