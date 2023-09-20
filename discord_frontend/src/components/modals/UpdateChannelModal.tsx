import {
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  rem,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { useGeneralStore } from "../../stores/generalStore"
import { useForm } from "@mantine/form"

import {
  ChannelType,
  getProfileByIdQuery,
  GetServerByIdQuery,
} from "../../gql/graphql"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_CHANNEL_ON_SERVER } from "../../graphql/mutations/CreateChannelOnServer"
import { useParams } from "react-router-dom"
import useModal from "../../hooks/useModal"
import { UPDATE_CHANNEL } from "../../graphql/mutations/UpdateChannel"
import { GET_SERVER_BY_ID } from "../../graphql/queries/GetServerById"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import { useProfileStore } from "../../stores/profileStore"

function UpdateChannelModal() {
  const { isOpen, closeModal, openModal } = useModal("UpdateChannel")
  const channelTypeForCreateChannelModal = useGeneralStore(
    (state) => state.channelTypeForCreateChannelModal
  )
  console.log(channelTypeForCreateChannelModal)
  const form = useForm({
    initialValues: {
      name: "",
      type: channelTypeForCreateChannelModal
        ? channelTypeForCreateChannelModal
        : ChannelType.Text,
    },
    validate: {
      name: (value) =>
        !value.trim()
          ? "Please enter a name"
          : value === "general"
          ? "Channel name cannot be general"
          : null,
      type: (value) => !value.trim() && "Please select a channel type",
    },

    validateInputOnChange: true,
  })

  const channelId = useGeneralStore(
    (state) => state.channelToBeDeletedOrUpdatedId
  )
  const { serverId } = useParams<{ serverId: string }>()
  const user = useProfileStore((state) => state.user)
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
        id: Number(serverId),
        profileId: data?.getProfileById?.id,
      },
      skip: !Number(serverId) || !data?.getProfileById?.id,
      onCompleted: (data) => {},
      onError: (error) => {
        console.log(error)
      },
    }
  )
  useEffect(() => {
    const channel = dataServerById?.getServerById?.channels?.find(
      (channel) => channel.id === channelId
    )
    if (channel) {
      form.setFieldValue("name", channel?.name || "")
      form.setFieldValue("type", channel?.type || ChannelType.Text)
    }
  }, [channelId])

  const [updateChannel] = useMutation(UPDATE_CHANNEL, {
    onCompleted: (data) => {
      console.log(data)
    },
    variables: {
      input: {
        channelId,
        name: form.values.name,
        type: form.values.type,
      },
    },
    refetchQueries: ["GetServerByProfileIdOfMember"],
  })
  const handleCreateChannel = () => {
    updateChannel()
    closeModal()
  }
  return (
    <Modal title="Update Channel" opened={isOpen} onClose={closeModal}>
      <Stack>
        <Flex direction={"column"} h={rem(250)}>
          <TextInput
            mb={"md"}
            label="Channel Name"
            placeholder="Channel Name"
            {...form.getInputProps("name")}
            error={form.errors.name}
          />
          <Select
            data={Object.values(ChannelType).map((type) => type)}
            label="Channel Type"
            {...form.getInputProps("type")}
          />
        </Flex>
        <Group spacing={"md"}>
          <Button color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            disabled={form.errors.name !== undefined}
            onClick={handleCreateChannel}
          >
            Update Channel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default UpdateChannelModal
