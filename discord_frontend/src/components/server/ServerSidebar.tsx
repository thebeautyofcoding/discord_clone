import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"
import { GET_SERVER_BY_ID } from "../../graphql/queries/GetServerById"
import { useProfileStore } from "../../stores/profileStore"
import {
  ChannelType,
  GetProfileByIdQuery,
  GetServerByIdQuery,
} from "../../gql/graphql"
import { useQuery } from "@apollo/client"

import ServerHeader from "./ServerHeader"
import {
  Button,
  Drawer,
  Flex,
  Navbar,
  Paper,
  ScrollArea,
  Stack,
  Sx,
  rem,
  useMantineTheme,
} from "@mantine/core"
import { SpotLightTrigger } from "./ServerSearch"
import ServerSidebarSection from "./ServerSidebarSection"
import ServerChannel from "./ServerChannel"
import ServerMember from "./ServerMember"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconHash, IconMenu } from "@tabler/icons-react"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"

function ServerSidebar() {
  const params = useParams<{
    serverId: string
    channelId: string
    memberId: string
  }>()
  const user = useProfileStore((state) => state.user)

  const { data: dataProfileByUserId } = useQuery<GetProfileByIdQuery>(
    GET_PROFILE_BY_ID,
    {
      variables: {
        profileId: user?.id,
      },
      skip: !user?.id,
    }
  )
  const navigate = useNavigate()
  const { data: dataServerById } = useQuery<GetServerByIdQuery>(
    GET_SERVER_BY_ID,
    {
      variables: {
        id: Number(params.serverId),
        profileId: dataProfileByUserId?.getProfileById?.id,
      },
      skip:
        !Number(params.serverId) || !dataProfileByUserId?.getProfileById?.id,
      onError: (error) => {
        const errorCode = error?.graphQLErrors[0]?.extensions?.code
        if (errorCode === "INVALID_SERVER") navigate("/server")
      },
    }
  )

  const textChannels =
    dataServerById?.getServerById?.channels?.filter(
      (channel) => channel.type === ChannelType.Text
    ) || []

  const audioChannels =
    dataServerById?.getServerById?.channels?.filter(
      (channel) => channel.type === ChannelType.Audio
    ) || []

  const videoChannels =
    dataServerById?.getServerById?.channels?.filter(
      (channel) => channel.type === ChannelType.Video
    ) || []

  const members =
    dataServerById?.getServerById?.members?.filter(
      (member) => member.profileId !== dataProfileByUserId?.getProfileById?.id
    ) || []
  const role = dataServerById?.getServerById?.members?.find(
    (member) => member.profileId === dataProfileByUserId?.getProfileById?.id
  )?.role

  const activeChannelId =
    params.channelId ||
    textChannels.find((ch) => ch?.name?.toLowerCase() === "general")?.id

  const [activeMemberId, setActiveMemberId] = useState<number | null>(null)
  const [activeChannel, setActiveChannelId] = useState<number | null>(null)

  useEffect(() => {
    if (!params.channelId && textChannels.length && !params.memberId) {
      navigate(
        `/server/${params.serverId}/channels/TEXT/${textChannels[0]?.id}`
      )
    }
  })
  useEffect(() => {
    if (params.memberId) {
      setActiveMemberId(Number(params.memberId))
      setActiveChannelId(null)
    }

    if (params.channelId) {
      setActiveChannelId(Number(params.channelId))
      setActiveMemberId(null)
    }
  }, [params.channelId, params.memberId, textChannels])

  return (
    <>
      <Navbar
        w={rem(260)}
        ml={rem(80)}
        zIndex={1}
        pos="fixed"
        height={"100%"}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4],
        })}
      >
        <Navbar.Section>
          {" "}
          <Stack>
            <ServerHeader
              role={role ?? undefined}
              server={dataServerById?.getServerById}
            />
            <SpotLightTrigger />
            <ScrollArea>
              {!!textChannels.length && (
                <ServerSidebarSection
                  sectionType="channels"
                  channelType={ChannelType.Text}
                  role={role}
                  label="Text Channels"
                />
              )}

              <Stack spacing="0">
                {" "}
                {dataServerById?.getServerById &&
                  textChannels.map((channel) => (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      isActive={activeChannel === channel.id}
                      role={role}
                      server={dataServerById?.getServerById}
                    />
                  ))}
              </Stack>
              {!!audioChannels.length && (
                <ServerSidebarSection
                  sectionType="channels"
                  channelType={ChannelType.Audio}
                  role={role}
                  label="Audio Channels"
                />
              )}
              <Stack spacing="0">
                {dataServerById?.getServerById &&
                  audioChannels.map((channel) => (
                    <ServerChannel
                      isActive={
                        activeChannel === channel?.id && !params.memberId
                      }
                      key={channel.id}
                      channel={channel}
                      role={role}
                      server={dataServerById?.getServerById}
                    />
                  ))}
              </Stack>

              {!!videoChannels.length && (
                <ServerSidebarSection
                  sectionType="channels"
                  channelType={ChannelType.Video}
                  role={role}
                  label="Video Channels"
                />
              )}
              <Stack spacing="0">
                {dataServerById?.getServerById &&
                  videoChannels.map((channel) => (
                    <ServerChannel
                      isActive={activeChannel === channel?.id}
                      key={channel.id}
                      channel={channel}
                      role={role}
                      server={dataServerById?.getServerById}
                    />
                  ))}
              </Stack>
              {!!members.length && dataServerById?.getServerById && (
                <ServerSidebarSection
                  sectionType="members"
                  channelType={ChannelType.Video}
                  role={role}
                  label="Members"
                />
              )}
              <Stack>
                {dataServerById?.getServerById &&
                  members.map((member, index) => (
                    <>
                      <ServerMember
                        isActive={activeMemberId === member?.id}
                        key={index}
                        server={dataServerById?.getServerById}
                        member={member}
                      />
                    </>
                  ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Navbar.Section>
      </Navbar>
    </>
  )
}

export default ServerSidebar
