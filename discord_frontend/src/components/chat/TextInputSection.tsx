import React from "react"
import { Button, TextInput, FileInput, Flex, Image } from "@mantine/core"
import { IconCubeSend, IconFile, IconSend, IconX } from "@tabler/icons-react"
import { useForm } from "@mantine/form"
import { useMediaQuery } from "@mantine/hooks"

interface MessageInputAreaProps {
  onSend: (content: string) => void
  onFileChange: (file: File) => void
  imagePreview: string | null
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
}

export const TextInputSection: React.FC<MessageInputAreaProps> = ({
  onSend,
  onFileChange,
  imagePreview,
  setImagePreview,
}) => {
  const fileInputRef = React.useRef<HTMLButtonElement>(null)
  const form = useForm({
    initialValues: { content: "" },
  })
  const isSmallerThanLarge = useMediaQuery("(max-width: 1400px)")
  return (
    <Flex
      ml="lg"
      mr="lg"
      w={"100%"}
      id="input69"
      justify={"center"}
      align={"center"}
      direction={isSmallerThanLarge ? "column" : "row"}
    >
      <TextInput
        mr="md"
        w="80%"
        placeholder={"Message"}
        {...form.getInputProps("content")}
      />
      <Flex
        w="30%"
        mt={isSmallerThanLarge ? "md" : "0"}
        justify={"center"}
        align="center"
      >
        <>
          <Button
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
            variant="light"
            radius={100}
            mr="md"
            p={imagePreview ? "0" : "xs"}
            size={imagePreview ? "50" : "25"}
          >
            <>
              {imagePreview && (
                <Flex>
                  <Image
                    width={isSmallerThanLarge ? "50" : "25"}
                    height={isSmallerThanLarge ? "50" : "25"}
                    radius={100}
                    src={imagePreview}
                    pos={"relative"}
                  />
                  <Button
                    onClick={() => setImagePreview(null)}
                    radius={100}
                    right="0"
                    p="0"
                    w="15px"
                    h="15px"
                    m="0"
                    color="red"
                    pos="absolute"
                  >
                    <IconX />
                  </Button>
                </Flex>
              )}
              {!imagePreview && (
                <>
                  {" "}
                  <FileInput
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={onFileChange}
                  />
                  <IconFile size={isSmallerThanLarge ? "20" : "25"} />
                </>
              )}
            </>
          </Button>

          <Button
            p="xs"
            radius={100}
            variant="light"
            size={isSmallerThanLarge ? "20" : "25"}
            onClick={() => onSend(form.values.content)}
          >
            <IconCubeSend size={isSmallerThanLarge ? "20" : "25"} />
          </Button>
        </>
      </Flex>
    </Flex>
  )
}
