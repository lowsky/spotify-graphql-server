import {
    buildSchema
} from 'graphql';

const schema = buildSchema(`
# The root of all queries:

type Query {
  # Just returns "Hello world!"
  hi(message: String = "Hi"): String
}
`);

export default schema;
