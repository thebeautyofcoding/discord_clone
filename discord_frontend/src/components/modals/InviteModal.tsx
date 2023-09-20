import { Button, Flex, Modal, Stack, Text, TextInput } from "@mantine/core"
import { IconCheck, IconCopy, IconRefresh } from "@tabler/icons-react"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { UPDATE_SERVER_WITH_NEW_INVITE_CODE } from "../../graphql/mutations/UpdateServerWithNewInviteCode"
import { useMutation, useQuery } from "@apollo/client"
import {
  getProfileByIdQuery,
  GetServerByIdQuery,
  Server,
} from "../../gql/graphql"
import { GET_SERVER_BY_ID } from "../../graphql/queries/GetServerById"
import { useProfileStore } from "../../stores/profileStore"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"

import useModal from "../../hooks/useModal"
import { useForm } from "@mantine/form"

function InviteModal() {
  const [copied, setCopied] = React.useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(
      dataServerById?.getServerById?.inviteCode || ""
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  const user = useProfileStore((state) => state.user)
  const serverId = useParams<{ serverId: string }>()
  const { data } = useQuery<getProfileByIdQuery>(GET_PROFILE_BY_ID, {
    variables: {
      profileId: user?.id,
    },
    skip: !user?.id,
  })
  const { data: dataServerById } = useQuery<GetServerByIdQuery>(
    GET_SERVER_BY_ID,
    {
      variables: {
        id: Number(serverId.serverId),
        profileId: data?.getProfileById?.id,
      },
      onCompleted: (data) => {
        console.log("DONSO")
        setServer(data?.getServerById)
      },
      skip: !Number(serverId.serverId),
    }
  )

  const [server, setServer] = React.useState<Server>()

  const [updateServerWithNewInviteCode, { loading }] = useMutation(
    UPDATE_SERVER_WITH_NEW_INVITE_CODE,
    {
      variables: {
        serverId: dataServerById?.getServerById?.id,
      },

      onCompleted: (data) => {
        console.log(
          "Server updated with new invite code:",
          data.updateServerWithNewInviteCode,
          server
        )
        setServer(data.updateServerWithNewInviteCode)
      },
    }
  )
  const form = useForm({
    initialValues: {
      inviteCode: "",
    },
  })
  useEffect(() => {
    if (!dataServerById?.getServerById?.inviteCode) return

    form.setFieldValue("inviteCode", dataServerById?.getServerById?.inviteCode)
  }, [dataServerById?.getServerById?.inviteCode])
  const { isOpen, closeModal } = useModal("InviteFriends")

  return (
    <Modal
      onClose={() => closeModal()}
      title="Invite Friends"
      zIndex={999}
      opened={isOpen}
    >
      <Stack spacing="md" w={"100%"}>
        <Flex>
          <TextInput
            {...form.getInputProps("inviteCode")}
            w={"100%"}
            rightSection={
              <Button variant="transparent" onClick={onCopy}>
                {!copied ? <IconCopy /> : <IconCheck color="green" />}
              </Button>
            }
            label="Server Invite Link"
            placeholder="https://discord.gg/invite"
          />
        </Flex>
        {/* generate new link */}
        <Button
          disabled={loading}
          variant="gradient"
          onClick={() => updateServerWithNewInviteCode()}
        >
          <Text mr="md">Generate New Link</Text> <IconRefresh />
        </Button>
      </Stack>
    </Modal>
  )
}

export default InviteModal
