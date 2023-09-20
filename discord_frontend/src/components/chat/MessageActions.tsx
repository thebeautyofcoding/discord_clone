import React from "react"
import MessageButton from "./MessageButton"
import { Flex } from "@mantine/core"

function MessageActions({
  canUpdateMessage,
  canDeleteMessage,
  handleUpdateMessage,
  handleDeleteMessage,
}: {
  canUpdateMessage: boolean
  canDeleteMessage: boolean
  handleDeleteMessage: () => void
  handleUpdateMessage: () => void
}) {
  return (
    <Flex w="100%" ml="md" justify={"flex-start"}>
      {canDeleteMessage && (
        <MessageButton onClick={handleDeleteMessage} type="delete" />
      )}
      {canUpdateMessage && (
        <MessageButton onClick={handleUpdateMessage} type="update" />
      )}
    </Flex>
  )
}

export default MessageActions
