import { useQuery } from "@apollo/client"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"
import { GetMessagesByConversationIdOrChannelIdQuery } from "../gql/graphql"
import { useParams } from "react-router-dom"
import { onError } from "@apollo/client/link/error"

export const useMessagesByConversationIdOrChannelId = () => {
  const { channelId, conversationId, memberId } = useParams<{
    memberId: string
    channelId: string
    conversationId: string
  }>()
  console.log(conversationId, channelId)
  const { data } = useQuery<GetMessagesByConversationIdOrChannelIdQuery>(
    GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
    {
      variables: {
        conversationId: Number(conversationId),
        channelId: Number(channelId),
      },
      skip: !conversationId && !channelId,
      onError: (error) => {
        console.log(error)
      },
    }
  )

  console.log(data, memberId, channelId, conversationId)
  return data?.getMessagesByConversationIdOrChannelId.messages || []
}
