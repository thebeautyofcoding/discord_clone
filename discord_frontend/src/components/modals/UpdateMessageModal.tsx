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

import { ChannelType } from "../../gql/graphql"
import { useMutation } from "@apollo/client"

import useModal from "../../hooks/useModal"

import { UPDATE_MESSAGE } from "../../graphql/mutations/UpdateMessage"
import { useMessageStore } from "../../stores/messageStore"
import { useParams } from "react-router-dom"

function UpdateMessageModal() {
  const updateMessageModal = useModal("UpdateMessage")
  const { conversationId, channelId } = useParams<{
    conversationId: string
    channelId: string
  }>()

  const message = useMessageStore((state) => state.message)
  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        !value?.trim() ? "Please enter your new content" : null,
    },

    validateInputOnChange: true,
  })

  useEffect(() => {
    if (!message?.content) return
    form.setFieldValue("content", message.content)
  }, [message])

  const [updateMessage, { loading: loadingUpdateMessage }] = useMutation(
    UPDATE_MESSAGE,
    {
      variables: {
        messageId: message?.id,
        content: form.values.content,
        conversationId: Number(conversationId),
        channelId: Number(channelId),
      },
      onCompleted: (data) => {
        updateMessageModal.closeModal()
      },
    }
  )

  return (
    <Modal
      title="Update Message"
      opened={updateMessageModal.isOpen}
      onClose={updateMessageModal.closeModal}
    >
      <Stack>
        <Flex direction={"column"}>
          <TextInput
            mb={"md"}
            label="Content"
            placeholder="Update your content"
            {...form.getInputProps("content")}
            error={form.errors.name}
          />
        </Flex>
        <Group spacing={"md"}>
          <Button color="red" onClick={updateMessageModal.closeModal}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            disabled={form.errors.name !== undefined}
            onClick={() => updateMessage()}
          >
            Update Message
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default UpdateMessageModal
