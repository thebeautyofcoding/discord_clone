import { useApolloClient, useSubscription } from "@apollo/client"
import {
  GetMessagesByConversationIdOrChannelIdQuery,
  GetMessagesByConversationIdOrChannelIdQueryVariables,
  MessageCreatedSubscription,
  MessageCreatedSubscriptionVariables,
} from "../gql/graphql"
import { MESSAGE_CREATED } from "../graphql/subscriptions/MessageCreated"
import React from "react"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"
import { useParams } from "react-router-dom"
import { parse } from "path"

export const useMessageCreatedSubscription = () => {
  const { cache } = useApolloClient()
  const { conversationId: convId, channelId: channId } = useParams<{
    conversationId?: string
    channelId?: string
  }>()
  console.log(convId, channId)
  const conversationId = convId !== undefined ? parseInt(convId) : null
  const channelId = channId !== undefined ? parseInt(channId) : null

  const { data: dataMessageCreated } = useSubscription<
    MessageCreatedSubscription,
    MessageCreatedSubscriptionVariables
  >(MESSAGE_CREATED, {
    variables: {
      conversationId,
      channelId,
    },

    onError: (error) => {
      console.log(error)
    },
  })

  React.useEffect(() => {
    const newMessage = dataMessageCreated?.messageCreated

    const cachedData =
      cache.readQuery<GetMessagesByConversationIdOrChannelIdQuery>({
        query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
        variables: {
          conversationId,
          channelId,
        },
      })
    console.log(cachedData)
    if (
      cachedData &&
      newMessage &&
      cachedData.getMessagesByConversationIdOrChannelId.messages
    ) {
      if (newMessage.message) {
        // make sure each message in the cache is unique
        const updatedMessages = [
          ...cachedData.getMessagesByConversationIdOrChannelId.messages,
          newMessage.message,
        ]

        console.log(
          updatedMessages,
          cachedData.getMessagesByConversationIdOrChannelId.messages
        )
        try {
          console.log(Number(conversationId), Number(channelId))
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
        } catch (err) {
          console.log(err)
        }
      }
    }
    console.log(
      cache.readQuery<GetMessagesByConversationIdOrChannelIdQuery>({
        query: GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID,
        variables: {
          conversationId,
          channelId,
        },
      })
    )
  }, [
    dataMessageCreated?.messageCreated.message,
    dataMessageCreated?.messageCreated?.message?.id,
    conversationId,
    cache,
    channelId,
    dataMessageCreated?.messageCreated,
  ])

  return dataMessageCreated?.messageCreated.message
}
