import { ApolloProvider } from "@apollo/client"
import { SessionProvider, useSession } from "next-auth/react"
import { createApolloClient } from "../apolloClient"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  console.log("_PAGE!", session)
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={createApolloClient()}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  )
}
