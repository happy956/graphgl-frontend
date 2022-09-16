import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:8888/graphql",
    cache: new InMemoryCache({
        addTypename: false,
        shouldBatch: true,
    }),
})

export default client;