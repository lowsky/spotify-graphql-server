import {
    GraphQLSchema,
    GraphQLObjectType as ObjectType,
    GraphQLNonNull as NonNull,
    GraphQLString as StringType,
} from 'graphql';

const echo = {
    type: StringType,
    description: 'Just a simple echo.',
    args: {
        message: {
            type: new NonNull(StringType)
        }
    },
    resolve: (root, args) => {
        return args.message;
    }
};

const QueryType = new ObjectType({
    name: 'Query',
    description: 'Root of all evals. :)',
    fields: {
        echo: echo,
    },
});

const schema = new GraphQLSchema({
    query: QueryType,
});

export default schema;
