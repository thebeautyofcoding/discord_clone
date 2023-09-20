import React from "react"
import { MemberRole, Server } from "../../gql/graphql"
import {
  Menu,
  Button,
  rem,
  Flex,
  Divider,
  Text,
  Box,
  Sx,
  MantineTheme,
} from "@mantine/core"
import {
  IconArrowAutofitDown,
  IconPlus,
  IconSettings,
  IconTrash,
  IconUserPlus,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import { useGeneralStore } from "../../stores/generalStore"
import useModal from "../../hooks/useModal"

function ServerHeader({
  server,
  role,
}: {
  server?: Server
  role?: MemberRole
}) {
  const isAdmin = role === MemberRole.Admin
  const isModerator = isAdmin || role === MemberRole.Moderator

  const channelModal = useModal("CreateChannel")

  const leaveServerModal = useModal("LeaveServer")

  const manageMembersModal = useModal("ManageMembers")
  const updateServerModal = useModal("UpdateServer")
  const deleteServerModal = useModal("DeleteServer")
  const invitePeopleModal = useModal("InviteFriends")

  const setChannelTypeForCreateChannelModal = useGeneralStore(
    (state) => state.setChannelTypeForCreateChannelModal
  )
  const sx: Sx = (theme: MantineTheme) => ({
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[4],
    textAlign: "center",
    padding: theme.spacing.md,
    margin: "0px",
    cursor: "pointer",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[5],
    },
  })

  return (
    <Menu width={200} shadow="md">
      <Menu.Target>
        <Box sx={sx} style={{ borderRadius: 0 }}>
          <Flex justify={"space-between"} align={"center"}>
            {" "}
            {server?.name} <IconArrowAutofitDown />
          </Flex>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        {isModerator && (
          <Menu.Item
            rightSection={<IconUserPlus size={rem(14)} />}
            component="button"
            onClick={() => {
              invitePeopleModal.openModal()
            }}
          >
            Invite People
          </Menu.Item>
        )}
        {isAdmin && (
          <Menu.Item
            rightSection={<IconSettings size={rem(14)} />}
            component="button"
            onClick={updateServerModal.openModal}
          >
            Server Settings
          </Menu.Item>
        )}
        {isAdmin && (
          <Menu.Item
            rightSection={<IconUsers size={rem(14)} />}
            component="button"
            onClick={manageMembersModal.openModal}
          >
            Manage Members
          </Menu.Item>
        )}
        {isModerator && (
          <Menu.Item
            rightSection={<IconPlus size={rem(14)} />}
            component="button"
            onClick={() => {
              setChannelTypeForCreateChannelModal("TEXT")
              channelModal.openModal()
            }}
          >
            Create Channel
          </Menu.Item>
        )}
        {isModerator && <Divider />}
        {isAdmin && (
          <Menu.Item
            rightSection={<IconTrash size={rem(14)} color="red" />}
            component="button"
            onClick={deleteServerModal.openModal}
          >
            <Text c="red"> Delete Server</Text>
          </Menu.Item>
        )}
        {!isAdmin && (
          <Menu.Item
            rightSection={<IconX size={rem(14)} color="red" />}
            component="button"
            onClick={leaveServerModal.openModal}
          >
            <Text c="red"> Leave Server</Text>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

export default ServerHeader
