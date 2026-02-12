"use client"

import React from "react"
import "@/frontend/styles/ProfileSettings.css"
import { Shield, Key, LogOut } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="settings-container security-container">
      <h2>Security</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-white/70" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Password</h3>
            </div>
            
             <button className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex justify-between items-center group">
                <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-xs text-white/50">Last changed 3 months ago</p>
                </div>
                <div className="text-xs bg-white/10 px-2 py-1 rounded group-hover:bg-white/20">Update</div>
            </button>
        </div>

        <div>
             <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-white/70" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Two-Factor Authentication</h3>
            </div>
             <button className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex justify-between items-center group">
                <div>
                    <p className="font-medium">2FA is enabled</p>
                    <p className="text-xs text-green-400">Protected via Authenticator App</p>
                </div>
                 <div className="text-xs bg-white/10 px-2 py-1 rounded group-hover:bg-white/20">Configure</div>
            </button>
        </div>
      </div>

       <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
           <button className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-2">
               <LogOut className="h-4 w-4" />
               Sign out of all devices
           </button>
       </div>
    </div>
  )
}
