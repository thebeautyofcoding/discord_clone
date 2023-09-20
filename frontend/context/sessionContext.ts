import React, { createContext, useContext } from "react"

export const SessionContext = createContext(null)

export const useSessionContext = () => useContext(SessionContext)
