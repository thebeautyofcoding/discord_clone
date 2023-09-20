import { useEffect } from "react"
import { useProfileStore } from "../stores/profileStore"
import { useMutation } from "@apollo/client"
import { CREATE_ACCESS_TOKEN } from "../graphql/mutations/CreateAccessToken"

export const useLivekitAccessToken = (chatId: string) => {
  const name = useProfileStore((state) => state.user?.name)
  const [createToken, { data: dataCreateAccessToken, loading }] = useMutation(
    CREATE_ACCESS_TOKEN,
    {
      variables: {
        name: name,
        chatId: chatId,
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )
  console.log(dataCreateAccessToken)
  useEffect(() => {
    createToken()
  }, [createToken, chatId, name])
  return {
    token: dataCreateAccessToken?.createAccessToken,
    loading,
  }
}
