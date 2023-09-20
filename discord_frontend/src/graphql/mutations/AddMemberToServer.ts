import { gql } from "@apollo/client"

export const ADD_MEMBER_TO_SERVER = gql`
  mutation AddMemberToServer($inviteCode: String!, $serverId: Float!) {
    addMemberToServer(inviteCode: $inviteCode, serverId: $serverId) {
      id
      name
    }
  }
`
