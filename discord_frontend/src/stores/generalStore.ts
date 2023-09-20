import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ChannelType } from "../gql/graphql"

export type Modal =
  | "CreateServer"
  | "UpdateServer"
  | "InviteFriends"
  | "JoinServer"
  | "ManageMembers"
  | "CreateChannel"
  | "DeleteServer"
  | "LeaveServer"
  | "DeleteChannel"
  | "UpdateChannel"
  | "LeaveChannel"
  | "UpdateMessage"
interface GeneralStore {
  isDarkMode: boolean
  activeModal: Modal | null
  channelTypeForCreateChannelModal: "TEXT" | "AUDIO" | "VIDEO"
  channelToBeDeletedOrUpdatedId: number | null
  drawerOpen: boolean
  toggleDarkMode: () => void
  setActiveModal: (modal: Modal | null) => void
  setChannelTypeForCreateChannelModal: (
    channelType: "TEXT" | "AUDIO" | "VIDEO"
  ) => void

  setChannelToBeDeletedOrUpdatedId: (channelId: number | null) => void
  toggleDrawer: () => void
}

export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      activeModal: null,
      channelTypeForCreateChannelModal: ChannelType.Text,
      channelToBeDeletedOrUpdatedId: null,
      drawerOpen: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setActiveModal: (modal) => set(() => ({ activeModal: modal })),
      setChannelTypeForCreateChannelModal: (channelType) =>
        set(() => ({ channelTypeForCreateChannelModal: channelType })),
      setChannelToBeDeletedOrUpdatedId: (channelId) =>
        set(() => ({ channelToBeDeletedOrUpdatedId: channelId })),
      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
    }),

    {
      name: "general-store",
    }
  )
)
