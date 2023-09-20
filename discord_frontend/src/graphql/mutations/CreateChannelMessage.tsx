import { gql } from "@apollo/client"
export const CREATE_CHANNEL_MESSAGE = gql`
  mutation CreateChannelMessage(
    $input: CreateChannelMessageDto!
    $file: Upload
  ) {
    createChannelMessage(input: $input, file: $file) {
      # Fields you want to retrieve after creating the message, e.g.,
      id
      content

      # ... add other fields you want
    }
  }
`
