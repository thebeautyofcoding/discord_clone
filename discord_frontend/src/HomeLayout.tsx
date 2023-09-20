import "./App.css"

import { Flex } from "@mantine/core"
import { Sidebar } from "./components/navigation/Sidebar"

import { Outlet } from "react-router-dom"
import { useQuery } from "@apollo/client"

import { GetProfileByIdQuery } from "./gql/graphql"

import { GET_PROFILE_BY_ID } from "./graphql/queries/GetProfileById"
import { useProfileStore } from "./stores/profileStore"
import CreateServerModal from "./components/modals/CreateServerModal"
import ServerJoinModal from "./components/modals/ServerJoinModal"
import UpdateServerModal from "./components/modals/UpdateServerModal"
import ManageMembersModal from "./components/modals/ManageMembersModal"
import CreateChannelModal from "./components/modals/CreateChannelModal"
import DeleteServerModal from "./components/modals/DeleteServerModal"
import LeaveServerModal from "./components/modals/LeaveServerModal"

import DeleteChannelModal from "./components/modals/DeleteChannelModal"
import UpdateChannelModal from "./components/modals/UpdateChannelModal"

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function HomeLayout() {
  const profile = useProfileStore((state) => state.user)
  const setUser = useProfileStore((state) => state.setUser)
  useQuery<GetProfileByIdQuery>(GET_PROFILE_BY_ID, {
    variables: {
      profileId: profile?.id,
    },
    skip: !profile?.id,
    onCompleted: (data) => {
      setUser(data.getProfileById)
    },
  })

  return (
    <Flex w="100vw" justify={"center"} h={"100vh"} align={"center"}>
      <Sidebar />
      <UpdateChannelModal />
      <DeleteChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <CreateChannelModal />
      <ManageMembersModal />
      <UpdateServerModal />
      <CreateServerModal />
      <ServerJoinModal />

      <Outlet />
    </Flex>
  )
}

export default HomeLayout
