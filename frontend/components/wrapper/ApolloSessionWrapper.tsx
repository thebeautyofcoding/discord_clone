import { ApolloProvider } from "@apollo/client"
import { useSession } from "next-auth/react"
import { client } from "@/apolloClient" // Modify this path as needed
import { SessionContext } from "@/context/sessionContext"

const ApolloSessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const [session, loading] = useSession()

  if (loading) return <p>Loading...</p>

  return (
    <SessionContext.Provider value={session}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionContext.Provider>
  )
}

export default ApolloSessionWrapper
