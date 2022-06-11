import { GraphQLClient } from 'graphql-request';
const { GRAPHCMS_URL, GRAPHCMS_PERMANENTAUTH_TOKEN } = process.env;

const client = new GraphQLClient(GRAPHCMS_URL, {
  headers: {
    Authorization: `Bearer ${GRAPHCMS_PERMANENTAUTH_TOKEN}`,
  },
});
export default client;
