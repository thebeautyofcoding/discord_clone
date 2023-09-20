import { useMutation, useQuery } from "@apollo/client"
import { GET_MEMBER_BY_PROFILE_ID } from "../graphql/queries/GetMemberByProfileId"
import { GET_OR_CREATE_CONVERSATION } from "../graphql/mutations/GetOrCreateConversation"
import { useParams } from "react-router-dom"
import { useProfileStore } from "../stores/profileStore"
import {
  GetMemberByIdQuery,
  GetMemberByIdQueryVariables,
  GetMemberByProfileIdQuery,
  GetMemberByProfileIdQueryVariables,
  GetOrCreateConversationMutation,
  GetOrCreateConversationMutationVariables,
} from "../gql/graphql"
import { useEffect } from "react"
export function useConversationData(memberId: number) {
  const { serverId } = useParams<{
    serverId: string
  }>()

  const profileId = useProfileStore((state) => state.user?.id)

  const { data: dataGetMemberByProfileId } = useQuery<
    GetMemberByProfileIdQuery,
    GetMemberByProfileIdQueryVariables
  >(GET_MEMBER_BY_PROFILE_ID, {
    variables: { profileId: profileId, serverId: Number(serverId) },
  })
  console.log(dataGetMemberByProfileId?.getMemberByProfileId.id, memberId)
  const [getOrCreateConversation, { data: conversationData }] = useMutation<
    GetOrCreateConversationMutation,
    GetOrCreateConversationMutationVariables
  >(GET_OR_CREATE_CONVERSATION, {
    variables: {
      input: {
        memberOneId: dataGetMemberByProfileId?.getMemberByProfileId?.id,
        memberTwoId: Number(memberId),
      },
      skip: !dataGetMemberByProfileId?.getMemberByProfileId.id || !memberId,
    },

    onError: (error) => {
      console.log(error)
    },
  })
  useEffect(() => {
    if (!dataGetMemberByProfileId?.getMemberByProfileId) return
    getOrCreateConversation()
  }, [
    getOrCreateConversation,
    memberId,
    profileId,
    dataGetMemberByProfileId?.getMemberByProfileId,
  ])

  return {
    dataGetMemberByProfileId,
    getOrCreateConversation,
    conversation: conversationData?.getOrCreateConversation,
  }
}
