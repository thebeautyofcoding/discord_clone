import React from "react"
import { ChannelType, MemberRole } from "../../gql/graphql"
import { Flex, Text, Tooltip } from "@mantine/core"
import { IconPlus, IconSettings } from "@tabler/icons-react"
import { useGeneralStore } from "../../stores/generalStore"
import useModal from "../../hooks/useModal"

function ServerSidebarSection({
  sectionType,
  channelType,
  role,
  label,
}: {
  sectionType: "channels" | "members"
  channelType: ChannelType
  role: MemberRole | undefined
  label: string
}) {
  const channelModal = useModal("CreateChannel")
  const manageMembersModal = useModal("ManageMembers")

  const setChannelTypeForCreateChannelModal = useGeneralStore(
    (state) => state.setChannelTypeForCreateChannelModal
  )
  const handleOnClick = () => {
    setChannelTypeForCreateChannelModal(channelType)
    channelModal.openModal()
  }
  if (role !== MemberRole.Guest && sectionType === "channels") {
    return (
      <Tooltip label={"Create Channel"} withArrow onClick={handleOnClick}>
        <Flex py="md" px={"md"} style={{ cursor: "pointer" }}>
          <Flex justify={"space-between"} w="100%">
            {" "}
            <Flex>
              <Text>{label}</Text>{" "}
            </Flex>
          </Flex>

          <IconPlus />
        </Flex>
      </Tooltip>
    )
  }
  if (role === MemberRole.Admin && sectionType === "members") {
    return (
      <Tooltip
        label={"Manage Members"}
        withArrow
        onClick={manageMembersModal.openModal}
      >
        <Flex py="md" px={"md"} style={{ cursor: "pointer" }}>
          <Flex justify={"space-between"} w="100%">
            <Text>{label}</Text>{" "}
          </Flex>

          <IconSettings />
        </Flex>
      </Tooltip>
    )
  }
}

export default ServerSidebarSection
