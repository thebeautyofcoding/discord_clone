import { gql } from "@apollo/client"

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage(
    $messageId: Float!
    $content: String!
    $conversationId: Float
    $channelId: Float
  ) {
    updateMessage(
      messageId: $messageId
      content: $content
      conversationId: $conversationId
      channelId: $channelId
    ) {
      message {
        ... on DirectMessage {
          content
          updatedAt
        }
        ... on Message {
          content
          updatedAt
        }
      }
    }
  }
`
