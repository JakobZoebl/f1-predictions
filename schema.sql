-- Enable RLS on all tables
-- (We will enable it after creating tables)

-- Table 1: users (profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  favorite_team_id VARCHAR(50),
  favorite_driver_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: races
CREATE TABLE IF NOT EXISTS races (
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

-- Table 3: predictions
CREATE TABLE IF NOT EXISTS predictions (
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

-- Table 4: sprint_predictions
CREATE TABLE IF NOT EXISTS sprint_predictions (
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

-- Table 5: season_predictions
CREATE TABLE IF NOT EXISTS season_predictions (
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
  
  -- All 11 Constructors Championship
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
  c11_constructor VARCHAR(50),

  
  -- Statistics
  most_poles VARCHAR(50),
  most_fastest_laps VARCHAR(50),
  
  points INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, season)
);

-- Table 6: results
CREATE TABLE IF NOT EXISTS race_results (
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

-- Table 7: sprint_results
CREATE TABLE IF NOT EXISTS sprint_results (
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

-- Table 8: points_log
CREATE TABLE IF NOT EXISTS points_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  race_id INTEGER REFERENCES races(id),
  session_type VARCHAR(20),  -- 'race', 'sprint', 'season'
  
  total_points INTEGER,
  
  -- Breakdown (JSONB for flexibility)
  breakdown JSONB,  -- {"driver_positions": 43, "constructors": 25, "pole": 10, ...}
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View 1: leaderboard (Materialized View)
-- Drop if exists to avoid errors on re-run
DROP MATERIALIZED VIEW IF EXISTS leaderboard;
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_race ON predictions(race_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_race ON predictions(user_id, race_id);
CREATE INDEX IF NOT EXISTS idx_sprint_predictions_user ON sprint_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_sprint_predictions_race ON sprint_predictions(race_id);
CREATE INDEX IF NOT EXISTS idx_season_predictions_user_season ON season_predictions(user_id, season);
CREATE INDEX IF NOT EXISTS idx_results_race ON race_results(race_id);
CREATE INDEX IF NOT EXISTS idx_points_log_user ON points_log(user_id);
CREATE INDEX IF NOT EXISTS idx_points_log_race ON points_log(race_id);
CREATE INDEX IF NOT EXISTS idx_races_status ON races(status);
CREATE INDEX IF NOT EXISTS idx_races_season_round ON races(season, round);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE races ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Predictions
DO $$ BEGIN
  CREATE POLICY "Users can view all predictions" ON predictions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own predictions" ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own predictions" ON predictions FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Sprint Predictions
DO $$ BEGIN
  CREATE POLICY "Users can view all sprint predictions" ON sprint_predictions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own sprint predictions" ON sprint_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own sprint predictions" ON sprint_predictions FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Season Predictions
DO $$ BEGIN
  CREATE POLICY "Users can view all season predictions" ON season_predictions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own season predictions" ON season_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own season predictions" ON season_predictions FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public Data
DO $$ BEGIN
  CREATE POLICY "Anyone can view races" ON races FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view race results" ON race_results FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
