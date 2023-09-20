import { gql } from "@apollo/client"

export const CREATE_ACCESS_TOKEN = gql`
  mutation CreateAccessToken($name: String!, $chatId: String!) {
    createAccessToken(name: $name, chatId: $chatId)
  }
`
