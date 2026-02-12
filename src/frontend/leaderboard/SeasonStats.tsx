import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import { Trophy, Zap, Target, TrendingUp } from "lucide-react"

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

export function SeasonStats() {
    // Mock data
    return (
        <Card className="border-white/10 bg-black/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight text-white">Season Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        label="Avg Points/Race" 
                        value="42.5" 
                        subtext="Across all players"
                        icon={<Zap className="h-5 w-5 text-yellow-400" />}
                    />
                    <StatCard 
                        label="Highest Score" 
                        value="124" 
                        subtext="Max Verstappen (R5)"
                        icon={<Trophy className="h-5 w-5 text-amber-500" />}
                    />
                    <StatCard 
                        label="Perfect Picks" 
                        value="12" 
                        subtext="Total exact podiums"
                        icon={<Target className="h-5 w-5 text-red-500" />}
                    />
                    <StatCard 
                        label="Most Improved" 
                        value="+5" 
                        subtext="Lando Norris (Last 3 races)"
                        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
