# F1 PREDICTIONS - SECTION 5: API ENDPOINTS & EXTERNAL APIS

## Copy-paste this when building API routes and integrating F1 data

---

## INTERNAL API ENDPOINTS (Next.js API Routes)

### Authentication Endpoints

**POST /api/auth/signup**
```typescript
// Request body
{
  email: string,
  username: string,
  display_name: string,
  password: string
}

// Response
{
  success: boolean,
  user?: { id: string, email: string },
  error?: string
}
```

**POST /api/auth/login**
```typescript
// Request body
{ email: string, password: string }

// Response
{ success: boolean, session?: Session, error?: string }
```

---

### Prediction Endpoints

**POST /api/predictions/race**
```typescript
// Request body
{
  race_id: number,
  p1_driver: string,
  p2_driver: string,
  // ... p3 through p10
  c1_constructor: string,
  // ... c2 through c5
  pole_position: string,
  fastest_lap: string,
  first_retirement: string,
  safety_car: boolean,
  red_flag: boolean
}

// Response
{
  success: boolean,
  prediction_id?: number,
  error?: string
}

// Validation:
// - User authenticated (from session)
// - Race exists and is open for predictions
// - Deadline not passed
// - No duplicate drivers
// - No duplicate constructors
```

**GET /api/predictions/race/[raceId]**
```typescript
// Query params: raceId
// Headers: Authorization (session)

// Response
{
  prediction: {
    id: number,
    user_id: string,
    race_id: number,
    p1_driver: string,
    // ... all prediction fields
    points: number,
    submitted_at: string
  } | null
}
```

**POST /api/predictions/sprint**
```typescript
// Similar to race predictions but with sprint fields
// sp1_driver through sp8_driver instead of p1-p10
```

**POST /api/predictions/season**
```typescript
// Request body
{
  season: number,
  d1_driver: string,
  // ... d2 through d20
  c1_constructor: string,
  // ... c2 through c10
  most_poles: string,
  most_fastest_laps: string
}

// Validation:
// - User authenticated
// - Round 1 hasn't started yet (check races table)
// - No duplicate drivers
// - No duplicate constructors
```

---

### Leaderboard Endpoints

**GET /api/leaderboard**
```typescript
// Query params (optional):
// - season: number (default: current season)
// - limit: number (default: all users)

// Response
{
  leaderboard: [
    {
      user_id: string,
      username: string,
      display_name: string,
      total_points: number,
      rank: number,
      avg_points_per_race: number,
      races_predicted: number,
      rank_change: number  // compared to last race
    }
  ]
}
```

**GET /api/leaderboard/chart-data**
```typescript
// For the points progression chart

// Response
{
  races: [
    { round: 1, name: "Bahrain GP" },
    { round: 2, name: "Saudi Arabian GP" },
    // ...
  ],
  users: [
    {
      username: "user1",
      points_by_race: [
        { round: 1, points: 87, cumulative: 87 },
        { round: 2, points: 124, cumulative: 211 },
        // ...
      ]
    }
  ]
}
```

---

### Race Management Endpoints

**GET /api/races**
```typescript
// Query params (optional):
// - season: number
// - status: 'upcoming' | 'locked' | 'completed'

// Response
{
  races: [
    {
      id: number,
      season: number,
      round: number,
      name: string,
      circuit: string,
      country: string,
      date: string,
      cutoff: string,
      has_sprint: boolean,
      status: string
    }
  ]
}
```

**GET /api/races/next**
```typescript
// Get the next upcoming race

// Response
{
  race: {
    id: number,
    name: string,
    date: string,
    cutoff: string,
    has_sprint: boolean,
    countdown_seconds: number  // time until cutoff
  } | null
}
```

---

### Profile Endpoints

**GET /api/profile/[userId]**
```typescript
// Response
{
  user: {
    username: string,
    display_name: string,
    favorite_team_id: string,
    favorite_driver_id: string
  },
  stats: {
    total_points: number,
    rank: number,
    avg_points_per_race: number,
    best_race: { name: string, points: number },
    worst_race: { name: string, points: number },
    accuracy: {
      top_10_correct: number,
      total_predictions: number,
      percentage: number
    },
    points_breakdown: {
      driver_positions: number,
      constructors: number,
      pole_position: number,
      fastest_lap: number,
      other_bonuses: number
    }
  }
}
```

