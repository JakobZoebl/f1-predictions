import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/table"
import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react"

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string
  points: number
  movement: number // 0 for no change, positive for up, negative for down
  avatarUrl?: string
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
  currentUserId?: string
}

export function LeaderboardTable({ data, currentUserId }: LeaderboardTableProps) {
  const getMovementIcon = (movement: number) => {
    if (movement > 0) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (movement < 0) return <ArrowDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
    return <span className="font-mono font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight text-white">Current Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Predictor</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="w-16 text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow
                key={entry.userId}
                className={`border-white/5 transition-colors ${
                  currentUserId === entry.userId ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
                }`}
              >
                <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={entry.avatarUrl} alt={entry.username} />
                      <AvatarFallback className="bg-white/10 text-xs text-white">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{entry.displayName}</span>
                      <span className="text-xs text-white/50">@{entry.username}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white">
                  {entry.points.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {getMovementIcon(entry.movement)}
                    {entry.movement !== 0 && (
                      <span
                        className={`text-xs font-bold ${
                          entry.movement > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {Math.abs(entry.movement)}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
