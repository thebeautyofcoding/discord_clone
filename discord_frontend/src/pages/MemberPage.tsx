import { useMutation, useQuery } from "@apollo/client"
import React, { useEffect } from "react"
import { Outlet, useParams } from "react-router-dom"
import { GET_OR_CREATE_CONVERSATION } from "../graphql/mutations/GetOrCreateConversation"
import { useProfileStore } from "../stores/profileStore"
import { GET_MEMBER_BY_ID } from "../graphql/queries/GetMemberById"
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  GetMemberByProfileIdQuery,
  GetMessagesByConversationIdOrChannelIdQuery,
  GetOrCreateConversationMutation,
  GetOrCreateConversationMutationVariables,
} from "../gql/graphql"
import ChatWindow from "../components/chat/ChatWindow"
import { GET_MEMBER_BY_PROFILE_ID } from "../graphql/queries/GetMemberByProfileId"
import { GET_MESSAGES_BY_CONVERSATION_ID_OR_CHANNEL_ID } from "../graphql/queries/GetMessagesByConversationIdOrChannelId"
import { CREATE_MESSAGE } from "../graphql/mutations/CreateMessage"
import { useMemberData } from "../hooks/useChannelMemberData"
import { useMessageData } from "../hooks/useMessageData"

function MemberPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  if (!conversationId) return null
  return (
    <>
      <Outlet />
      <ChatWindow chatName={conversationId} chatType="conversation" />
    </>
  )
}

export default MemberPage
