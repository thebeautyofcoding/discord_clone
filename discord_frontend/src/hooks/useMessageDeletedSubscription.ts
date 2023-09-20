import { useApolloClient, useSubscription } from "@apollo/client"
import { useParams } from "react-router-dom"
import { MESSAGE_DELETED } from "../graphql/subscriptions/MessageDeleted" // Import your subscription
import { GetMessagesByConversationIdOrChannelIdQuery } from "../gql/graphql"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"
import React from "react"

export const useMessageDeletedSubscription = () => {
  const { cache } = useApolloClient()
  const { conversationId: convId, channelId: channId } = useParams<{
    conversationId?: string
    channelId?: string
  }>()

  const conversationId = convId !== undefined ? parseInt(convId) : null
  const channelId = channId !== undefined ? parseInt(channId) : null

  const { data: dataMessageDeleted } = useSubscription(
    MESSAGE_DELETED, // Use the new subscription
    {
      variables: {
        conversationId,
        channelId,
      },
    }
  )

  // update cache
  React.useEffect(() => {
    const deletedMessage = dataMessageDeleted?.messageDeleted?.message
    console.log("deletedMessage", deletedMessage)
    const cachedData =
      cache.readQuery<GetMessagesByConversationIdOrChannelIdQuery>({
        query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
        variables: {
          conversationId,
          channelId,
        },
      })
    if (cachedData && deletedMessage) {
      const updatedMessages =
        cachedData?.getMessagesByConversationIdOrChannelId?.messages?.map(
          (message) => {
            if (!message) return message
            return message.id === deletedMessage.id ? deletedMessage : message
          }
        )

      if (updatedMessages) {
        cache.writeQuery<GetMessagesByConversationIdOrChannelIdQuery>({
          query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
          variables: {
            conversationId,
            channelId,
          },
          data: {
            getMessagesByConversationIdOrChannelId: {
              messages: updatedMessages,
            },
          },
          overwrite: true,
        })
      }
    }
  }, [dataMessageDeleted, cache, conversationId, channelId])

  return dataMessageDeleted?.messageDeleted.message
}
