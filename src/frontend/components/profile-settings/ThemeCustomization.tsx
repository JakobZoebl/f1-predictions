"use client"

import React from "react"
import "@/frontend/styles/ProfileSettings.css"
import { Sun, Bell, Eye } from "lucide-react"

export function ThemeCustomization() {
  return (
    <div className="settings-container">
      <h2>Theme & Preferences</h2>
      
      <div className="theme-toggle-row">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
                <Sun className="h-5 w-5" />
            </div>
            <div>
                <p className="font-medium">Appearance</p>
                <p className="text-xs text-white/50">Customize interface theme</p>
            </div>
        </div>
        <select className="settings-input py-1 px-3 bg-white/5 border-white/10">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
        </select>
      </div>

       <div className="theme-toggle-row border-t border-white/10 pt-4 mt-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
                <Bell className="h-5 w-5" />
            </div>
            <div>
                <p className="font-medium">Notifications</p>
                <p className="text-xs text-white/50">Race start alerts</p>
            </div>
        </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>

       <div className="theme-toggle-row border-t border-white/10 pt-4 mt-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
                <Eye className="h-5 w-5" />
            </div>
            <div>
                <p className="font-medium">Spoilers</p>
                <p className="text-xs text-white/50">Hide results before watching</p>
            </div>
        </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>

       <div className="theme-toggle-row border-t border-white/10 pt-4 mt-2">
           <div className="w-full">
               <p className="font-medium mb-2">Accent Color</p>
               <div className="flex gap-2">
                   {['#E10600', '#FF8700', '#00D2BE', '#0090D0', '#ffffff'].map(color => (
                       <button 
                        key={color}
                        className="w-8 h-8 rounded-full border border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                       />
                   ))}
               </div>
           </div>
       </div>
    </div>
  )
}
