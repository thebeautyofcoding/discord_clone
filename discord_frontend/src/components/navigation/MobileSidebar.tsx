import { Sidebar } from "./Sidebar"
import ServerSidebar from "../server/ServerSidebar"
import {
  useMantineTheme,
  Paper,
  Button,
  Flex,
  Drawer,
  rem,
} from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"

import ChatHeader from "./ChatHeader"
import { useGeneralStore } from "../../stores/generalStore"
function MobileSidebar({ type }: { type: "channel" | "conversation" }) {
  const { toggleDrawer, drawerOpen } = useGeneralStore((state) => state)

  return (
    <>
      <ChatHeader opened={drawerOpen} toggle={toggleDrawer} type={type} />
      <Sidebar />
      <Drawer
        mb={0}
        zIndex={10}
        opened={drawerOpen}
        onClose={close}
        size="340px"
        position="left"
        withOverlay={false}
        styles={{ root: { width: 0, height: 0, position: "fixed" } }}
        withCloseButton={false}
      >
        <ServerSidebar />
      </Drawer>
    </>
  )
}

export default MobileSidebar
