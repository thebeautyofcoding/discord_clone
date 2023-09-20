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
import { useEffect } from "react"
import { useGeneralStore } from "../../stores/generalStore"
import { useForm } from "@mantine/form"

import { ChannelType } from "../../gql/graphql"
import { useMutation } from "@apollo/client"
import { CREATE_CHANNEL_ON_SERVER } from "../../graphql/mutations/CreateChannelOnServer"
import { useParams } from "react-router-dom"
import useModal from "../../hooks/useModal"

function CreateChannelModal() {
  const { isOpen, closeModal, openModal } = useModal("CreateChannel")
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

  useEffect(() => {
    if (!channelTypeForCreateChannelModal) return
    form.setFieldValue("type", channelTypeForCreateChannelModal)
  }, [channelTypeForCreateChannelModal])

  const { serverId } = useParams<{ serverId: string }>()
  const [createChannelOnServer] = useMutation(CREATE_CHANNEL_ON_SERVER, {
    onCompleted: (data) => {
      console.log(data)
    },
    variables: {
      input: {
        serverId: Number(serverId),
        name: form.values.name,
        type: form.values.type,
      },
    },
    refetchQueries: ["GetServerById"],
  })
  const handleCreateChannel = () => {
    createChannelOnServer()
    closeModal()
  }
  return (
    <Modal title="Create Channel" opened={isOpen} onClose={closeModal}>
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
            Create Channel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default CreateChannelModal
