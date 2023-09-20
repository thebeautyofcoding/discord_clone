import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createApolloClient } from "../../../../../apolloClient"
import { CREATE_USER } from "@/graphql/mutations/CreateUser"
console.log("hmm123", process.env.GITHUB_ID, process.env.JWT_SECRET)
export const authOptions = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await createApolloClient().mutate({
          mutation: CREATE_USER,
          variables: {
            input: {
              name: user.name,

              email: user.email,
            },
          },
        })
        return true
      } catch (error) {
        console.error("Error creating user:", error)
        return false // Decide on how you want to handle this case
      }
    },
    async redirect(url, baseUrl) {
      return "/"
    },
    async session({ session, user }) {
      session.accessToken = user.accessToken
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (account && account.accessToken) {
        token.accessToken = account.accessToken
      }

      return token
    },
  },
}
