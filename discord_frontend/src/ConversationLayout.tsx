import React from "react"
import { Outlet, useParams } from "react-router-dom"

import MobileSidebar from "./components/navigation/MobileSidebar"

function ConversationLayout() {
  console.log("CONS69", useParams())
  return (
    <>
      <MobileSidebar type="conversation" />
      <Outlet />
    </>
  )
}

export default ConversationLayout
