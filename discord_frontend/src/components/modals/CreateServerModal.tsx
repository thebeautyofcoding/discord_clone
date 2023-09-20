import {
  Button,
  Modal,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
  rem,
  Group,
  Image,
  Flex,
} from "@mantine/core"
import React from "react"

import { useForm } from "@mantine/form"
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react"
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { CREATE_SERVER } from "../../graphql/mutations/CreateServer"
import { useMutation, useQuery } from "@apollo/client"

import { getProfileByIdQuery } from "../../gql/graphql"
import { useProfileStore } from "../../stores/profileStore"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import useModal from "../../hooks/useModal"
function CreateServerModal() {
  const theme = useMantineTheme()
  const [createServer] = useMutation(CREATE_SERVER)

  const { isOpen, closeModal, openModal } = useModal("CreateServer")

  const user = useProfileStore((state) => state.user)
  const { data } = useQuery<getProfileByIdQuery>(GET_PROFILE_BY_ID, {
    variables: {
      profileId: user?.id,
    },
  })
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => !value.trim() && "Please enter a name",
    },
  })
  const [file, setFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const handleDropzoneChange: DropzoneProps["onDrop"] = (files) => {
    if (files.length === 0) {
      setImagePreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    console.log(files[0])
    setFile(files[0])
    reader.readAsDataURL(files[0])
  }
  const onSubmit = () => {
    if (!form.validate()) return
    console.log(file instanceof File)
    createServer({
      variables: {
        input: {
          name: form.values.name,

          profileId: data?.getProfileById?.id,
        },
        file,
      },
      onCompleted: () => {
        setImagePreview(null)
        setFile(null)
        form.reset()
        closeModal()
      },
      refetchQueries: ["GetServerByProfileIdOfMember"],
    })
  }
  return (
    <>
      <Modal
        opened={isOpen}
        onClose={closeModal}
        title="Create Server"
        size="md"
      >
        <Text c="dimmed">
          Give your server a personality with a name and an image. You can
          always change it later.
        </Text>
        <form onSubmit={form.onSubmit(() => onSubmit())}>
          <Stack>
            <Flex justify={"center"} align={"center"} direction={"column"}>
              {!imagePreview && (
                <Dropzone
                  mt="md"
                  onDrop={(files) => handleDropzoneChange(files)}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    position="center"
                    spacing="xl"
                    style={{ minHeight: rem(100), pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        size="3.2rem"
                        stroke={1.5}
                        color={
                          theme.colors[theme.primaryColor][
                            theme.colorScheme === "dark" ? 4 : 6
                          ]
                        }
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size="3.2rem"
                        stroke={1.5}
                        color={
                          theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
                        }
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto size="3.2rem" stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                      <Text size="xl" inline>
                        Drag images here or click to select files
                      </Text>
                      <Text size="sm" color="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not
                        exceed 5mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              )}
              {imagePreview && (
                <Flex pos="relative" w={rem(150)} h={rem(150)} mt="md">
                  <>
                    <Button
                      color="red"
                      radius={100}
                      pos="absolute"
                      size="25"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setImagePreview(null)
                      }}
                      style={{
                        transform: "translate(50%, 50%)",

                        left: 100,
                        top: 0,
                        zIndex: 200,
                      }}
                    >
                      <IconX color="white" />
                    </Button>
                    <Image
                      radius={100}
                      width={rem(150)}
                      height={rem(150)}
                      fit="cover"
                      src={imagePreview}
                      pos="absolute"
                    />
                  </>
                </Flex>
              )}
            </Flex>
            <TextInput
              label="Name"
              placeholder="Your server's name"
              {...form.getInputProps("name")}
              error={form.errors.name}
            />

            <Button w={"30%"} mt={"md"} type="submit" variant="gradient">
              Create Server
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  )
}

export default CreateServerModal
