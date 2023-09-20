import ChatMessage from "./ChatMessage"

import { MessageUnion } from "../../gql/graphql"

import { useParams } from "react-router-dom"
import { ScrollArea, Stack } from "@mantine/core"
import WelcomeMessage from "./WelcomeMessage"

import { useChannelById } from "../../hooks/useChannelById"
import { useMemberById } from "../../hooks/useMemberById"

import { useScrollToBottom } from "../../hooks/useScrollToBottom"

import { useSmallerThanLarge } from "../../hooks/useSmallerThanLarge"

function ChatMessages({
  conversationId,
  channelId,
  messages,
}: {
  conversationId?: number
  channelId?: number
  messages: MessageUnion[]
}) {
  const channel = useChannelById(Number(channelId))
  const member = useMemberById()

  const viewport = useScrollToBottom({
    dependency: messages.length,
  })
  const isSmallerThanLarge = useSmallerThanLarge()
  return (
    <Stack p="md" w="100%">
      <ScrollArea
        h={
          channel?.name === "general" && isSmallerThanLarge
            ? "calc(100vh - 280px)"
            : "calc(100vh - 280px)"
        }
        viewportRef={viewport}
      >
        {member?.profile?.name && (
          <WelcomeMessage type={"conversation"} name={member?.profile?.name} />
        )}
        {channel?.name && (
          <WelcomeMessage type={"channel"} name={channel.name} />
        )}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollArea>
    </Stack>
  )
}

export default ChatMessages
