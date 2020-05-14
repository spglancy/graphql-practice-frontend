import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: "http://localhost:4000/graphql",
  onError: ({ networkError, graphQLErrors }) => {
    graphQLErrors.forEach(err => {
      console.log(err)
    })
    console.log('networkError', networkError)
  }
});