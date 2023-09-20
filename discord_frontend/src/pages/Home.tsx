import { useEffect } from "react"
import { CREATE_PROFILE } from "../graphql/mutations/CreateProfile"
import { useProfileStore } from "../stores/profileStore"

import { useMutation } from "@apollo/client"
import { CreateProfileMutation } from "../gql/graphql"

import { useSession } from "@clerk/clerk-react"

function Home() {
  const user = useProfileStore((state) => state.user)
  const { session } = useSession()

  const [createProfile] = useMutation<CreateProfileMutation>(CREATE_PROFILE)
  const setUser = useProfileStore((state) => state.setUser)

  useEffect(() => {
    // User doesn't exist in the backend, so create them
    const createProfileFn = async () => {
      try {
        await createProfile({
          variables: {
            input: {
              email: session?.user.emailAddresses[0].emailAddress, // adjust as per your requirements
              name: session?.user.username, // adjust as per your requirements
              imageUrl: session?.user.imageUrl, // adjust as per your requirements
            },
            skip: !session?.user.emailAddresses[0].emailAddress,
          },
          onCompleted: (data) => {
            setUser(data.createProfile)
          },
        })
      } catch (error) {
        console.error("Error creating user in backend:", error)
      }
    }
    if (user?.id) return
    createProfileFn()
  }, [session, setUser, user?.email, user?.imageUrl, user?.name, createProfile])

  return <></>
}

export default Home
