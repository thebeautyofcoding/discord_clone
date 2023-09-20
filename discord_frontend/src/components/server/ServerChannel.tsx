import React, { useEffect, useState } from "react"
import { Channel, ChannelType, MemberRole, Server } from "../../gql/graphql"
import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  rem,
  useMantineTheme,
  NavLink,
  Stack,
  Sx,
} from "@mantine/core"
import { useHover } from "@mantine/hooks"

import {
  IconCamera,
  IconChartBubble,
  IconEdit,
  IconHash,
  IconInbox,
  IconMessage,
  IconMicrophone,
  IconPhoneIncoming,
  IconTrash,
} from "@tabler/icons-react"
import { CSSProperties } from "react"
import useModal from "../../hooks/useModal"
import { useGeneralStore } from "../../stores/generalStore"
import { Link, useNavigate, useParams } from "react-router-dom"
type ServerChannelProps = {
  channel: Channel
  server: Server
  role?: MemberRole
  isActive?: boolean
}
const iconMap = {
  [ChannelType.Text]: IconHash,
  [ChannelType.Audio]: IconMicrophone,
  [ChannelType.Video]: IconCamera,
}
function ServerChannel({
  channel,
  server,
  role,
  isActive,
}: ServerChannelProps) {
  const Icon = iconMap[channel.type]

  const { channelId } = useParams<{ channelId: string }>()

  const deleteChannelModal = useModal("DeleteChannel")
  const updateChannelModal = useModal("UpdateChannel")
  const setChannelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.setChannelToBeDeletedOrUpdatedId
  )
  const navigate = useNavigate()

  // make it that initally the general channel is marked as active

  const styles: Sx = (theme) => ({
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[4],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[7], // default text color
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
          : theme.colors.gray[9],
    },
    "&.active": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[3],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[1], // active text color
    },
  })
  if (channel.name !== "general") {
    return (
      <NavLink
        w={rem(260)}
        label={channel.name}
        icon={<Icon size={15} />}
        sx={styles}
        active={isActive}
      >
        {channel.name !== "general" && role !== MemberRole.Guest && (
          <Stack>
            <NavLink
              sx={styles}
              onClick={() => {
                navigate(
                  `/server/${server.id}/channels/${channel.type}/${channel.id}`
                )
              }}
              label="Join"
              icon={<IconMessage style={{ marginLeft: "8px" }} size={20} />}
            />
            <NavLink
              sx={styles}
              onClick={() => {
                setChannelToBeDeletedOrUpdatedId(channel.id)
                updateChannelModal.openModal()
              }}
              label="Edit"
              icon={<IconEdit style={{ marginLeft: "8px" }} size={20} />}
            />
            <NavLink
              sx={styles}
              onClick={() => {
                setChannelToBeDeletedOrUpdatedId(channel.id)
                deleteChannelModal.openModal()
              }}
              label="Delete"
              icon={<IconTrash style={{ marginLeft: "8px" }} size={20} />}
            />
          </Stack>
        )}
      </NavLink>
    )
  } else {
    return (
      <NavLink
        active={isActive}
        onClick={() => {
          navigate(
            `/server/${server.id}/channels/${channel.type}/${channel.id}`
          )
        }}
        sx={styles}
        w={rem(250)}
        label={channel.name}
        icon={<Icon size={15} />}
      />
    )
  }
}

export default ServerChannel
