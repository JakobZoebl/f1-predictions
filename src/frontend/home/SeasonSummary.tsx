import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import { Progress } from "@/frontend/components/progress"
import { ArrowUp, User } from "lucide-react"

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

export function SeasonSummary() {
  return (
    <Card className="season-summary-card">
      <CardHeader className="pb-2">
        <div className="summary-header-content">
            <div className="summary-user-icon-wrapper">
                <User className="summary-user-icon" />
            </div>
            <div>
                 <CardTitle className="summary-title">Your Season Summary</CardTitle>
                 <p className="summary-username">@username</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="summary-stats-grid">
            <StatItem 
                label="Rank" 
                value="#4" 
                subElement={
                    <div className="rank-movement">
                        <ArrowUp className="h-3 w-3 mr-0.5" />
                        <span>+2</span>
                    </div>
                }
            />
            <StatItem 
                label="Points" 
                value="87" 
                subElement={<span className="points-unit">Points</span>}
                footer="Avg. 87.0"
            />
            <StatItem 
                label="Last Race" 
                value="Bahrain" 
                footer="(P3, 87pts)"
            />
        </div>

        <div className="summary-footer">
             <div className="predictions-progress-wrapper">
                 <div className="progress-header">
                     <span>Predictions Made: 1/2</span>
                     <span className="text-white/50">Best Finish: #2</span>
                 </div>
                 <Progress value={50} className="progress-bar-bg" indicatorClassName="progress-bar-indicator" />
             </div>
        </div>
      </CardContent>
    </Card>
  )
}
