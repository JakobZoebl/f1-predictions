import "@/styles/ProfileHeader.css"

interface ProfileHeaderProps {
  username?: string
  displayName?: string
  memberSince?: string
  rank?: number
  points?: number
}

export function ProfileHeader({
  username = "@username",
  displayName = "Display Name",
  memberSince = "Jan 2026",
  rank = 0,
  points = 0,
}: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      {/* Avatar & Name Group */}
      <div className="profile-header-group">
        <h1 className="profile-header-title">
          <span className="profile-header-username">{username}</span> • {displayName}
        </h1>
        
        {/* Stats Outline Box */}
        <div className="profile-header-stats-pill">
           <span className="profile-header-stat">
             Member since: <span className="profile-header-stat-value">{memberSince}</span>
           </span>
           <span className="profile-header-divider"></span>
           <span className="profile-header-stat">
             #{rank} Overall
           </span>
           <span className="profile-header-divider"></span>
           <span className="profile-header-stat-bold">
             {points} Points
           </span>
        </div>
      </div>
    </div>
  )
}
