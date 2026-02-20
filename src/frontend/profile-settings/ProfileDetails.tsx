"use client"

import { useState } from "react"
import "@/frontend/styles/ProfileSettings.css"
import { User, Camera, Check, Loader2 } from "lucide-react"

interface ProfileDetailsProps {
  username: string
  email: string
  displayName: string
  onSaveDisplayName: (name: string) => Promise<void>
}

export function ProfileDetails({
  username,
  email,
  displayName,
  onSaveDisplayName,
}: ProfileDetailsProps) {
  const [editedName, setEditedName] = useState(displayName)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasChanges = editedName.trim() !== displayName

  async function handleSave() {
    if (!hasChanges || saving) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await onSaveDisplayName(editedName.trim())
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

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
        <input type="text" className="settings-input" value={username} disabled />
        <span className="text-xs text-white/40 italic mt-1">This cannot be changed</span>
      </div>

      <div className="settings-field">
        <label className="settings-label">Display Name</label>
        <input
          type="text"
          className="settings-input"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <label className="settings-label">Email</label>
        <input type="email" className="settings-input" value={email} disabled />
        <span className="text-xs text-white/40 italic mt-1">Managed through your login provider</span>
      </div>

      {/* Save button + feedback */}
      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            "Save Changes"
          )}
        </button>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
          <Check className="h-4 w-4" /> Display name updated!
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-400 text-sm">{error}</div>
      )}
    </div>
  )
}
