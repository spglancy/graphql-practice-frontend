import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: "https://graphql-todo-app-practice.herokuapp.com/graphql",
  onError: ({ networkError, graphQLErrors }) => {
    graphQLErrors.forEach(err => {
      console.log(err)
    })
    console.log('networkError', networkError)
  }
});