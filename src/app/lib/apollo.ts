import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/apollo-server", // The URL to your GraphQL API route
  cache: new InMemoryCache(),
});

export default client;
