import { GraphQLClient } from 'graphql-request';
const { HYGRAPH_URL, HYGRAPH_PERMANENTAUTH_TOKEN } = process.env;

const client = new GraphQLClient(HYGRAPH_URL, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`,
  },
});
export default client;
