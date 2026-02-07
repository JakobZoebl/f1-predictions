# F1 PREDICTIONS - SECTION 2: DATABASE SCHEMA

## Copy-paste this into Antigravity's Gemini when setting up Supabase

---

## COMPLETE DATABASE SCHEMA

### Table 1: users (profiles)
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  favorite_team_id VARCHAR(50),
  favorite_driver_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store user profile information
**Notes:**
- `id` references Supabase auth.users table
- `favorite_team_id` and `favorite_driver_id` used for profile theming
- `username` is unique and used for display in leaderboard

---

### Table 2: races
```sql
CREATE TABLE races (
  id SERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  round INTEGER NOT NULL,
  name VARCHAR(100),
  circuit VARCHAR(100),
  country VARCHAR(50),
  date TIMESTAMP,
  cutoff TIMESTAMP,  -- Deadline for predictions
  has_sprint BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'upcoming',  -- 'upcoming', 'locked', 'completed'
  UNIQUE(season, round)
);
```

**Purpose:** Store F1 race calendar
**Status values:**
- `upcoming`: Predictions open
- `locked`: Predictions closed, race in progress or finished
- `completed`: Results entered, points calculated

---

### Table 3: predictions
```sql
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  race_id INTEGER REFERENCES races(id),
  
  -- Top 10 Drivers
  p1_driver VARCHAR(50),
  p2_driver VARCHAR(50),
  p3_driver VARCHAR(50),
  p4_driver VARCHAR(50),
  p5_driver VARCHAR(50),
  p6_driver VARCHAR(50),
  p7_driver VARCHAR(50),
  p8_driver VARCHAR(50),
  p9_driver VARCHAR(50),
  p10_driver VARCHAR(50),
  
  -- Top 5 Constructors
  c1_constructor VARCHAR(50),
  c2_constructor VARCHAR(50),
  c3_constructor VARCHAR(50),
  c4_constructor VARCHAR(50),
  c5_constructor VARCHAR(50),
  
  -- Bonus Predictions
  pole_position VARCHAR(50),
  fastest_lap VARCHAR(50),
  first_retirement VARCHAR(50),  -- Can be "No retirement"
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  
  -- Metadata
  points INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, race_id)
);
```

**Purpose:** Store user predictions for each race
**Notes:**
- One prediction per user per race (enforced by UNIQUE constraint)
- `points` calculated after race completion
- Driver/Constructor names stored as strings (e.g., "Max Verstappen", "Red Bull Racing")

---

### Table 4: sprint_predictions
```sql
CREATE TABLE sprint_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  race_id INTEGER REFERENCES races(id),
  
  -- Top 8 Sprint
  sp1_driver VARCHAR(50),
  sp2_driver VARCHAR(50),
  sp3_driver VARCHAR(50),
  sp4_driver VARCHAR(50),
  sp5_driver VARCHAR(50),
  sp6_driver VARCHAR(50),
  sp7_driver VARCHAR(50),
  sp8_driver VARCHAR(50),
  
  -- Bonus (same as race)
  pole_position VARCHAR(50),
  fastest_lap VARCHAR(50),
  first_retirement VARCHAR(50),
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  
  points INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, race_id)
);
```

**Purpose:** Store sprint predictions (separate from race predictions)

---

### Table 5: season_predictions
```sql
CREATE TABLE season_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  season INTEGER NOT NULL,
  
  -- All 20 Drivers Championship
  d1_driver VARCHAR(50),
  d2_driver VARCHAR(50),
  d3_driver VARCHAR(50),
  d4_driver VARCHAR(50),
  d5_driver VARCHAR(50),
  d6_driver VARCHAR(50),
  d7_driver VARCHAR(50),
  d8_driver VARCHAR(50),
  d9_driver VARCHAR(50),
  d10_driver VARCHAR(50),
  d11_driver VARCHAR(50),
  d12_driver VARCHAR(50),
  d13_driver VARCHAR(50),
  d14_driver VARCHAR(50),
  d15_driver VARCHAR(50),
  d16_driver VARCHAR(50),
  d17_driver VARCHAR(50),
  d18_driver VARCHAR(50),
  d19_driver VARCHAR(50),
  d20_driver VARCHAR(50),
  
  -- All 10 Constructors Championship
  c1_constructor VARCHAR(50),
  c2_constructor VARCHAR(50),
  c3_constructor VARCHAR(50),
  c4_constructor VARCHAR(50),
  c5_constructor VARCHAR(50),
  c6_constructor VARCHAR(50),
  c7_constructor VARCHAR(50),
  c8_constructor VARCHAR(50),
  c9_constructor VARCHAR(50),
  c10_constructor VARCHAR(50),
  
  -- Statistics
  most_poles VARCHAR(50),
  most_fastest_laps VARCHAR(50),
  
  points INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, season)
);
```

**Purpose:** Store season-long predictions
**Notes:**
- `locked` set to TRUE after Round 1 starts
- Points calculated at end of season

