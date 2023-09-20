import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  ApolloLink,
} from "@apollo/client"
import { WebSocketLink } from "@apollo/link-ws"
import { getMainDefinition } from "@apollo/client/utilities"
import { setContext } from "@apollo/client/link/context"
import { createUploadLink } from "apollo-upload-client"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { onError } from "@apollo/client/link/error"
import { DirectMessage, MessageResult, MessageUnion } from "./src/gql/graphql"
loadDevMessages()
loadErrorMessages()

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}
// Auth link for setting the Authorization header
const authLink = setContext(async (_, { headers }) => {
  /// get cookie with key of __session
  const token = getCookie("__session")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: "ws://localhost:3001/graphql", // use ws or wss protocol
  options: {
    reconnect: true,
    connectionParams: async () => {
      const token = localStorage.getItem("clerk-db-jwt")
      return {
        Authorization: token ? `Bearer ${token}` : "",
      }
    },
  },
})

const uploadLink = createUploadLink({
  uri: "http://localhost:3001/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
})
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

// Use the main definition to split between HTTP and WebSocket links
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },

  wsLink,
  ApolloLink.from([errorLink, authLink, uploadLink])
)
const cache = new InMemoryCache()

const client = new ApolloClient({
  link: splitLink,
  cache,
  credentials: "include",
})

export default client
