import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/frontend/components/table"
import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react"
import { Link } from "react-router-dom"

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string
  points: number
  movement: number // 0 for no change, positive for up, negative for down
  avatarUrl?: string
    countryCode?: string // Added for flag display if needed
}

interface MiniLeaderboardProps {
  data: LeaderboardEntry[]
  currentUserId?: string
}

export function MiniLeaderboard({ data, currentUserId }: MiniLeaderboardProps) {
  const getMovementIcon = (movement: number) => {
    if (movement > 0) return <ArrowUp className="h-3 w-3 text-green-500" />
    if (movement < 0) return <ArrowDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Trophy className="h-4 w-4 text-amber-600" />
    return <span className="font-mono font-bold text-muted-foreground text-sm">#{rank}</span>
  }

  return (
    <Card className="mini-leaderboard-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="leaderboard-title">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Table>
          <TableBody>
            {data.slice(0, 5).map((entry) => ( // Show top 5
              <TableRow
                key={entry.userId}
                className={`leaderboard-row ${
                  currentUserId === entry.userId ? "leaderboard-row-active" : ""
                }`}
              >
                <TableCell className="rank-cell">
                    <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                    </div>
                </TableCell>
                <TableCell className="user-cell">
                  <div className="user-info-wrapper">
                    {/* Simplified Avatar */}
                    <span className={`user-display-name ${currentUserId === entry.userId ? "user-name-active" : "user-name-inactive"}`}>
                        {currentUserId === entry.userId ? "YOU" : entry.displayName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="points-cell">
                  ({entry.points}pts)
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         <div className="leaderboard-footer">
            <Link to="/leaderboard" className="view-all-link">
                View All
            </Link>
        </div>
      </CardContent>
    </Card>
  )
}
