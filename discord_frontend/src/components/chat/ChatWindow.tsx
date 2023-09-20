import React, { useEffect } from "react"
import { Outlet, useParams } from "react-router-dom"
import { Flex, Paper, Button, TextInput, FileInput, Image } from "@mantine/core"
import { IconFile, IconSend } from "@tabler/icons-react"
import { useGeneralStore } from "../../stores/generalStore"

import { MutationFunctionOptions } from "@apollo/client"

import {
  ChannelType,
  CreateMessageMutation,
  CreateMessageMutationVariables,
  MessageUnion,
} from "../../gql/graphql"

import ChatMessages from "./ChatMessages"
import { DirectMessage } from "../../gql/graphql"
import { useForm } from "@mantine/form"
import { useToggleDrawer } from "../../hooks/useToggleDrawer"
import { useMessageData } from "../../hooks/useMessageData"
import { useChannelById } from "../../hooks/useChannelById"
import { useMessageCreatedSubscription } from "../../hooks/useMessageCreatedSubscription"
import { useConversationData } from "../../hooks/useConversationData"
import { useLivekitAccessToken } from "../../hooks/useLivekitAccessToken"
import MediaRoom from "./media/MediaRoom"
import { MessageInputArea, TextInputSection } from "./TextInputSection"

export type CreateMessageFunction = (
  options?: MutationFunctionOptions<
    CreateMessageMutation,
    CreateMessageMutationVariables
  >
) => Promise<any>

function ChatWindow({
  chatName,
  chatType,
  channelType,
}: {
  chatName: string
  chatType: "channel" | "conversation"
  channelType?: ChannelType
}) {
  const { drawerOpen } = useGeneralStore((state) => state)
  console.log("type69", chatType)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const createImagePreview = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      console.log(imagePreview)
      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  useToggleDrawer()
  const fileInputRef = React.useRef<HTMLButtonElement>(null)
  const form = useForm({
    initialValues: {
      content: "",
    },
  })
  const { memberId, channelId, createMessage, messages } = useMessageData()
  const { conversation, getOrCreateConversation } =
    useConversationData(memberId)

  const conversationId = conversation?.id
  console.log("type69", channelType)
  useMessageCreatedSubscription()
  const handleSendMessage = async (content: string) => {
    console.log(memberId, conversationId)
    if (!conversationId && !channelId) return
    getOrCreateConversation()
    await createMessage({
      variables: {
        input: {
          content: content,
          conversationId: conversationId,
          channelId: channelId,
        },
        file,
      },
      refetchQueries: ["GetMessagesByConversationIdOrChannelId"],
      onError: (error) => {
        console.error(error)
      },
    })

    setImagePreview(null)
    setFile(null)
    form.reset()
  }
  const { isSmallerThanLg } = useToggleDrawer()
  return (
    <Flex justify={"center"} align={"end"}>
      <Outlet />
      <Flex
        justify={"flex-end"}
        align={"flex-end"}
        direction={"column"}
        pt="60px"
        h="100vh"
        w="calc(100vw - 80px))"
        miw="60vw"
      >
        <Paper
          m="0"
          p="0"
          h={"calc(100% - 60px)"}
          w={drawerOpen ? "calc(100% - 340px)" : "calc(100% - 110px)"}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[4],
            borderRadius: 0,
            flex: "display",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Flex>
            {channelType !== undefined && (
              <Flex>
                {channelType === ChannelType.Video && (
                  <Flex w="100%">
                    <Flex w={isSmallerThanLg ? "100vw" : "50vw"}>
                      <MediaRoom chatId={chatName} audio={true} video={true} />
                    </Flex>
                    {!isSmallerThanLg && (
                      <Flex
                        direction={"column"}
                        w={drawerOpen ? "26vw" : "40vw"}
                        mr="md"
                      >
                        <ChatMessages
                          messages={messages}
                          conversationId={conversationId}
                          channelId={channelId}
                        />
                        <Flex mt="md" justify={"center"} align={"center"}>
                          <TextInputSection
                            setImagePreview={setImagePreview}
                            imagePreview={imagePreview}
                            onSend={handleSendMessage}
                            onFileChange={createImagePreview}
                          />
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                )}
                {channelType === ChannelType.Audio && (
                  <>
                    <Flex w={isSmallerThanLg ? "100vw" : "50vw"}>
                      <MediaRoom chatId={chatName} audio={true} video={false} />
                    </Flex>
                    {!isSmallerThanLg && (
                      <Flex direction={"column"} w={"26vw"}>
                        <ChatMessages
                          messages={messages}
                          conversationId={conversationId}
                          channelId={channelId}
                        />
                        <Flex
                          mt="md"
                          w="100%"
                          justify={"center"}
                          align={"center"}
                        >
                          <TextInputSection
                            setImagePreview={setImagePreview}
                            imagePreview={imagePreview}
                            onSend={handleSendMessage}
                            onFileChange={createImagePreview}
                          />
                        </Flex>
                      </Flex>
                    )}
                  </>
                )}
              </Flex>
            )}
            {/* {
              <Flex
                direction={"column"}
                w={channelType !== ChannelType.Text ? "calc(50vw)" : "50vw"}
              >
                <ChatMessages
                  messages={messages}
                  conversationId={conversationId}
                  channelId={channelId}
                />
                <TextInputSection
                  imagePreview={imagePreview}
                  onSend={handleSendMessage}
                  onFileChange={createImagePreview}
                />
              </Flex>
            } */}

            {channelType === ChannelType.Text && (
              <Flex direction={"column"} w={"100vw"}>
                <ChatMessages
                  messages={messages}
                  conversationId={conversationId}
                  channelId={channelId}
                />
                <Flex mt="md" w="100%" justify={"center"} align={"center"}>
                  <TextInputSection
                    setImagePreview={setImagePreview}
                    imagePreview={imagePreview}
                    onSend={handleSendMessage}
                    onFileChange={createImagePreview}
                  />
                </Flex>
              </Flex>
            )}
            {chatType === "conversation" && (
              <Flex direction={"column"} w={"100vw"}>
                <ChatMessages
                  setImagePreview={setImagePreview}
                  messages={messages}
                  conversationId={conversationId}
                  channelId={channelId}
                />
                <Flex mt="md" w="90%" justify={"center"} align={"center"}>
                  <TextInputSection
                    setImagePreview={setImagePreview}
                    imagePreview={imagePreview}
                    onSend={handleSendMessage}
                    onFileChange={createImagePreview}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </Paper>
      </Flex>
    </Flex>
  )
}

export default ChatWindow
