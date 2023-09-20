import { Button, Modal, Stack, TextInput } from "@mantine/core"
import React from "react"

import { ADD_MEMBER_TO_SERVER } from "../../graphql/mutations/AddMemberToServer"
import { useMutation } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import useModal from "../../hooks/useModal"

function ServerJoinModal() {
  const { isOpen, closeModal } = useModal("JoinServer")
  const [inviteCode, setInviteCode] = React.useState("")
  const navigate = useNavigate()
  const { serverId } = useParams<{ serverId: string }>()
  const [AddMemberToServer, { loading, error }] = useMutation(
    ADD_MEMBER_TO_SERVER,
    {
      variables: {
        inviteCode,
        serverId: Number(serverId),
      },
      onCompleted: (data) => {
        navigate(`/server/${data.addMemberToServer.id}`)
        closeModal()
      },
      refetchQueries: ["GetServerByProfileIdOfMember"],
    }
  )

  return (
    <Modal opened={isOpen} onClose={closeModal}>
      <Stack spacing="md">
        <TextInput
          label="Invite Code"
          onChange={(e) => setInviteCode(e.target.value)}
          error={error?.message}
        />
        <Button
          disabled={!inviteCode}
          onClick={() => {
            AddMemberToServer()
          }}
          loading={loading}
        >
          Join Server
        </Button>
      </Stack>
    </Modal>
  )
}

export default ServerJoinModal
