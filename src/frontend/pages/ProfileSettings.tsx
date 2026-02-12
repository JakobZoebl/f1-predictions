"use client"

import React from "react"
import { ProfileDetails } from "@/frontend/components/profile-settings/ProfileDetails"
import { ThemeCustomization } from "@/frontend/components/profile-settings/ThemeCustomization"
import { SecuritySettings } from "@/frontend/components/profile-settings/SecuritySettings"
import { SeasonRecap } from "@/frontend/components/profile-settings/SeasonRecap"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Background } from "@/frontend/components/blank-background"
import "@/frontend/styles/ProfileSettings.css"

export default function ProfileSettings() {
  return (
    <F1Background>
      <F1Header activeNav="Profile" />
      
      <main className="profile-settings-page relative pt-24">
        <div className="profile-settings-grid">
            <ProfileDetails />
            <ThemeCustomization />
        </div>
        
        <div className="mt-6">
            <SecuritySettings />
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
            <SeasonRecap />
        </div>
      </main>
    </F1Background>
  )
}
