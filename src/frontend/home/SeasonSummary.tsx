import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import { Progress } from "@/frontend/components/progress"
import { User } from "lucide-react"

interface StatItemProps {
    label: string
    value: React.ReactNode
    subElement?: React.ReactNode
    footer?: React.ReactNode
}

function StatItem({ label, value, subElement, footer }: StatItemProps) {
    return (
        <div className="flex flex-col min-w-0">
            <div className="stat-label uppercase tracking-wider mb-1">{label}</div>
            <div className="flex items-baseline gap-2 overflow-hidden">
                <span className="stat-value">{value}</span>
                {subElement}
            </div>
            {footer && <div className="stat-footer">{footer}</div>}
        </div>
    )
}

export interface SeasonStats {
    rank: string
    total_points: number
    avg_points: number
    races_predicted: number
    total_completed_races: number
    last_race: {
        name: string
        points: string | number
    }
    best_finish: string
}

interface SeasonSummaryProps {
    username?: string
    avatarUrl?: string | null
    stats?: SeasonStats | null
    loading?: boolean
}

export function SeasonSummary({ username, avatarUrl, stats, loading }: SeasonSummaryProps) {
  const displayUsername = username ? `@${username}` : "@username"
  
  if (loading) {
      return (
        <Card className="season-summary-card animate-pulse">
            <CardContent className="h-[200px] flex items-center justify-center">
                <p className="text-white/30">Loading stats...</p>
            </CardContent>
        </Card>
      )
  }

  const predictionsProgress = stats?.total_completed_races 
      ? (stats.races_predicted / stats.total_completed_races) * 100 
      : 0

  return (
    <Card className="season-summary-card">
      <CardHeader className="pb-2">
        <div className="summary-header-content">
            <div className="summary-user-icon-wrapper" style={{ overflow: "hidden", position: "relative" }}>
                 {avatarUrl ? (
                     <img 
                       src={avatarUrl} 
                       alt="User Avatar" 
                       style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                     />
                 ) : (
                     <User className="summary-user-icon" />
                 )}
            </div>
            <div>
                 <CardTitle className="summary-title">Your Season Summary</CardTitle>
                 <p className="summary-username">{displayUsername}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="summary-stats-grid">
            <StatItem 
                label="Rank" 
                value={stats?.rank || "-"} 
            />
            <StatItem 
                label="Points" 
                value={stats?.total_points ?? "-"} 
                subElement={<span className="points-unit">Points</span>}
                footer={stats?.avg_points ? `Avg. ${stats.avg_points.toFixed(1)}` : "Avg. -"}
            />
            <StatItem 
                label="Last Race" 
                value={stats?.last_race?.name || "-"} 
                footer={stats?.last_race?.points !== "-" ? `(${stats?.last_race.points}pts)` : "(-)"}
            />
        </div>

        <div className="summary-footer">
             <div className="predictions-progress-wrapper">
                 <div className="progress-header">
                     <span>Predictions Made: {stats?.races_predicted ?? 0}/{stats?.total_completed_races ?? 0}</span>
                     <span className="text-white/50">Best Finish: {stats?.best_finish || "-"}</span>
                 </div>
                 <Progress value={predictionsProgress} className="progress-bar-bg" indicatorClassName="progress-bar-indicator" />
             </div>
        </div>
      </CardContent>
    </Card>
  )
}
