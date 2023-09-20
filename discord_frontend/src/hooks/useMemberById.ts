import { useQuery } from "@apollo/client"
import { GetMemberByIdQuery } from "../gql/graphql"
import { GET_MEMBER_BY_ID } from "../graphql/queries/GetMemberById"
import { useParams } from "react-router-dom"

export const useMemberById = () => {
  const { memberId, serverId } = useParams()
  const { data } = useQuery<GetMemberByIdQuery>(GET_MEMBER_BY_ID, {
    variables: {
      memberId: Number(memberId),
      serverId: Number(serverId),
    },
    skip: !memberId,
  })

  return data?.getMemberById
}
