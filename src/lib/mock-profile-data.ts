
export const MOCK_PROFILE = {
  user: {
    username: "supermax33",
    displayName: "Max Verstappen Fan",
    memberSince: "Jan 2026",
    rank: 4,
    totalPoints: 987,
    avatarUrl: "/avatars/user-1.png", // specific avatar if available, else placeholder
  },
  constructor: {
    standingsPos: 1,
    standingsPoints: 151,
    seasonStats: {
      races: 1,
      wins: 1,
      podiums: 2,
      dnfs: 0,
    },
    recentResults: ["P1", "P3"],
    userPredictions: {
      exactPosition: 1, // points
      yourPosition: 3,
      total: 40,
    }
  },
  driver: {
    standingsPos: 1,
    standingsPoints: 87,
    seasonStats: {
      races: 1,
      wins: 1,
      podiums: 1,
      poles: 1,
      fastestLaps: 0,
    },
    recentResults: ["P1"], // e.g. "P1" icon
    userPredictions: {
      exactMatches: "4.4%",
      polePosition: "3.0%",
      accuracy: "1.6%",
    }
  },
  seasonStats: {
    rank: 4,
    totalPoints: 87,
    behindLeader: 37,
    avgPoints: 87.0,
    bestRace: "Bahrain",
    worstRace: "Saudi Arabia",
    currentStreak: 3, // hot streak
    consistencyScore: 92, // 0-100
    accuracyBars: {
        exact: 75,
        top10: 90,
        pole: 40,
        fastest: 60,
        safety: 20,
        redFlag: 0
    }
  },
  // History tables mock data can be added later if needed
}
