import { gql } from "@apollo/client"

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage(
    $messageId: Float!
    $conversationId: Float
    $channelId: Float
  ) {
    deleteMessage(
      messageId: $messageId
      conversationId: $conversationId
      channelId: $channelId
    ) {
      message {
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
