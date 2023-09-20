import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home.tsx"
import ServerPage from "./pages/ServerPage.tsx"
import HomeLayout from "./HomeLayout.tsx"
import ServerLayout from "./ServerLayout.tsx"
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"
import { MantineProvider } from "@mantine/core"
import { ApolloProvider } from "@apollo/client"
import client from "../apolloClient.ts"
import { useGeneralStore } from "./stores/generalStore.ts"

import NotFound from "./pages/NotFoundPage.tsx"
import ChannelPage from "./pages/ChannelPage.tsx"
import MobileSidebar from "./components/navigation/MobileSidebar.tsx"
import ChannelLayout from "./ChannelLayout.tsx"
import RootLayout from "./RootLayout.tsx"
import useModal from "./hooks/useModal.ts"
import DeleteServerModal from "./components/modals/DeleteServerModal.tsx"
import CreateServerModal from "./components/modals/CreateServerModal.tsx"
import InviteModal from "./components/modals/InviteModal.tsx"
import ServerJoinModal from "./components/modals/ServerJoinModal.tsx"
import UpdateServerModal from "./components/modals/UpdateServerModal.tsx"
import ManageMembersModal from "./components/modals/ManageMembersModal.tsx"
import CreateChannelModal from "./components/modals/CreateChannelModal.tsx"
import UpdateChannelModal from "./components/modals/UpdateChannelModal.tsx"
import DeleteChannelModal from "./components/modals/DeleteChannelModal.tsx"
import MemberPage from "./pages/MemberPage.tsx"
import ConversationLayout from "./ConversationLayout.tsx"
import UpdateMessageModal from "./components/modals/UpdateMessageModal.tsx"
import LeaveServerModal from "./components/modals/LeaveServerModal.tsx"

// Utility to wrap elements with SignedIn/SignedOut check
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
)

export function ClerkProviderWithRoutes() {
  const isCreateServerModalOpen = useModal("CreateServer")
  const isJoinServerModalOpen = useModal("JoinServer")
  const isInviteModalOpen = useModal("InviteFriends")
  const isManageMembersModalOpen = useModal("ManageMembers")
  const isUpdateServerModalOpen = useModal("UpdateServer")
  const isDeleteServerModalOpen = useModal("DeleteServer")
  const isCreateChannelModalOpen = useModal("CreateChannel")
  const isUpdateChannelModalOpen = useModal("UpdateChannel")
  const isDeleteChannelModalOpen = useModal("DeleteChannel")
  const isLeaveServerModalOpen = useModal("LeaveServer")
  const isUpdateMessageModalOpen = useModal("UpdateMessage")

  const navigate = useNavigate()
  const colorScheme = useGeneralStore((state) =>
    state.isDarkMode ? "dark" : "light"
  )

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
      navigate={(to) => navigate(to)}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <ApolloProvider client={client}>
          <Routes>
            <Route path="" element={<RootLayout />}>
              <Route path="/" element={<HomeLayout />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="sign-in/*"
                element={<SignIn routing="path" path="/sign-in" />}
              />

              <Route
                path="sign-up/*"
                element={<SignUp routing="path" path="/sign-up" />}
              />

              <Route path="server/:serverId" element={<ServerLayout />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      {isCreateServerModalOpen && <CreateServerModal />}
                      {isJoinServerModalOpen && <ServerJoinModal />}
                      {isInviteModalOpen && <InviteModal />}

                      {isUpdateServerModalOpen && <UpdateServerModal />}
                      {isDeleteServerModalOpen && <DeleteServerModal />}
                      {isManageMembersModalOpen && <ManageMembersModal />}
                      {isCreateChannelModalOpen && <CreateChannelModal />}
                      {isUpdateChannelModalOpen && <UpdateChannelModal />}
                      {isDeleteChannelModalOpen && <DeleteChannelModal />}
                      {isLeaveServerModalOpen && <LeaveServerModal />}

                      <ServerPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="server/:serverId/channels/:channelType/:channelId"
                element={<ChannelLayout />}
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      {isCreateServerModalOpen && <CreateServerModal />}
                      {isJoinServerModalOpen && <ServerJoinModal />}
                      {isInviteModalOpen && <InviteModal />}

                      {isUpdateServerModalOpen && <UpdateServerModal />}
                      {isDeleteServerModalOpen && <DeleteServerModal />}
                      {isManageMembersModalOpen && <ManageMembersModal />}
                      {isCreateChannelModalOpen && <CreateChannelModal />}
                      {isUpdateChannelModalOpen && <UpdateChannelModal />}
                      {isDeleteChannelModalOpen && <DeleteChannelModal />}
                      {isLeaveServerModalOpen && <LeaveServerModal />}
                      {isUpdateMessageModalOpen && <UpdateMessageModal />}

                      <ChannelPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="server/:serverId/conversations/:conversationId/members/:channelType/:memberId"
                element={<ConversationLayout />}
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      {isCreateServerModalOpen && <CreateServerModal />}
                      {isJoinServerModalOpen && <ServerJoinModal />}
                      {isInviteModalOpen && <InviteModal />}

                      {isUpdateServerModalOpen && <UpdateServerModal />}
                      {isDeleteServerModalOpen && <DeleteServerModal />}
                      {isManageMembersModalOpen && <ManageMembersModal />}
                      {isCreateChannelModalOpen && <CreateChannelModal />}
                      {isUpdateChannelModalOpen && <UpdateChannelModal />}
                      {isDeleteChannelModalOpen && <DeleteChannelModal />}
                      {isLeaveServerModalOpen && <DeleteServerModal />}
                      {isUpdateMessageModalOpen && <UpdateMessageModal />}
                      <MemberPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ApolloProvider>
      </MantineProvider>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  </React.StrictMode>
)
