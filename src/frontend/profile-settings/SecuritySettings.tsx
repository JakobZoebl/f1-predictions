"use client"

import "@/frontend/styles/ProfileSettings.css"
import { LogOut } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="settings-container security-container">
      <h2>Change Password</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="settings-field">
          <label className="settings-label">Current Password</label>
          <input 
            type="password" 
            className="settings-input" 
            placeholder="••••••••"
          />
        </div>
        
        <div className="settings-field">
          <label className="settings-label">New Password</label>
          <input 
            type="password" 
            className="settings-input" 
            placeholder="••••••••"
          />
        </div>

        <div className="settings-field md:col-span-2">
          <label className="settings-label">Confirm New Password</label>
          <input 
            type="password" 
            className="settings-input" 
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
        >
          Update Password
        </button>

        <button className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-2 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign out of all devices
        </button>
      </div>
    </div>
  )
}
