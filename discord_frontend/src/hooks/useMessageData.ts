import { useMutation, useQuery } from "@apollo/client"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"

import { CREATE_MESSAGE } from "../graphql/mutations/CreateMessage"
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  GetMessagesByConversationIdOrChannelIdQuery,
  GetMessagesByConversationIdOrChannelIdQueryVariables,
} from "../gql/graphql"
import { useParams } from "react-router-dom"
export function useMessageData() {
  const [createMessage] = useMutation<
    CreateMessageMutation,
    CreateMessageMutationVariables
  >(CREATE_MESSAGE)
  const {
    memberId: membId,
    channelId: chanId,
    conversationId,
  } = useParams<{
    memberId: string
    conversationId: string
    channelId: string
  }>()
  const memberId = Number(membId)
  const channelId = Number(chanId)
  const { data: dataGetMesagesByConversationIdOrCHannelId } = useQuery<
    GetMessagesByConversationIdOrChannelIdQuery,
    GetMessagesByConversationIdOrChannelIdQueryVariables
  >(GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID, {
    variables: {
      conversationId: Number(conversationId),
      channelId: Number(channelId),
    },
  })

  return {
    memberId,
    channelId,
    createMessage,
    messages:
      dataGetMesagesByConversationIdOrCHannelId
        ?.getMessagesByConversationIdOrChannelId.messages || [],
  }
}
