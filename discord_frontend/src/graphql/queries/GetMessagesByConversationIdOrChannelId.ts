import { gql } from "@apollo/client"

export const GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID = gql`
  query GetMessagesByConversationIdOrChannelId(
    $conversationId: Float
    $channelId: Float
  ) {
    getMessagesByConversationIdOrChannelId(
      conversationId: $conversationId
      channelId: $channelId
    ) {
      messages {
        ... on DirectMessage {
          id

          content
          deleted
          createdAt
          conversationId
          fileUrl
          member {
            role
            id
            profileId
            profile {
              email
              id
              name
              imageUrl
            }
          }
        }

        ... on Message {
          id
          content
          deleted
          createdAt
          fileUrl
          channel {
            id
          }
          member {
            role
            id
            profileId
            profile {
              email
              id
              name
              imageUrl
            }
          }
        }
      }
    }
  }
`