---

### Table 6: results
```sql
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  race_id INTEGER REFERENCES races(id),
  
  -- Top 10 Finish
  p1_driver VARCHAR(50),
  p2_driver VARCHAR(50),
  p3_driver VARCHAR(50),
  p4_driver VARCHAR(50),
  p5_driver VARCHAR(50),
  p6_driver VARCHAR(50),
  p7_driver VARCHAR(50),
  p8_driver VARCHAR(50),
  p9_driver VARCHAR(50),
  p10_driver VARCHAR(50),
  
  -- Top 5 Constructors
  c1_constructor VARCHAR(50),
  c2_constructor VARCHAR(50),
  c3_constructor VARCHAR(50),
  c4_constructor VARCHAR(50),
  c5_constructor VARCHAR(50),
  
  -- Bonus Results
  pole_position VARCHAR(50),
  fastest_lap VARCHAR(50),
  first_retirement VARCHAR(50),
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(race_id)
);
```

**Purpose:** Store actual race results for comparison
**Notes:**
- Entered by admin or fetched from API
- Used to calculate prediction points

---

### Table 7: sprint_results
```sql
CREATE TABLE sprint_results (
  id SERIAL PRIMARY KEY,
  race_id INTEGER REFERENCES races(id),
  
  -- Top 8 Sprint
  sp1_driver VARCHAR(50),
  sp2_driver VARCHAR(50),
  sp3_driver VARCHAR(50),
  sp4_driver VARCHAR(50),
  sp5_driver VARCHAR(50),
  sp6_driver VARCHAR(50),
  sp7_driver VARCHAR(50),
  sp8_driver VARCHAR(50),
  
  -- Bonus
  pole_position VARCHAR(50),
  fastest_lap VARCHAR(50),
  first_retirement VARCHAR(50),
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(race_id)
);
```

**Purpose:** Store sprint results

---

### Table 8: points_log
```sql
CREATE TABLE points_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  race_id INTEGER REFERENCES races(id),
  session_type VARCHAR(20),  -- 'race', 'sprint', 'season'
  
  total_points INTEGER,
  
  -- Breakdown (JSONB for flexibility)
  breakdown JSONB,  -- {"driver_positions": 43, "constructors": 25, "pole": 10, ...}
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Audit log of points calculations
**Breakdown example:**
```json
{
  "driver_positions": 43,
  "constructors": 25,
  "pole_position": 10,
  "fastest_lap": 0,
  "first_retirement": 10,
  "safety_car": 5,
  "red_flag": 0
}
```

---

### View 1: leaderboard (Materialized View)
```sql
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  p.user_id,
  u.username,
  u.display_name,
  SUM(p.points) as total_points,
  COUNT(p.id) as races_predicted,
  RANK() OVER (ORDER BY SUM(p.points) DESC) as rank,
  AVG(p.points) as avg_points_per_race
FROM predictions p
JOIN users u ON p.user_id = u.id
GROUP BY p.user_id, u.username, u.display_name;

-- Refresh materialized view after points calculation
REFRESH MATERIALIZED VIEW leaderboard;
```

**Purpose:** Optimized leaderboard query
**Notes:**
- Refresh after each race results entry
- Much faster than querying predictions table directly

---

## INDEXES FOR PERFORMANCE

```sql
-- Predictions lookup
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_race ON predictions(race_id);
CREATE INDEX idx_predictions_user_race ON predictions(user_id, race_id);

-- Sprint predictions lookup
CREATE INDEX idx_sprint_predictions_user ON sprint_predictions(user_id);
CREATE INDEX idx_sprint_predictions_race ON sprint_predictions(race_id);

-- Season predictions lookup
CREATE INDEX idx_season_predictions_user_season ON season_predictions(user_id, season);

-- Results lookup
CREATE INDEX idx_results_race ON results(race_id);

-- Points log lookup
CREATE INDEX idx_points_log_user ON points_log(user_id);
CREATE INDEX idx_points_log_race ON points_log(race_id);

-- Races lookup
CREATE INDEX idx_races_status ON races(status);
CREATE INDEX idx_races_season_round ON races(season, round);
```

---

## ROW LEVEL SECURITY (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_predictions ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can view all predictions (for leaderboard)
CREATE POLICY "Users can view all predictions"
  ON predictions FOR SELECT
  USING (true);

-- Users can insert their own predictions
CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own predictions
CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for sprint_predictions and season_predictions
-- (repeat above pattern)

-- Everyone can view races and results (public data)
ALTER TABLE races ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view races" ON races FOR SELECT USING (true);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view results" ON results FOR SELECT USING (true);
```

---

## Use this schema for:
1. Creating Supabase migration file
2. Understanding data relationships
3. Writing TypeScript types
4. Building API routes
5. Implementing RLS policies
6. Query optimization

**Remember:** Run migrations in Supabase SQL Editor or via Supabase CLI
