# F1 PREDICTIONS - SECTION 3: STATS & VISUALIZATION SPECIFICATIONS

## Copy-paste this when building leaderboard, profile, and stats components

---

## PROFILE STATS (User's Personal Page)

### Overview Stats
- **Total Points** (with trend indicator ↑↓)
- **Average Points per Race**
- **Best Race Performance** (race name + points earned)
- **Worst Race Performance** (race name + points earned)
- **Current Rank** (#X of Y users)
- **Points Behind Leader**

### Prediction Accuracy Stats

**Correct Top 10 Picks:** X/Y drivers (percentage)
- Example: 8/10 (80%)
- Count how many predicted drivers actually finished in top 10

**Bonus Prediction Success Rate:**
- Pole Position: X/Y (percentage)
- Fastest Lap: X/Y (percentage)
- First Retirement: X/Y (percentage)
- Safety Car: X/Y (percentage)
- Red Flag: X/Y (percentage)

**Current Streak:**
- Count consecutive races with 50+ points scored
- Display as "🔥 5 race streak" or similar

**Favorite Driver/Constructor Performance:**
- Show how often they picked their favorite driver in top 10
- Show actual performance of favorite constructor
- Correlation analysis (optional)

### Donut Chart: Points Breakdown by Category
**Purpose:** Visual representation of where user's points come from

**Categories:**
1. Driver Positions (top 10 predictions)
2. Constructor Predictions (top 5)
3. Pole Position
4. Fastest Lap
5. Other Bonuses (retirement, safety car, red flag)

**Implementation:**
```typescript
// Data structure for Recharts PieChart
const data = [
  { name: 'Drivers', value: 234, fill: '#E10600' },
  { name: 'Constructors', value: 115, fill: '#0600EF' },
  { name: 'Pole', value: 40, fill: '#FFF200' },
  { name: 'Fastest Lap', value: 30, fill: '#00D2BE' },
  { name: 'Other Bonuses', value: 45, fill: '#006F62' }
]

// Show as percentage of total
```

---

## GLOBAL STATS (Leaderboard Page)

### Interactive Line Chart

**Purpose:** Show points progression throughout season for all users

**X-Axis:** Race rounds
- Display as race names (e.g., "Bahrain", "Saudi Arabia", "Australia")
- Or round numbers (R1, R2, R3...)

**Y-Axis:** Points
- Two options per user:
  1. **Cumulative points** (total points up to that race)
  2. **Points per race** (points earned in just that race)
- Toggle between views

**Multiple Lines:**
- One line per user (different colors)
- Color-coded by username or assigned team colors
- Option to show both cumulative and per-race on same chart

**Hover Tooltips:**
- Username
- Total points (cumulative)
- Points for that specific race
- Rank at that point in the season

**Interactive Features:**
- **Toggle users on/off** (checkboxes in legend)
- **Zoom/pan** (optional, for long seasons)
- **Click race point** to see detailed breakdown

**Implementation:**
```typescript
// Recharts LineChart data structure
const chartData = [
  {
    race: 'Bahrain',
    user1: 87,
    user2: 124,
    user3: 105
  },
  {
    race: 'Saudi Arabia',
    user1: 174,  // cumulative
    user2: 248,
    user3: 210
  },
  // ... more races
]
```

---

### Leaderboard Table

**Columns:**
1. **Rank** - Medal icons for top 3 (🥇🥈🥉)
2. **User** - Username or display name
3. **Points** - Total points
4. **Δ (Change)** - Rank change from previous race (↑↓ arrows)
5. **Avg** - Average points per race
6. **Last Race** - Points from most recent race

**Features:**
- **Sortable columns** (click header to sort)
- **Highlight current user's row** (different background color)
- **Points behind leader** (show gap to #1)
- **Recent form** (last 3 races average or trend)

**Example:**
```
| Rank | User          | Points | Δ    | Avg  | Last |
|------|---------------|--------|------|------|------|
| 🥇   | RacingPro47   | 1,247  | -    | 52.0 | 124  |
| 🥈   | F1Fanatic     | 1,198  | ↑1   | 49.9 | 105  |
| 🥉   | SpeedDemon    | 1,156  | ↓1   | 48.2 | 98   |
| 4    | ⭐ YOU        | 987    | ↑2   | 41.1 | 87   |
```

---

### Season Statistics (Global)

**Aggregate Stats:**
- **Average points per race** (across all users)
- **Highest single race score** (username + race + points)
- **Perfect predictions** (count of predictions with all exact matches)
- **Most improved user** (biggest rank jump from start to current)
- **Consistency leader** (lowest standard deviation in points)

---

## RACE-SPECIFIC STATS (After Race Completion)

### Prediction Consensus

**Purpose:** Show what most users predicted

**Display:**
- "80% of users picked Verstappen for pole position"
- "65% predicted Ferrari as top constructor"
- "Only 15% predicted a red flag (and they were right!)"

**Implementation:**
```typescript
// Calculate mode for each prediction field
const consensusData = {
  pole_position: { driver: "Max Verstappen", percentage: 80 },
  p1_driver: { driver: "Max Verstappen", percentage: 75 },
  c1_constructor: { team: "Red Bull Racing", percentage: 70 },
  red_flag: { value: false, percentage: 85 }
}
```

### Head-to-Head Comparison

**Purpose:** Compare two users' predictions side-by-side

**Layout:** Similar to F1 broadcast driver comparison

```
┌─────────────────────────────────────────┐
│  USER A         VS         USER B       │
├──────────────────┬──────────────────────┤
│ RacingPro47      │      F1Fanatic       │
│                  │                      │
│ Total: 1,247pts  │   Total: 1,198pts   │
│ Rank: #1         │   Rank: #2          │
│                  │                      │
│ This Race:       │   This Race:        │
│ 124 pts (#1)     │   105 pts (#3)      │
│                  │                      │
│ Top 10: 8/10 ✓   │   Top 10: 7/10      │
│ Pole: ✓          │   Pole: ✗           │
│ Fastest: ✗       │   Fastest: ✓        │
└──────────────────┴──────────────────────┘
```

### Biggest Upset

**Purpose:** Identify predictions most affected by unexpected results

**Calculation:**
1. Find result with lowest prediction consensus
2. Show how many points users lost/gained because of it

**Example:**
"Biggest Upset: Zhou Guanyu P6 finish
- Only 2% of users predicted this
- Those who did gained 8 points
- Top predictors lost average 12 points"

---

## OPTIONAL VISUALIZATIONS

### Heatmap: Prediction Accuracy

**Purpose:** Show accuracy across all races and users

**Axes:**
- X: Race rounds
- Y: Users
- Color: Accuracy percentage (0-100%)

**Color Scale:**
- Red (0-25%): Poor predictions
- Orange (25-50%): Below average
- Yellow (50-75%): Good
- Green (75-100%): Excellent

### Performance Trends

**Purpose:** Show user's performance over time

**Chart Type:** Area chart or line chart with moving average

**Shows:**
- Points per race (bars)
- 3-race moving average (line)
- Season average (horizontal line)

---

## DATA QUERIES FOR STATS

### For Profile Stats
```sql
-- User's total stats
SELECT 
  SUM(points) as total_points,
  AVG(points) as avg_points,
  MAX(points) as best_race,
  MIN(points) as worst_race,
  COUNT(*) as races_completed
FROM predictions
WHERE user_id = $1;

-- Accuracy stats
SELECT 
  COUNT(CASE WHEN pole_position = results.pole_position THEN 1 END) as pole_correct,
  COUNT(*) as total_predictions
FROM predictions p
JOIN results r ON p.race_id = r.race_id
WHERE p.user_id = $1;
```

### For Leaderboard Chart
```sql
-- Points by race for all users
SELECT 
  u.username,
  r.name as race_name,
  p.points,
  SUM(p.points) OVER (PARTITION BY u.id ORDER BY r.round) as cumulative_points
FROM predictions p
JOIN users u ON p.user_id = u.id
JOIN races r ON p.race_id = r.id
WHERE r.season = 2026
ORDER BY r.round, u.username;
```

### For Consensus Stats
```sql
-- Most common prediction for pole position
SELECT 
  pole_position,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM predictions WHERE race_id = $1), 1) as percentage
FROM predictions
WHERE race_id = $1
GROUP BY pole_position
ORDER BY count DESC
LIMIT 1;
```

---

## CHART LIBRARIES & COMPONENTS

**Primary:** Recharts (React-based, easier to use)

**Components to use:**
- `LineChart` - Points progression
- `PieChart` with `Cell` - Donut chart for breakdown
- `BarChart` - Points per race
- `Tooltip` - Hover information
- `Legend` - Chart legend with toggle functionality

**Alternative:** D3.js (more powerful, steeper learning curve)
- Only use if Recharts can't handle specific visualization

---

## COLOR SCHEME FOR CHARTS

**User Lines (Leaderboard Chart):**
- Use distinct, high-contrast colors
- Avoid similar shades
- Consider colorblind-friendly palette

**Suggested Colors:**
```typescript
const userColors = [
  '#E10600', // F1 Red
  '#0600EF', // Blue
  '#00D2BE', // Teal
  '#FFF200', // Yellow
  '#006F62', // Dark Green
  '#FF8700', // Orange
  '#DC0000', // Ferrari Red
  '#47C7FC', // Light Blue
  '#000000', // Black
  '#AAAAAA'  // Gray
]
```

**Category Colors (Donut Chart):**
- Match F1 team colors where possible
- Maintain brand consistency

---

## RESPONSIVE DESIGN CONSIDERATIONS

**Desktop:**
- Full chart with all users visible
- Table shows all columns
- Side-by-side comparisons

**Tablet:**
- Scrollable table (horizontal scroll)
- Reduced legend, toggle to dropdown
- Chart maintains full height

**Mobile:**
- Table cards instead of table rows
- Chart simplified, fewer data points
- Stack visualizations vertically
- Swipe through user comparisons

---

## Use this for:
1. Building profile stats display
2. Creating leaderboard chart
3. Implementing data visualizations
4. Writing stats queries
5. Designing comparison tools
6. Planning responsive layouts
