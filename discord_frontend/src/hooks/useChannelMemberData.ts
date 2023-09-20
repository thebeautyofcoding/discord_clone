import { useParams } from "react-router-dom"
import { useProfileStore } from "../stores/profileStore"
import { GetMemberByProfileIdQuery } from "../gql/graphql"
import { GET_MEMBER_BY_PROFILE_ID } from "../graphql/queries/GetMemberByProfileId"
import { useQuery } from "@apollo/client"

export function useMemberData() {
  const profileId = useProfileStore((state) => state.user?.id)
  const { serverId } = useParams<{ serverId: string }>()

  const { data: dataMemberByProfileId, ...queryProps } =
    useQuery<GetMemberByProfileIdQuery>(GET_MEMBER_BY_PROFILE_ID, {
      variables: {
        profileId,
        serverId: Number(serverId),
      },
      skip: !profileId,
    })

  return {
    profileId,
    serverId: Number(serverId),
    member: dataMemberByProfileId?.getMemberByProfileId,
    ...queryProps,
  }
}
