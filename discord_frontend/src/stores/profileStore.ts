import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Profile } from "../gql/graphql"

interface ProfileStore {
  user: Profile | null
  setUser: (user: Profile) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: Profile) => set(() => ({ user })),
    }),
    {
      name: "profile-store",
    }
  )
)
