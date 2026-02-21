import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import { Trophy, Zap, Target, TrendingUp, Loader2 } from "lucide-react"

interface SeasonStatProps {
  label: string
  value: string | number
  subtext: string
  icon: React.ReactNode
}

function StatCard({ label, value, subtext, icon }: SeasonStatProps) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-white/60">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/40">{subtext}</p>
            </div>
        </div>
    )
}

interface StatsData {
    avgPoints: number
    highestScore: { value: number; subtext: string }
    activePlayers: number
    totalPredictions: number
}

export function SeasonStats() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/leaderboard/stats')
                const data = await response.json()
                if (data.success) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error("Error fetching season stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <Card className="border-white/10 bg-black/40 backdrop-blur-md">
                <CardContent className="h-40 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-white/10 bg-black/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wider text-white italic shadow-sm border-b border-white/10 pb-4 mb-4 select-none" style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}>Season Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        label="Avg Points/Race" 
                        value={stats?.avgPoints || "0"} 
                        subtext="Across all players"
                        icon={<Zap className="h-5 w-5 text-yellow-400" />}
                    />
                    <StatCard 
                        label="Highest Score" 
                        value={stats?.highestScore.value || "0"} 
                        subtext={stats?.highestScore.subtext || "No records yet"}
                        icon={<Trophy className="h-5 w-5 text-amber-500" />}
                    />
                    <StatCard 
                        label="Active Players" 
                        value={stats?.activePlayers || "0"} 
                        subtext="Joined the league"
                        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                    />
                    <StatCard 
                        label="Total Predictions" 
                        value={stats?.totalPredictions || "0"} 
                        subtext="Submissions this season"
                        icon={<Target className="h-5 w-5 text-red-500" />}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
