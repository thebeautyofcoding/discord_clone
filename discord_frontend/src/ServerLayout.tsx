import { Flex } from "@mantine/core"
import React from "react"
import { Outlet } from "react-router-dom"
import ServerSearch from "./components/server/ServerSearch"
import { Sidebar } from "./components/navigation/Sidebar"
import ServerSidebar from "./components/server/ServerSidebar"

function ServerLayout() {
  return (
    <Flex>
      <ServerSearch>
        <Sidebar />
        <ServerSidebar />
        <Outlet />
      </ServerSearch>
    </Flex>
  )
}

export default ServerLayout
