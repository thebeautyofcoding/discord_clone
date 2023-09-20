import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getSession } from "next-auth/react"
import { onError } from "@apollo/client/link/error"
import { NextPageContext } from "next"

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
  credentials: "include",
})

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession()
  console.log("session69", session)
  const token = session?.accessToken

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQL Errors:", graphQLErrors)
  }
  if (networkError) {
    console.log("Network Errors:", networkError)
  }
})

export function createApolloClient(ctx?: NextPageContext) {
  const enhancedLink = authLink.concat(httpLink)

  const clientLink = createHttpLink({
    uri: "http://localhost:3001/graphql",
    credentials: "include",
    fetch: (input: RequestInfo, init?: RequestInit) => {
      if (ctx) {
        init!.headers = {
          ...init!.headers,
          cookie: ctx.req?.headers.cookie,
        }
      }
      return fetch(input, init)
    },
  })

  return new ApolloClient({
    link: errorLink.concat(clientLink),
    cache: new InMemoryCache(),
  })
}
