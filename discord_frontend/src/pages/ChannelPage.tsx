import ChatWindow from "../components/chat/ChatWindow"

import { useParams } from "react-router-dom"

import { ChannelType } from "../gql/graphql"

function ChannelPage() {
  const { channelId, channelType } = useParams<{
    channelId: string
    channelType: ChannelType
  }>()

  if (!channelId) return null
  if (!channelType) return null
  return (
    <ChatWindow
      chatName={channelId}
      chatType="channel"
      channelType={channelType}
    />
  )
}

export default ChannelPage
