import { Box, rem } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"

function MessageButton({
  onClick,
  type,
}: {
  onClick: () => void
  type: "delete" | "update"
}) {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[5],
        borderRadius: theme.radius.xl,
        width: rem(20),
        height: rem(20),
        cursor: "pointer",
        display: "flex",
        transition: "all 0.2s ease",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[6],
        },
        "&:active": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[7],
        },
        "&:hover .icon": {
          transform: "scale(1.4)",
        },
      })}
    >
      <Box
        className="icon"
        sx={{
          transition: "transform 0.2s ease",
        }}
      >
        {type === "delete" ? <IconTrash size="15" /> : <IconEdit size="15" />}
      </Box>
    </Box>
  )
}

export default MessageButton
