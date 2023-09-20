import React from "react"
import { Outlet } from "react-router-dom"

import MobileSidebar from "./components/navigation/MobileSidebar"

function ChannelLayout() {
  return (
    <>
      <MobileSidebar type="channel" />
      <Outlet />
    </>
  )
}

export default ChannelLayout