**PUT /api/profile**
```typescript
// Update user profile (authenticated)

// Request body
{
  display_name?: string,
  favorite_team_id?: string,
  favorite_driver_id?: string
}

// Response
{ success: boolean, error?: string }
```

---

### Admin Endpoints

**POST /api/admin/races**
```typescript
// Create new race (admin only)

// Request body
{
  season: number,
  round: number,
  name: string,
  circuit: string,
  country: string,
  date: string,  // ISO format
  cutoff: string,  // ISO format
  has_sprint: boolean
}

// Validation:
// - User is admin
// - No duplicate season/round combination
```

**PUT /api/admin/races/[raceId]**
```typescript
// Update race details (admin only)
// Same fields as POST
```

**DELETE /api/admin/races/[raceId]**
```typescript
// Delete race (admin only)
// Also deletes associated predictions and results
```

**POST /api/admin/results**
```typescript
// Enter race results (admin only)

// Request body
{
  race_id: number,
  p1_driver: string,
  // ... p2 through p10
  c1_constructor: string,
  // ... c2 through c5
  pole_position: string,
  fastest_lap: string,
  first_retirement: string,
  safety_car: boolean,
  red_flag: boolean
}

// After saving results, automatically trigger:
// POST /api/admin/calculate-points with race_id
```

**POST /api/admin/calculate-points**
```typescript
// Calculate points for all predictions for a race (admin only)

// Request body
{ race_id: number }

// Process:
// 1. Fetch race results
// 2. Fetch all predictions for that race
// 3. For each prediction:
//    - Compare with results
//    - Calculate points using scoring rules
//    - Update prediction.points
//    - Create entry in points_log
// 4. Refresh leaderboard materialized view

// Response
{
  success: boolean,
  predictions_updated: number,
  error?: string
}
```

**POST /api/admin/fetch-results**
```typescript
// Fetch results from Jolpica API and save (admin only)

// Request body
{ race_id: number }

// Process:
// 1. Get race season and round from database
// 2. Call Jolpica API
// 3. Parse response
// 4. Save to results table
// 5. Trigger calculate-points

// Response
{ success: boolean, source: 'api' | 'manual', error?: string }
```

---

### Cron Job Endpoint

**GET /api/cron/fetch-results**
```typescript
// Vercel Cron job - runs automatically after races

// Headers required:
// Authorization: Bearer [CRON_SECRET]

// Process:
// 1. Verify cron secret
// 2. Find races with:
//    - status = 'completed'
//    - No results entry yet
//    - cutoff time has passed
// 3. For each race:
//    - Fetch from Jolpica API
//    - Save results
//    - Calculate points
//    - Update race status
// 4. Send email notifications (optional)

// Response
{
  success: boolean,
  races_processed: number,
  errors: string[]
}
```

---

## EXTERNAL F1 APIS

### Jolpica F1 API (Primary - Ergast replacement)

**Base URL:** https://api.jolpi.ca/ergast/f1/

**Get Race Results:**
```
GET /api/jolpi.ca/ergast/f1/{season}/{round}/results.json

Example:
GET https://api.jolpi.ca/ergast/f1/2026/1/results.json
```

**Response Structure:**
```json
{
  "MRData": {
    "RaceTable": {
      "Races": [
        {
          "season": "2026",
          "round": "1",
          "raceName": "Bahrain Grand Prix",
          "Circuit": {
            "circuitName": "Bahrain International Circuit"
          },
          "Results": [
            {
              "position": "1",
              "Driver": {
                "givenName": "Max",
                "familyName": "Verstappen"
              },
              "Constructor": {
                "name": "Red Bull"
              },
              "grid": "1",  // Starting position (pole)
              "FastestLap": {
                "rank": "1"  // If fastest lap
              }
            }
            // ... positions 2-20
          ]
        }
      ]
    }
  }
}
```

**Get Qualifying Results (for pole position):**
```
GET /api/jolpi.ca/ergast/f1/{season}/{round}/qualifying.json
```

