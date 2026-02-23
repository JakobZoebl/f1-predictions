"use client"

import { useState } from "react"
import "@/frontend/styles/ProfileSettings.css"
import { LogOut, Loader2, Check, Trash2, AlertTriangle } from "lucide-react"

interface SecuritySettingsProps {
  onUpdatePassword: (newPassword: string) => Promise<void>
  onSignOut: () => Promise<void>
  onDeleteAccount: () => Promise<void>
}

export function SecuritySettings({ onUpdatePassword, onSignOut, onDeleteAccount }: SecuritySettingsProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleUpdatePassword() {
    // ... validation ...
    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await onUpdatePassword(newPassword)
      setSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setError(null)
    try {
      await onDeleteAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account.")
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="settings-container security-container">
      <h2>Security & Account</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="settings-field">
          <label className="settings-label">New Password</label>
          <input 
            type="password" 
            className="settings-input" 
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Confirm New Password</label>
          <input 
            type="password" 
            className="settings-input" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {success && (
        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
          <Check className="h-4 w-4" /> Password updated successfully!
        </div>
      )}

      <div className="sign-out-container">
        <button 
          onClick={handleUpdatePassword}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
          ) : (
            "Update Password"
          )}
        </button>

        <div className="sign-out-group">
          <div className="auth-action-group">
            <button 
              onClick={onSignOut}
              className="auth-action-button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="delete-account-group">
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-account-button"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-warning">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            This decision is final! Are you sure you want to delete your account?
          </div>
          <div className="delete-confirmation-actions">
            <button 
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="confirm-delete-btn flex items-center gap-2"
            >
              {deleting ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Deleting...</>
              ) : (
                "Yes, Delete Account"
              )}
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              className="cancel-delete-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
