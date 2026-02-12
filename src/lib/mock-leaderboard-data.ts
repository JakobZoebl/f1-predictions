import type { LeaderboardEntry } from "@/frontend/leaderboard/LeaderboardTable"
import type { UserPointsHistory } from "@/frontend/leaderboard/PointsHistoryChart"

export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  { 
      rank: 1, 
      userId: "1", 
      username: "maxverstappen", 
      displayName: "Max Verstappen", 
      points: 1247, 
      movement: 0,
      avatarUrl: undefined 
  },
  { 
      rank: 2, 
      userId: "2", 
      username: "landonorris", 
      displayName: "Lando Norris", 
      points: 1198, 
      movement: 1,
      avatarUrl: undefined
  },
  { 
      rank: 3, 
      userId: "3", 
      username: "charlesleclerc", 
      displayName: "Charles Leclerc", 
      points: 1156, 
      movement: -1,
      avatarUrl: undefined 
  },
  { 
      rank: 4, 
      userId: "4", 
      username: "lewishamilton", 
      displayName: "Lewis Hamilton", 
      points: 987, 
      movement: 2,
      avatarUrl: undefined 
  },
  { 
      rank: 5, 
      userId: "5", 
      username: "oscarpiastri", 
      displayName: "Oscar Piastri", 
      points: 850, 
      movement: 0,
      avatarUrl: undefined 
  },
]

export const MOCK_POINTS_HISTORY: UserPointsHistory[] = [
    {
        userId: "1",
        username: "Max Verstappen",
        color: "#1e3264", // Red Bull Blue
        history: [
            { round: 1, raceName: "Bahrain", points: 25, cumulativePoints: 25 },
            { round: 2, raceName: "Saudi Arabia", points: 18, cumulativePoints: 43 },
            { round: 3, raceName: "Australia", points: 15, cumulativePoints: 58 },
            { round: 4, raceName: "Japan", points: 25, cumulativePoints: 83 },
            { round: 5, raceName: "China", points: 26, cumulativePoints: 109 },
        ]
    },
    {
        userId: "2",
        username: "Lando Norris",
        color: "#ff8700", // McLaren Orange
        history: [
            { round: 1, raceName: "Bahrain", points: 12, cumulativePoints: 12 },
            { round: 2, raceName: "Saudi Arabia", points: 15, cumulativePoints: 27 },
            { round: 3, raceName: "Australia", points: 18, cumulativePoints: 45 },
            { round: 4, raceName: "Japan", points: 12, cumulativePoints: 57 },
            { round: 5, raceName: "China", points: 15, cumulativePoints: 72 },
        ]
    },
    {
        userId: "3",
        username: "Charles Leclerc",
        color: "#dc0000", // Ferrari Red
        history: [
            { round: 1, raceName: "Bahrain", points: 15, cumulativePoints: 15 },
            { round: 2, raceName: "Saudi Arabia", points: 12, cumulativePoints: 27 },
            { round: 3, raceName: "Australia", points: 25, cumulativePoints: 52 },
            { round: 4, raceName: "Japan", points: 18, cumulativePoints: 70 },
            { round: 5, raceName: "China", points: 12, cumulativePoints: 82 },
        ]
    },
    {
        userId: "4",
        username: "Lewis Hamilton",
        color: "#00d2be", // Mercedes Teal (using old color for contrast for now or Ferrari if next year) - keeping Teal for distinction
        history: [
            { round: 1, raceName: "Bahrain", points: 10, cumulativePoints: 10 },
            { round: 2, raceName: "Saudi Arabia", points: 8, cumulativePoints: 18 },
            { round: 3, raceName: "Australia", points: 0, cumulativePoints: 18 },
            { round: 4, raceName: "Japan", points: 10, cumulativePoints: 28 },
            { round: 5, raceName: "China", points: 18, cumulativePoints: 46 },
        ]
    },
    {
        userId: "5",
        username: "Oscar Piastri",
        color: "#47c7fc", // McLaren Blue (Secondary)
        history: [
            { round: 1, raceName: "Bahrain", points: 8, cumulativePoints: 8 },
            { round: 2, raceName: "Saudi Arabia", points: 10, cumulativePoints: 18 },
            { round: 3, raceName: "Australia", points: 12, cumulativePoints: 30 },
            { round: 4, raceName: "Japan", points: 8, cumulativePoints: 38 },
            { round: 5, raceName: "China", points: 10, cumulativePoints: 48 },
        ]
    },
]
