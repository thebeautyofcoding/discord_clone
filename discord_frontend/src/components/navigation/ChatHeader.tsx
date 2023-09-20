import React from "react"
import {
  Button,
  Paper,
  Flex,
  useMantineTheme,
  Text,
  Avatar,
} from "@mantine/core"

import { useDisclosure } from "@mantine/hooks"
import { IconHash, IconMenu } from "@tabler/icons-react"
import { useNavigate, useParams } from "react-router-dom"
import { GET_CHANNEL_BY_ID } from "../../graphql/queries/GetChannelById"
import { useQuery } from "@apollo/client"
import { useProfileStore } from "../../stores/profileStore"
import {
  GetChannelByIdQuery,
  GetMemberByIdQuery,
  GetProfileByIdQuery,
} from "../../gql/graphql"
import { GET_MEMBER_BY_ID } from "../../graphql/queries/GetMemberById"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import { useGeneralStore } from "../../stores/generalStore"
function ChatHeader({
  opened,
  toggle,
  type,
}: {
  opened: boolean
  toggle: () => void
  type: "channel" | "conversation"
}) {
  const theme = useMantineTheme()
  const params = useParams<{ serverId: string; memberId: string }>()
  const profileId = useProfileStore((state) => state.user?.id)
  const navigate = useNavigate()

  const { serverId, memberId } = useParams<{
    serverId: string
    channelId?: string
    memberId?: string
  }>()
  const currentProfileId = useProfileStore((state) => state.user?.id)
  const { data: dataProfileById } = useQuery<GetProfileByIdQuery>(
    GET_PROFILE_BY_ID,
    {
      variables: {
        profileId: currentProfileId,
      },
      skip: !currentProfileId,
    }
  )
  const { loading: loadingMember, data: memberData } =
    useQuery<GetMemberByIdQuery>(GET_MEMBER_BY_ID, {
      variables: {
        memberId: Number(memberId),
        serverId: Number(serverId),
      },
      skip: !serverId || !memberId,
    })
  const { drawerOpen } = useGeneralStore((state) => state)
  return (
    <Paper
      style={{
        transition: "margin-left 0.3s ease", // this makes the marginLeft property transition smoothly over 0.3 seconds
        marginLeft: opened ? "340px" : "0", // adjust "340px" based on your drawer width
      }}
      shadow="md"
      w="100%"
      sx={{
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[4],

        display: ["flex", "flex"],
        position: "fixed",
        inset: drawerOpen ? "0px 0px" : "0px 80px",

        height: "60px",
        width: "100vw",
        border: "none",
      }}
    >
      {/* hamburger menu to toggle drawer */}
      <Flex
        sx={{
          display: ["flex", "flex"],
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          onClick={toggle}
          variant="link"
          sx={{
            display: ["flex", "flex"],
            justifyContent: "center",
            alignItems: "center",
            width: "2%",
            height: "60%",
          }}
        >
          <IconMenu />
        </Button>
        {type === "channel" ? (
          <>
            <IconHash />

            <Text fw={700} size="lg">
              {
                dataProfileById?.getProfileById?.servers?.find(
                  (server) => server.id === Number(serverId)
                )?.name
              }
            </Text>
          </>
        ) : (
          <Flex align="center" w={"20%"} ml="md">
            <Avatar
              mr="md"
              src={memberData?.getMemberById?.profile?.imageUrl}
              radius={100}
            />
            <Text fw={700} size="lg">
              {memberData?.getMemberById?.profile?.name}
            </Text>
          </Flex>
        )}
      </Flex>
    </Paper>
  )
}

export default ChatHeader
