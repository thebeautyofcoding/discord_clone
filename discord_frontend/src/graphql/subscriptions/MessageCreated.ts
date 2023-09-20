import gql from "graphql-tag"
export const MESSAGE_CREATED = gql`
  subscription MessageCreated($conversationId: Float, $channelId: Float) {
    messageCreated(conversationId: $conversationId, channelId: $channelId) {
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
