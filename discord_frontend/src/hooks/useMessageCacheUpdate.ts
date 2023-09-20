import { useApolloClient, useSubscription } from "@apollo/client"
import {
  GetMessagesByConversationIdOrChannelIdQuery,
  MessageDeletedSubscription,
  MessageUnion,
  MessageUpdatedSubscription,
} from "../gql/graphql"
import { MESSAGE_DELETED } from "../graphql/subscriptions/MessageDeleted"
import { MESSAGE_UPDATED } from "../graphql/subscriptions/MessageUpdated"
import { useEffect } from "react"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"

export function useMessageCacheUpdate(
  messageId: number | undefined | null,
  conversationId?: number | undefined | null,
  channelId?: number | undefined | null
) {
  const { cache } = useApolloClient()

  const { data: dataMessageUpdated } =
    useSubscription<MessageUpdatedSubscription>(MESSAGE_UPDATED, {
      variables: { conversationId, channelId },
      skip: !conversationId && !channelId,
      onError: (error) => {
        console.log("ERROR69", error)
      },
    })

  const { data: dataMessageDeleted } =
    useSubscription<MessageDeletedSubscription>(MESSAGE_DELETED, {
      variables: { conversationId, channelId },
      skip: !conversationId && !channelId,
    })

  // handle cache update for message updated
  useEffect(() => {
    if (dataMessageUpdated?.messageUpdated?.message?.id === messageId) {
      const cachedData =
        cache.readQuery<GetMessagesByConversationIdOrChannelIdQuery>({
          query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
          variables: {
            conversationId: conversationId,
            channelId,
          },
        })

      const updatedMessages =
        cachedData?.getMessagesByConversationIdOrChannelId.messages
          ?.map((message) => {
            if (!message) return message // return the message itself (which might be undefined)
            return message.id ===
              dataMessageUpdated?.messageUpdated?.message?.id
              ? dataMessageUpdated?.messageUpdated.message
              : message
          })
          .filter(Boolean)

      if (updatedMessages) {
        cache.writeQuery<GetMessagesByConversationIdOrChannelIdQuery>({
          query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
          variables: {
            conversationId: conversationId,
            channelId,
          },
          data: {
            getMessagesByConversationIdOrChannelId: {
              messages: updatedMessages as MessageUnion[],
            },
          },
        })
      }
    }
  }, [dataMessageUpdated, cache, conversationId, messageId])

  // handle cache update for message deleted
  useEffect(() => {
    if (dataMessageDeleted?.messageDeleted?.message?.id === messageId) {
      const cachedData =
        cache.readQuery<GetMessagesByConversationIdOrChannelIdQuery>({
          query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
          variables: {
            conversationId: conversationId,
          },
        })
      if (cachedData?.getMessagesByConversationIdOrChannelId) {
        const updatedMessages =
          cachedData?.getMessagesByConversationIdOrChannelId.messages || []

        cache.writeQuery<GetMessagesByConversationIdOrChannelIdQuery>({
          query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
          variables: {
            conversationId: conversationId,
            channelId,
          },
          data: {
            getMessagesByConversationIdOrChannelId: {
              messages: updatedMessages,
            },
          },
        })
      }
    }
  }, [
    dataMessageDeleted?.messageDeleted.message,
    cache,
    conversationId,
    messageId,
    channelId,
  ])
}
