import {
  Avatar,
  Button,
  Flex,
  Loader,
  Menu,
  Modal,
  ScrollArea,
  Text,
} from "@mantine/core"
import React from "react"
import { useParams } from "react-router-dom"
import { useProfileStore } from "../../stores/profileStore"
import {
  ChangeMemberRoleMutation,
  DeleteMemberFromServerMutation,
  getProfileByIdQuery,
  GetServerByIdQuery,
} from "../../gql/graphql"
import { useMutation, useQuery } from "@apollo/client"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import { GET_SERVER_BY_ID } from "../../graphql/queries/GetServerById"

import {
  IconCheck,
  IconCrown,
  IconDotsVertical,
  IconShieldCheck,
} from "@tabler/icons-react"
import { CHANGE_MEMBER_ROLE } from "../../graphql/mutations/ChangeMemberRole"
import { DELETE_MEMBER_FROM_SERVER } from "../../graphql/mutations/DeleteMemberFromServer"
import useModal from "../../hooks/useModal"

function ManageMembersModal() {
  const params = useParams<{ serverId: string }>()
  const user = useProfileStore((state) => state.user)
  const { data: dataProfileByUserId } = useQuery<getProfileByIdQuery>(
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
  const { isOpen, closeModal } = useModal("ManageMembers")
  const roleIconMap = {
    MODERATOR: <IconShieldCheck color="blue" size={20} />,
    ADMIN: <IconCrown color="green" size={20} />,
    GUEST: <IconShieldCheck color="gray" size={20} />,
  }

  const [loadingId, setLoadingId] = React.useState<number | null>(null)
  const [changeMemberRole] = useMutation<ChangeMemberRoleMutation>(
    CHANGE_MEMBER_ROLE,
    {
      onCompleted: () => {
        setLoadingId(null)
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )
  const handleRoleChange = (memberId: number, role: string) => {
    setLoadingId(memberId)
    console.log("memberId", memberId)
    changeMemberRole({
      variables: {
        input: {
          memberId,
          role,
        },
      },
    })
  }

  const [deleteMemberFromServer] = useMutation<DeleteMemberFromServerMutation>(
    DELETE_MEMBER_FROM_SERVER,
    {
      onCompleted: () => {
        setLoadingId(null)
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )
  const handleDeleteMemberFromServer = (memberId: number) => {
    setLoadingId(memberId)
    deleteMemberFromServer({
      variables: {
        input: {
          memberId,
        },
      },
    })
  }
  return (
    <Modal opened={isOpen} onClose={closeModal} title="Manage Members">
      <Text size="sm" c="dimmed" mb="md">
        {" "}
        {dataServerById?.getServerById?.members?.length} Members
      </Text>
      <ScrollArea style={{ height: "200px" }} pt="md">
        {dataServerById?.getServerById?.members?.map((member) => {
          return (
            <div key={member.id}>
              <Flex my="md">
                <Avatar
                  src={member.profile?.imageUrl}
                  size="md"
                  radius={100}
                  mr="md"
                />
                <Flex direction={"column"} justify={"space-between"} w="70%">
                  <Flex align="center">
                    <Text fw={700}> {member.profile?.name}</Text>
                    <Flex ml="xs"> {roleIconMap[member.role!]}</Flex>
                  </Flex>
                  <Text size="xs" c="dimmed">
                    {" "}
                    {member.profile?.email}
                  </Text>
                </Flex>

                {member.profileId !==
                  dataServerById?.getServerById?.profileId &&
                  loadingId !== member.id && (
                    <Menu shadow="md">
                      <Menu.Target>
                        <Button variant="transparent">
                          {" "}
                          <IconDotsVertical />
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item>
                          <Menu.Item>
                            <Menu shadow="md" trigger="hover" position="left">
                              <Menu.Target>
                                <Flex>Change Role</Flex>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  onClick={() =>
                                    handleRoleChange(member.id, "ADMIN")
                                  }
                                >
                                  <Flex
                                    justify={"space-between"}
                                    align="center"
                                  >
                                    Admin
                                    {member.role === "ADMIN" ? (
                                      <IconCheck />
                                    ) : null}
                                  </Flex>
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleRoleChange(member.id, "MODERATOR")
                                  }
                                >
                                  <Flex
                                    justify={"space-between"}
                                    align="center"
                                  >
                                    Moderator
                                    {member.role === "MODERATOR" ? (
                                      <IconCheck />
                                    ) : null}{" "}
                                  </Flex>
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <Flex
                                    justify={"space-between"}
                                    align="center"
                                  >
                                    {" "}
                                    Guest
                                    {member.role === "GUEST" ? (
                                      <IconCheck />
                                    ) : null}
                                  </Flex>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              handleDeleteMemberFromServer(member.id)
                            }
                          >
                            Kick
                          </Menu.Item>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                {loadingId === member.id && (
                  <Flex align="center" justify={"center"}>
                    <Loader size="xs" />
                  </Flex>
                )}
              </Flex>
            </div>
          )
        })}
      </ScrollArea>
    </Modal>
  )
}

export default ManageMembersModal
