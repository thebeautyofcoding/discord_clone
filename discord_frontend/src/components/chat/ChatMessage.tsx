import React, { useEffect } from "react"
import {
  ChannelType,
  DirectMessage,
  GetMemberByProfileIdQuery,
  GetMessagesByConversationIdQuery,
  GetProfileByIdQuery,
  MemberRole,
  Message,
  MessageDeletedSubscription,
  MessageUnion,
  MessageUpdatedSubscription,
} from "../../gql/graphql"
import { Box, Button, Flex, Image, Text, TextInput, rem } from "@mantine/core"
import {
  IconCrown,
  IconEdit,
  IconShieldCheck,
  IconTrash,
} from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { MESSAGE_CREATED } from "../../graphql/subscriptions/MessageCreated"
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import { useProfileStore } from "../../stores/profileStore"
import { GET_MEMBER_BY_PROFILE_ID } from "../../graphql/queries/GetMemberByProfileId"
import { useParams } from "react-router-dom"
import { DELETE_MESSAGE } from "../../graphql/mutations/DeleteMessage"
import { MESSAGE_DELETED } from "../../graphql/subscriptions/MessageDeleted"

import { GET_MESSAGES_BY_CONVERSATION_ID } from "../../graphql/queries/GetMessagesByConversationIdOrChannelId"
import { UPDATE_MESSAGE } from "../../graphql/mutations/UpdateMessage"
import { useForm } from "@mantine/form"
import useModal from "../../hooks/useModal"
import UpdateMessageModal from "../modals/UpdateMessageModal"
import { useMessageStore } from "../../stores/messageStore"
import { MESSAGE_UPDATED } from "../../graphql/subscriptions/MessageUpdated"
import MessageActions from "./MessageActions"
import { useMessageRole } from "../../hooks/useMessageRole"
import { useMessageCacheUpdate } from "../../hooks/useMessageCacheUpdate"
import { useMessageActions } from "../../hooks/useMessageActionts"
import { useMemberData } from "../../hooks/useChannelMemberData"
import { useSmallerThanLarge } from "../../hooks/useSmallerThanLarge"

function ChatMessage({ message }: { message: MessageUnion }) {
  const IconRoleMap = {
    [MemberRole.Guest]: null,
    [MemberRole.Moderator]: <IconShieldCheck />,
    [MemberRole.Admin]: <IconCrown color="green" />,
  }
  const { profileId, serverId } = useMemberData()
  const { canDeleteMessage, canUpdateMessage } = useMessageRole(
    message,
    profileId,
    serverId
  )
  const { memberId, channelId, channelType } = useParams<{
    memberId: string
    channelId: string
    channelType: string
  }>()
  useMessageCacheUpdate(Number(memberId), message?.id, Number(channelId))
  const { handleUpdateMessage, handleDeleteMessage } =
    useMessageActions(message)
  const isSmallerThanLarge = useSmallerThanLarge()
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[4],
        padding: theme.spacing.md,
        margin: "0px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[5],
        },
        "&:active": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[6],
        },
      })}
    >
      <Flex w="100%" justify={"space-between"}>
        <Flex align={"center"} w="100%" justify={"space-evenly"}>
          <Image
            mr="sm"
            src={message.member?.profile?.imageUrl || null}
            width={rem(30)}
            height={rem(30)}
            radius={rem(30)}
          />
          <Flex direction={"column"} w="100%">
            <Flex justify={"start"} align="center">
              <Text fw={700}>{message.member?.profile?.name}</Text>
              <Flex ml="sm" align="center">
                {message.member?.role && IconRoleMap[message.member?.role]}
              </Flex>
              <Text
                ml="sm"
                c="dimmed"
                size="sm"
                truncate
                w={
                  isSmallerThanLarge && channelType !== ChannelType.Text
                    ? "30px"
                    : "100%"
                }
              >
                <>
                  {message?.createdAt &&
                    !message.updatedAt &&
                    new Date(Number(message?.createdAt)).toLocaleString()}
                  {message.updatedAt &&
                    new Date(Number(message.updatedAt)).toLocaleString()}
                </>
              </Text>
            </Flex>

            {!message.deleted ? (
              <>
                <Text> {message.content}</Text>

                {message.fileUrl && (
                  <Image
                    src={message.fileUrl}
                    width={rem(200)}
                    height={rem(200)}
                  />
                )}
              </>
            ) : (
              <Text c="dimmed" italic size={"sm"}>
                {" "}
                {message.content}
              </Text>
            )}
          </Flex>
        </Flex>
        {!message.deleted ? (
          <MessageActions
            canDeleteMessage={canDeleteMessage}
            canUpdateMessage={canUpdateMessage}
            handleUpdateMessage={handleUpdateMessage}
            handleDeleteMessage={handleDeleteMessage}
          />
        ) : null}
      </Flex>
    </Box>
  )
}

export default ChatMessage
