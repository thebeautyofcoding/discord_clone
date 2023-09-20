import styles from "./page.module.css"
import { Button, Text } from "@mantine/core"
import { getServerSession } from "next-auth"
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { authOptions } from "./(auth)/api/auth/[...nextauth]/auth"
export default  function Home() {
  const session =  getSession(authOptions)
  console.log("session!!!", session)
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}
