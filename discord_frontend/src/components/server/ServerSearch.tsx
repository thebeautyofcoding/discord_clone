import {
  SpotlightProvider,
  SpotlightAction,
  useSpotlight,
  spotlight,
} from "@mantine/spotlight"
import {
  IconCamera,
  IconCrown,
  IconHash,
  IconMicrophone,
  IconSearch,
  IconShieldCheck,
} from "@tabler/icons-react"
import {
  ChannelType,
  GetProfileByIdQuery,
  GetServerByIdQuery,
  MemberRole,
} from "../../gql/graphql"
import { useProfileStore } from "../../stores/profileStore"
import { useNavigate, useParams } from "react-router-dom"
import { GET_SERVER_BY_ID } from "../../graphql/queries/GetServerById"
import { useQuery } from "@apollo/client"

import { useEffect } from "react"
import { Button, Flex, TextInput, Tooltip } from "@mantine/core"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"

function ServerSearch({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { serverId } = useParams<{ serverId: string }>()
  const onTrigger = ({
    id,
    type,
  }: {
    id: number
    type: "channel" | "member"
  }) => {
    spotlight.close()
    if (type === "member") {
      navigate(`/server/${serverId}/conversations/${id}`)
    }
    if (type === "channel") {
      navigate(`/server/${serverId}/channels/${id}`)
    }
  }
  const iconMap = {
    [ChannelType.Text]: <IconHash size={20} />,
    [ChannelType.Audio]: <IconMicrophone size={20} />,
    [ChannelType.Video]: <IconCamera size={20} />,
  }

  const roleIconMap = {
    [MemberRole.Guest]: null,
    [MemberRole.Moderator]: <IconShieldCheck />,
    [MemberRole.Admin]: <IconCrown />,
  }
  const params = useParams<{ serverId: string }>()
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

  const { data: dataServerById } = useQuery<GetServerByIdQuery>(
    GET_SERVER_BY_ID,
    {
      variables: {
        id: Number(params.serverId),
        profileId: dataProfileByUserId?.getProfileById?.id,
      },
      skip:
        !Number(params.serverId) || !dataProfileByUserId?.getProfileById?.id,
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

  const buildActions = (): SpotlightAction[] => {
    const actions: SpotlightAction[] = []

    textChannels.forEach((channel) => {
      actions.push({
        title: channel.name ?? "",
        group: "Text Channels",
        onTrigger: () => onTrigger({ id: channel.id, type: "channel" }),
        icon: iconMap[ChannelType.Text],
      })
    })

    audioChannels.forEach((channel) => {
      actions.push({
        title: channel.name ?? "",
        group: "Voice Channels",
        onTrigger: () => onTrigger({ id: channel.id, type: "channel" }),
        icon: iconMap[ChannelType.Audio],
      })
    })

    videoChannels.forEach((channel) => {
      actions.push({
        title: channel.name ?? "",
        group: "Video Channels",
        onTrigger: () => onTrigger({ id: channel.id, type: "channel" }),
        icon: iconMap[ChannelType.Video],
      })
    })

    members.forEach((member) => {
      actions.push({
        title: member.profile?.name || "",
        group: "Members",
        onTrigger: () => onTrigger({ id: member.id, type: "member" }),
        icon: roleIconMap[member.role!],
      })
    })

    return actions
  }

  return (
    <Flex>
      <SpotlightProvider
        actions={buildActions()}
        searchPlaceholder="Search..."
        shortcut="shift + enter"
      >
        {children}
      </SpotlightProvider>
    </Flex>
  )
}
export function SpotLightTrigger() {
  const spotlight = useSpotlight()
  // close spotlight when esc is pressed
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        spotlight.closeSpotlight()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [spotlight])

  return (
    <Tooltip label="Shift + Enter" style={{ pointerEvents: "auto" }}>
      <Flex
        mx="md"
        style={{ cursor: "pointer" }}
        onClick={() => spotlight.toggleSpotlight()}
      >
        <TextInput
          style={{ pointerEvents: "none" }}
          placeholder="Search..."
          rightSection={
            <Button variant="transparent">
              <IconSearch />
            </Button>
          }
        />
      </Flex>
    </Tooltip>
  )
}
export default ServerSearch
