"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type BackgroundType = "blank" | "team-driver"

export interface BackgroundConfig {
  type: BackgroundType
  teamId?: string
  driverId?: string
  primaryColor?: string
}

interface BackgroundContextType {
  config: BackgroundConfig
  setBackgroundConfig: (config: BackgroundConfig) => void
  resetToDefault: () => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BackgroundConfig>({ type: "team-driver" })

  const setBackgroundConfig = (newConfig: BackgroundConfig) => {
    setConfig(newConfig)
  }

  const resetToDefault = () => {
    setConfig({ type: "team-driver" })
  }

  return (
    <BackgroundContext.Provider value={{ config, setBackgroundConfig, resetToDefault }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
}
