"use client"

import { useState } from "react"
import { useRef } from "react"
import "@/frontend/styles/ProfileSettings.css"
import { User, Camera, Trash2, Check, Loader2 } from "lucide-react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

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
  
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { session } = useAuth()
  const { profile, refetch } = useUserProfile()

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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session?.access_token) return

    setUploadingAvatar(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to upload avatar.")
      }

      // Refresh the global profile cache
      await refetch()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar.")
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDeleteAvatar() {
    if (!session?.access_token || deletingAvatar) return

    setDeletingAvatar(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/profile/avatar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to delete avatar.")
      }

      // Refresh the global profile cache
      await refetch()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete avatar.")
    } finally {
      setDeletingAvatar(false)
    }
  }

  return (
    <div className="settings-container">
      <h2>Profile Details</h2>
      
      <div className="profile-avatar-upload">
        <div className="avatar-preview" style={{ overflow: "hidden", position: "relative" }}>
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile Avatar" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          ) : (
            <User className="h-8 w-8 text-white/50" />
          )}
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleAvatarUpload} 
          style={{ display: 'none' }}
        />
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar || deletingAvatar}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploadingAvatar ? "Uploading..." : "Change Photo"}
          </button>
          
          {profile?.avatar_url && (
            <button 
              onClick={handleDeleteAvatar}
              disabled={uploadingAvatar || deletingAvatar}
              className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deletingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {deletingAvatar ? "Deleting..." : "Delete Photo"}
            </button>
          )}
        </div>
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
