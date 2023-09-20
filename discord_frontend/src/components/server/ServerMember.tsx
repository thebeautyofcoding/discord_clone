import React, { useEffect, useState } from "react"
import {
  ChannelType,
  GetMemberByProfileIdQuery,
  Member,
  MemberRole,
  Profile,
  Server,
} from "../../gql/graphql"
import { IconCrown, IconShieldCheck } from "@tabler/icons-react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Flex, Image, NavLink, Sx, Text, rem } from "@mantine/core"
import { useProfileStore } from "../../stores/profileStore"
import { useQuery } from "@apollo/client"
import { GET_MEMBER_BY_PROFILE_ID } from "../../graphql/queries/GetMemberByProfileId"
import { useConversationData } from "../../hooks/useConversationData"

type ServerMemberProps = {
  member: Member & { profile: Profile }
  server: Server
  isActive: boolean
}
const roleIconMap = {
  [MemberRole.Guest]: null,
  [MemberRole.Moderator]: <IconShieldCheck />,
  [MemberRole.Admin]: <IconCrown />,
}
function ServerMember({ member, server, isActive }: ServerMemberProps) {
  const { serverId } = useParams<{ serverId: string }>()

  const currentProfileId = useProfileStore((state) => state.user?.id)
  const { data: dataMemberByProfileId } = useQuery<GetMemberByProfileIdQuery>(
    GET_MEMBER_BY_PROFILE_ID,
    {
      variables: {
        profileId: currentProfileId,
        serverId: Number(serverId),
      },
      skip: !currentProfileId,
    }
  )
  const navigate = useNavigate()
  const { conversation, getOrCreateConversation } = useConversationData(
    member?.id
  )

  const styles: Sx = (theme) => ({
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[4],
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
  })

  return (
    <NavLink
      sx={styles}
      active={isActive}
      rightSection={roleIconMap[member?.role]}
      onClick={async () => {
        await getOrCreateConversation({
          onCompleted: (data) => {
            navigate(
              `/server/${server.id}/conversations/${data?.getOrCreateConversation.id}/members/${ChannelType.Text}/${member?.id}`
            )
          },
        })
      }}
      icon={
        <Image
          width={rem(25)}
          height={rem(25)}
          radius={rem(25)}
          src={member?.profile?.imageUrl}
        />
      }
      label={member?.profile?.name}
    />
  )
}

export default ServerMember
