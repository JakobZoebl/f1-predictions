"use client"

import React from "react"
import "@/frontend/styles/ProfileSettings.css"
import { User, Camera } from "lucide-react"

export function ProfileDetails() {
  return (
    <div className="settings-container">
      <h2>Profile Details</h2>
      
      <div className="profile-avatar-upload">
        <div className="avatar-preview">
          <User className="h-8 w-8 text-white/50" />
        </div>
        <button className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Change Photo
        </button>
      </div>

      <div className="settings-field">
        <label className="settings-label">Username</label>
        <input type="text" className="settings-input" defaultValue="JakobZoebl" disabled />
        <span className="text-xs text-white/40 italic mt-1">This cannot be changed</span>
      </div>

      <div className="settings-field">
        <label className="settings-label">Display Name</label>
        <input type="text" className="settings-input" defaultValue="Jakob Zoebl" />
      </div>

      <div className="settings-field">
        <label className="settings-label">Email</label>
        <input type="email" className="settings-input" defaultValue="jakob@example.com" />
      </div>
    </div>
  )
}
