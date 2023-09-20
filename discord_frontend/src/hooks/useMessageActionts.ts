import { useMutation } from "@apollo/client"
import { DirectMessage, Message } from "../gql/graphql"
import { useMessageStore } from "../stores/messageStore"
import useModal from "./useModal"
import { DELETE_MESSAGE } from "../graphql/mutations/DeleteMessage"
import { useParams } from "react-router-dom"
import { channel } from "diagnostics_channel"

export function useMessageActions(message: Message | DirectMessage) {
  const updateMessageModal = useModal("UpdateMessage")
  const setMessage = useMessageStore((state) => state.setMessage)
  const { channelId, conversationId } = useParams<{
    channelId: string
    conversationId: string
  }>()

  const [deleteMessageMutation] = useMutation(DELETE_MESSAGE, {
    variables: {
      messageId: message.id,
      conversationId: Number(conversationId),

      channelId: Number(channelId),
    },
  })

  const handleUpdateMessage = () => {
    updateMessageModal.openModal()
    setMessage(message)
  }

  const handleDeleteMessage = () => {
    deleteMessageMutation()
  }

  return { handleUpdateMessage, handleDeleteMessage }
}
