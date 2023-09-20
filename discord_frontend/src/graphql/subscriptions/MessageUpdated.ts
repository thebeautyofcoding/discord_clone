import gql from "graphql-tag"

export const MESSAGE_UPDATED = gql`
  subscription MessageUpdated($conversationId: Float, $channelId: Float) {
    messageUpdated(conversationId: $conversationId, channelId: $channelId) {
      message {
        ... on DirectMessage {
          id
          content
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