**Parsing Example:**
```typescript
async function fetchRaceResults(season: number, round: number) {
  const url = `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`
  const response = await fetch(url)
  const data = await response.json()
  
  const race = data.MRData.RaceTable.Races[0]
  const results = race.Results
  
  // Parse top 10
  const top10 = results.slice(0, 10).map(r => 
    `${r.Driver.givenName} ${r.Driver.familyName}`
  )
  
  // Find fastest lap
  const fastestLap = results.find(r => r.FastestLap?.rank === "1")
  
  // Get pole position from qualifying
  const qualUrl = `https://api.jolpi.ca/ergast/f1/${season}/${round}/qualifying.json`
  const qualResponse = await fetch(qualUrl)
  const qualData = await qualResponse.json()
  const pole = qualData.MRData.RaceTable.Races[0].QualifyingResults[0]
  
  return {
    p1_driver: top10[0],
    p2_driver: top10[1],
    // ... etc
    pole_position: `${pole.Driver.givenName} ${pole.Driver.familyName}`,
    fastest_lap: fastestLap ? `${fastestLap.Driver.givenName} ${fastestLap.Driver.familyName}` : null
  }
}
```

**Rate Limits:**
- 4 requests/second
- 200 requests/hour
- Should be fine for your use case

---

### OpenF1 API (Real-time data - optional)

**Base URL:** https://api.openf1.org/v1/

**Use for:**
- Live timing during races
- Telemetry data
- Position tracking

**Example:**
```
GET https://api.openf1.org/v1/position?session_key=latest

Response:
[
  {
    "driver_number": 1,
    "position": 1,
    "date": "2026-03-02T14:30:00Z"
  }
]
```

**Note:** Only use if you want real-time features during race

---

### FastF1 (Python library - optional)

**If you need more detailed data:**
```python
import fastf1

# Load race session
session = fastf1.get_session(2026, 'Bahrain', 'R')
session.load()

# Get results
results = session.results

# Get lap times, telemetry, etc.
```

**Note:** Would require Python backend or separate script

---

## DATA FETCHING STRATEGIES

### Race Results Auto-Fetch

**Trigger:** Vercel Cron job 2 hours after race end

**Flow:**
1. Cron job runs (`/api/cron/fetch-results`)
2. Finds completed races without results
3. Calls Jolpica API for each
4. Saves to database
5. Calculates all user points
6. Updates leaderboard
7. (Optional) Sends email notifications

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/fetch-results",
      "schedule": "0 */2 * * 0"  // Every 2 hours on Sundays
    }
  ]
}
```

---

### Manual Results Entry (Admin Fallback)

**If API fails or data not available:**
1. Admin goes to `/admin/results`
2. Selects race from dropdown
3. Clicks "Fetch from API" button
4. If fails, manually fills form
5. Saves results
6. Points calculated automatically

---

## ERROR HANDLING

**API Call Failures:**
```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

**Rate Limit Handling:**
```typescript
// Simple rate limiter
class RateLimiter {
  private queue: (() => Promise<any>)[] = []
  private processing = false
  private lastCall = 0
  private minInterval = 250  // 4 per second max
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now()
          const wait = Math.max(0, this.minInterval - (now - this.lastCall))
          if (wait > 0) await new Promise(r => setTimeout(r, wait))
          
          this.lastCall = Date.now()
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      if (!this.processing) this.process()
    })
  }
  
  private async process() {
    this.processing = true
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!
      await fn()
    }
    this.processing = false
  }
}

const jolpicaLimiter = new RateLimiter()

// Usage
const results = await jolpicaLimiter.add(() => 
  fetch('https://api.jolpi.ca/ergast/f1/2026/1/results.json')
)
```

---

## CACHING STRATEGIES

**Race Results (immutable after completion):**
```typescript
// Cache for 1 week
const cacheResults = new Map<number, any>()

async function getResults(raceId: number) {
  if (cacheResults.has(raceId)) {
    return cacheResults.get(raceId)
  }
  
  const results = await fetchFromDatabase(raceId)
  cacheResults.set(raceId, results)
  return results
}
```

**Leaderboard (updates after each race):**
```typescript
// Cache for 5 minutes
let leaderboardCache: { data: any, timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000  // 5 minutes

async function getLeaderboard() {
  const now = Date.now()
  
  if (leaderboardCache && (now - leaderboardCache.timestamp) < CACHE_TTL) {
    return leaderboardCache.data
  }
  
  const data = await fetchLeaderboardFromDatabase()
  leaderboardCache = { data, timestamp: now }
  return data
}
```

---

## Use this for:
1. Building Next.js API routes
2. Integrating Jolpica F1 API
3. Setting up Vercel Cron jobs
4. Implementing admin endpoints
5. Creating prediction endpoints
6. Building leaderboard API
7. Handling errors and retries
8. Rate limiting external APIs
