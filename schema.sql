-- ==============================================================================
-- F1 PREDICTIONS - COMPLETE SUPABASE SQL SCHEMA (MASTER)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. CLEANUP (Ensures fresh start and matches latest columns)
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_calculate_race_points ON public.race_results;
DROP TRIGGER IF EXISTS tr_calculate_sprint_points ON public.sprint_results;
DROP FUNCTION IF EXISTS public.calculate_f1_points();

DROP TABLE IF EXISTS public.leaderboard CASCADE;
DROP TABLE IF EXISTS public.points_log CASCADE;
DROP TABLE IF EXISTS public.sprint_results CASCADE;
DROP TABLE IF EXISTS public.race_results CASCADE;
DROP TABLE IF EXISTS public.season_results CASCADE;
DROP TABLE IF EXISTS public.season_predictions CASCADE;
DROP TABLE IF EXISTS public.sprint_predictions CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.races CASCADE;
DROP TABLE IF EXISTS public.seasons CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ------------------------------------------------------------------------------
-- 1. BASE TABLES
-- ------------------------------------------------------------------------------

-- Table 1: users
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY,
  username CHARACTER VARYING NOT NULL UNIQUE,
  display_name CHARACTER VARYING,
  favorite_team_id CHARACTER VARYING,
  favorite_driver_id CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Table 1.5: seasons
CREATE TABLE public.seasons (
  year INTEGER PRIMARY KEY,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Table 2: races
CREATE TABLE public.races (
  id SERIAL PRIMARY KEY,
  season INTEGER NOT NULL REFERENCES public.seasons(year) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE,
  cutoff TIMESTAMP WITHOUT TIME ZONE,
  has_sprint BOOLEAN DEFAULT FALSE,
  status CHARACTER VARYING DEFAULT 'upcoming',
  UNIQUE(season, round)
);

-- Table 3: predictions
CREATE TABLE public.predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  race_id INTEGER REFERENCES public.races(id) ON DELETE CASCADE,
  p1_driver CHARACTER VARYING, p2_driver CHARACTER VARYING, p3_driver CHARACTER VARYING,
  p4_driver CHARACTER VARYING, p5_driver CHARACTER VARYING, p6_driver CHARACTER VARYING,
  p7_driver CHARACTER VARYING, p8_driver CHARACTER VARYING, p9_driver CHARACTER VARYING,
  p10_driver CHARACTER VARYING,
  c1_constructor CHARACTER VARYING, c2_constructor CHARACTER VARYING, c3_constructor CHARACTER VARYING,
  c4_constructor CHARACTER VARYING, c5_constructor CHARACTER VARYING,
  pole_position CHARACTER VARYING,
  fastest_lap CHARACTER VARYING,
  first_retirement CHARACTER VARYING,
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  points INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, race_id)
);

-- Table 4: sprint_predictions
CREATE TABLE public.sprint_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  race_id INTEGER REFERENCES public.races(id) ON DELETE CASCADE,
  sp1_driver CHARACTER VARYING, sp2_driver CHARACTER VARYING, sp3_driver CHARACTER VARYING,
  sp4_driver CHARACTER VARYING, sp5_driver CHARACTER VARYING, sp6_driver CHARACTER VARYING,
  sp7_driver CHARACTER VARYING, sp8_driver CHARACTER VARYING,
  pole_position CHARACTER VARYING,
  fastest_lap CHARACTER VARYING,
  first_retirement CHARACTER VARYING,
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  points INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, race_id)
);

-- Table 5: season_predictions
CREATE TABLE public.season_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  season INTEGER NOT NULL REFERENCES public.seasons(year) ON DELETE CASCADE,
  d1_driver CHARACTER VARYING,  d2_driver CHARACTER VARYING,  d3_driver CHARACTER VARYING,
  d4_driver CHARACTER VARYING,  d5_driver CHARACTER VARYING,  d6_driver CHARACTER VARYING,
  d7_driver CHARACTER VARYING,  d8_driver CHARACTER VARYING,  d9_driver CHARACTER VARYING,
  d10_driver CHARACTER VARYING, d11_driver CHARACTER VARYING, d12_driver CHARACTER VARYING,
  d13_driver CHARACTER VARYING, d14_driver CHARACTER VARYING, d15_driver CHARACTER VARYING,
  d16_driver CHARACTER VARYING, d17_driver CHARACTER VARYING, d18_driver CHARACTER VARYING,
  d19_driver CHARACTER VARYING, d20_driver CHARACTER VARYING,
  c1_constructor CHARACTER VARYING, c2_constructor CHARACTER VARYING, c3_constructor CHARACTER VARYING,
  c4_constructor CHARACTER VARYING, c5_constructor CHARACTER VARYING, c6_constructor CHARACTER VARYING,
  c7_constructor CHARACTER VARYING, c8_constructor CHARACTER VARYING, c9_constructor CHARACTER VARYING,
  c10_constructor CHARACTER VARYING, c11_constructor CHARACTER VARYING,
  most_poles CHARACTER VARYING,
  most_fastest_laps CHARACTER VARYING,
  points INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, season)
);

-- Table 6: race_results
CREATE TABLE public.race_results (
  id SERIAL PRIMARY KEY,
  race_id INTEGER UNIQUE REFERENCES public.races(id) ON DELETE CASCADE,
  p1_driver CHARACTER VARYING, p2_driver CHARACTER VARYING, p3_driver CHARACTER VARYING,
  p4_driver CHARACTER VARYING, p5_driver CHARACTER VARYING, p6_driver CHARACTER VARYING,
  p7_driver CHARACTER VARYING, p8_driver CHARACTER VARYING, p9_driver CHARACTER VARYING,
  p10_driver CHARACTER VARYING,
  c1_constructor CHARACTER VARYING, c2_constructor CHARACTER VARYING, c3_constructor CHARACTER VARYING,
  c4_constructor CHARACTER VARYING, c5_constructor CHARACTER VARYING,
  pole_position CHARACTER VARYING,
  fastest_lap CHARACTER VARYING,
  first_retirement CHARACTER VARYING,
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Table 7: sprint_results
CREATE TABLE public.sprint_results (
  id SERIAL PRIMARY KEY,
  race_id INTEGER UNIQUE REFERENCES public.races(id) ON DELETE CASCADE,
  sp1_driver CHARACTER VARYING, sp2_driver CHARACTER VARYING, sp3_driver CHARACTER VARYING,
  sp4_driver CHARACTER VARYING, sp5_driver CHARACTER VARYING, sp6_driver CHARACTER VARYING,
  sp7_driver CHARACTER VARYING, sp8_driver CHARACTER VARYING,
  pole_position CHARACTER VARYING,
  fastest_lap CHARACTER VARYING,
  first_retirement CHARACTER VARYING,
  safety_car BOOLEAN,
  red_flag BOOLEAN,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Table 7.5: season_results
CREATE TABLE public.season_results (
  id SERIAL PRIMARY KEY,
  season INTEGER UNIQUE NOT NULL REFERENCES public.seasons(year) ON DELETE CASCADE,
  d1_driver CHARACTER VARYING,  d2_driver CHARACTER VARYING,  d3_driver CHARACTER VARYING,
  d4_driver CHARACTER VARYING,  d5_driver CHARACTER VARYING,  d6_driver CHARACTER VARYING,
  d7_driver CHARACTER VARYING,  d8_driver CHARACTER VARYING,  d9_driver CHARACTER VARYING,
  d10_driver CHARACTER VARYING, d11_driver CHARACTER VARYING, d12_driver CHARACTER VARYING,
  d13_driver CHARACTER VARYING, d14_driver CHARACTER VARYING, d15_driver CHARACTER VARYING,
  d16_driver CHARACTER VARYING, d17_driver CHARACTER VARYING, d18_driver CHARACTER VARYING,
  d19_driver CHARACTER VARYING, d20_driver CHARACTER VARYING,
  c1_constructor CHARACTER VARYING, c2_constructor CHARACTER VARYING, c3_constructor CHARACTER VARYING,
  c4_constructor CHARACTER VARYING, c5_constructor CHARACTER VARYING, c6_constructor CHARACTER VARYING,
  c7_constructor CHARACTER VARYING, c8_constructor CHARACTER VARYING, c9_constructor CHARACTER VARYING,
  c10_constructor CHARACTER VARYING, c11_constructor CHARACTER VARYING,
  most_poles CHARACTER VARYING,
  most_fastest_laps CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Table 8: points_log
CREATE TABLE public.points_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  race_id INTEGER REFERENCES public.races(id) ON DELETE CASCADE,
  season INTEGER NOT NULL REFERENCES public.seasons(year) ON DELETE CASCADE,
  session_type CHARACTER VARYING, -- 'race', 'sprint', 'season'
  total_points INTEGER,
  breakdown JSONB, -- {"driver_points": 43, "constructor_points": 25, "bonus_points": 10}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, race_id, session_type)
);

-- Table 9: leaderboard
CREATE TABLE public.leaderboard (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  season INTEGER NOT NULL REFERENCES public.seasons(year) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  races_predicted INTEGER DEFAULT 0,
  avg_points_per_race NUMERIC DEFAULT 0,
  rank INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, season)
);

-- ------------------------------------------------------------------------------
-- 2. SCORING ENGINE (TRIGGER FUNCTION)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.calculate_f1_points()
RETURNS TRIGGER AS $$
DECLARE
    pred RECORD;
    score INTEGER;
    current_season INTEGER;
    driver_points INTEGER;
    constructor_points INTEGER;
    bonus_points INTEGER;
    breakdown_json JSONB;
    actual_drivers text[];
    actual_constructors text[];
    actual_sprint_drivers text[];
BEGIN
    -- Get the season for the race
    SELECT season INTO current_season FROM public.races WHERE id = NEW.race_id;

    -- Logic for RACE results
    IF TG_TABLE_NAME = 'race_results' THEN
        actual_drivers := ARRAY[NEW.p1_driver, NEW.p2_driver, NEW.p3_driver, NEW.p4_driver, NEW.p5_driver, NEW.p6_driver, NEW.p7_driver, NEW.p8_driver, NEW.p9_driver, NEW.p10_driver];
        actual_constructors := ARRAY[NEW.c1_constructor, NEW.c2_constructor, NEW.c3_constructor, NEW.c4_constructor, NEW.c5_constructor];
        
        FOR pred IN SELECT * FROM public.predictions WHERE race_id = NEW.race_id LOOP
            score := 0;
            driver_points := 0;
            constructor_points := 0;
            bonus_points := 0;

            -- 1. Driver Position Matches (25, 18, 15, 12, 10, 8, 6, 4, 2, 1. Partial: 2)
            IF pred.p1_driver  = NEW.p1_driver  THEN driver_points := driver_points + 25; ELSIF pred.p1_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p2_driver  = NEW.p2_driver  THEN driver_points := driver_points + 18; ELSIF pred.p2_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p3_driver  = NEW.p3_driver  THEN driver_points := driver_points + 15; ELSIF pred.p3_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p4_driver  = NEW.p4_driver  THEN driver_points := driver_points + 12; ELSIF pred.p4_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p5_driver  = NEW.p5_driver  THEN driver_points := driver_points + 10; ELSIF pred.p5_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p6_driver  = NEW.p6_driver  THEN driver_points := driver_points + 8;  ELSIF pred.p6_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p7_driver  = NEW.p7_driver  THEN driver_points := driver_points + 6;  ELSIF pred.p7_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p8_driver  = NEW.p8_driver  THEN driver_points := driver_points + 4;  ELSIF pred.p8_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p9_driver  = NEW.p9_driver  THEN driver_points := driver_points + 2;  ELSIF pred.p9_driver  = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;
            IF pred.p10_driver = NEW.p10_driver THEN driver_points := driver_points + 1;  ELSIF pred.p10_driver = ANY(actual_drivers) THEN driver_points := driver_points + 2; END IF;

            -- 2. Constructor Matches (25, 18, 15, 12, 10. Partial: 10)
            IF pred.c1_constructor = NEW.c1_constructor THEN constructor_points := constructor_points + 25; ELSIF pred.c1_constructor = ANY(actual_constructors) THEN constructor_points := constructor_points + 10; END IF;
            IF pred.c2_constructor = NEW.c2_constructor THEN constructor_points := constructor_points + 18; ELSIF pred.c2_constructor = ANY(actual_constructors) THEN constructor_points := constructor_points + 10; END IF;
            IF pred.c3_constructor = NEW.c3_constructor THEN constructor_points := constructor_points + 15; ELSIF pred.c3_constructor = ANY(actual_constructors) THEN constructor_points := constructor_points + 10; END IF;
            IF pred.c4_constructor = NEW.c4_constructor THEN constructor_points := constructor_points + 12; ELSIF pred.c4_constructor = ANY(actual_constructors) THEN constructor_points := constructor_points + 10; END IF;
            IF pred.c5_constructor = NEW.c5_constructor THEN constructor_points := constructor_points + 10; ELSIF pred.c5_constructor = ANY(actual_constructors) THEN constructor_points := constructor_points + 10; END IF;

            -- 3. Bonuses
            IF pred.pole_position = NEW.pole_position THEN bonus_points := bonus_points + 10; END IF;
            IF pred.fastest_lap = NEW.fastest_lap THEN bonus_points := bonus_points + 10; END IF;
            IF pred.first_retirement = NEW.first_retirement THEN bonus_points := bonus_points + 10; END IF;
            IF pred.safety_car = NEW.safety_car THEN bonus_points := bonus_points + 5; END IF;
            IF pred.red_flag = NEW.red_flag THEN 
                IF NEW.red_flag = TRUE THEN bonus_points := bonus_points + 5; ELSE bonus_points := bonus_points + 1; END IF;
            END IF;

            score := driver_points + constructor_points + bonus_points;
            breakdown_json := jsonb_build_object(
                'driver_points', driver_points,
                'constructor_points', constructor_points,
                'bonus_points', bonus_points
            );

            UPDATE public.predictions SET points = score WHERE id = pred.id;

            INSERT INTO public.points_log (user_id, race_id, season, session_type, total_points, breakdown)
            VALUES (pred.user_id, NEW.race_id, current_season, 'race', score, breakdown_json)
            ON CONFLICT (user_id, race_id, session_type) DO UPDATE SET total_points = EXCLUDED.total_points, breakdown = EXCLUDED.breakdown;

            INSERT INTO public.leaderboard (user_id, season, total_points, races_predicted)
            VALUES (pred.user_id, current_season, score, 1)
            ON CONFLICT (user_id, season) DO NOTHING;
        END LOOP;

    -- Logic for SPRINT
    ELSIF TG_TABLE_NAME = 'sprint_results' THEN
        actual_sprint_drivers := ARRAY[NEW.sp1_driver, NEW.sp2_driver, NEW.sp3_driver, NEW.sp4_driver, NEW.sp5_driver, NEW.sp6_driver, NEW.sp7_driver, NEW.sp8_driver];
        
        FOR pred IN SELECT * FROM public.sprint_predictions WHERE race_id = NEW.race_id LOOP
            score := 0;
            driver_points := 0;
            bonus_points := 0;

            IF pred.sp1_driver = NEW.sp1_driver THEN driver_points := driver_points + 8; ELSIF pred.sp1_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp2_driver = NEW.sp2_driver THEN driver_points := driver_points + 7; ELSIF pred.sp2_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp3_driver = NEW.sp3_driver THEN driver_points := driver_points + 6; ELSIF pred.sp3_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp4_driver = NEW.sp4_driver THEN driver_points := driver_points + 5; ELSIF pred.sp4_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp5_driver = NEW.sp5_driver THEN driver_points := driver_points + 4; ELSIF pred.sp5_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp6_driver = NEW.sp6_driver THEN driver_points := driver_points + 3; ELSIF pred.sp6_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp7_driver = NEW.sp7_driver THEN driver_points := driver_points + 2; ELSIF pred.sp7_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;
            IF pred.sp8_driver = NEW.sp8_driver THEN driver_points := driver_points + 1; ELSIF pred.sp8_driver = ANY(actual_sprint_drivers) THEN driver_points := driver_points + 1; END IF;

            IF pred.pole_position = NEW.pole_position THEN bonus_points := bonus_points + 10; END IF;
            IF pred.fastest_lap = NEW.fastest_lap THEN bonus_points := bonus_points + 10; END IF;
            IF pred.first_retirement = NEW.first_retirement THEN bonus_points := bonus_points + 10; END IF;
            IF pred.safety_car = NEW.safety_car THEN bonus_points := bonus_points + 5; END IF;
            IF pred.red_flag = NEW.red_flag THEN 
                IF NEW.red_flag = TRUE THEN bonus_points := bonus_points + 5; ELSE bonus_points := bonus_points + 1; END IF;
            END IF;

            score := driver_points + bonus_points;
            breakdown_json := jsonb_build_object('driver_points', driver_points, 'bonus_points', bonus_points);

            UPDATE public.sprint_predictions SET points = score WHERE id = pred.id;

            INSERT INTO public.points_log (user_id, race_id, season, session_type, total_points, breakdown)
            VALUES (pred.user_id, NEW.race_id, current_season, 'sprint', score, breakdown_json)
            ON CONFLICT (user_id, race_id, session_type) DO UPDATE SET total_points = EXCLUDED.total_points, breakdown = EXCLUDED.breakdown;

            INSERT INTO public.leaderboard (user_id, season, total_points, races_predicted)
            VALUES (pred.user_id, current_season, score, 0)
            ON CONFLICT (user_id, season) DO NOTHING;
        END LOOP;
    END IF;

    -- Update Global Leaderboard
    UPDATE public.leaderboard l
    SET 
        total_points = stats.tot_pts,
        races_predicted = stats.races_pred,
        avg_points_per_race = CASE WHEN stats.races_pred > 0 THEN stats.tot_pts::NUMERIC / stats.races_pred ELSE 0 END,
        updated_at = NOW()
    FROM (
        SELECT user_id, season, SUM(total_points) as tot_pts, COUNT(DISTINCT race_id) as races_pred
        FROM public.points_log
        WHERE season = current_season
        GROUP BY user_id, season
    ) stats
    WHERE l.user_id = stats.user_id AND l.season = stats.season;

    -- Re-calculate Ranks
    UPDATE public.leaderboard l
    SET rank = sub.new_rank
    FROM (
        SELECT user_id, season, RANK() OVER (PARTITION BY season ORDER BY total_points DESC) as new_rank
        FROM public.leaderboard
        WHERE season = current_season
    ) sub
    WHERE l.user_id = sub.user_id AND l.season = sub.season;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. TRIGGERS
-- ------------------------------------------------------------------------------

CREATE TRIGGER tr_calculate_race_points
    AFTER INSERT OR UPDATE ON public.race_results
    FOR EACH ROW EXECUTE FUNCTION public.calculate_f1_points();

CREATE TRIGGER tr_calculate_sprint_points
    AFTER INSERT OR UPDATE ON public.sprint_results
    FOR EACH ROW EXECUTE FUNCTION public.calculate_f1_points();

-- ------------------------------------------------------------------------------
-- 4. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_predictions_user ON public.predictions(user_id);
CREATE INDEX idx_predictions_race ON public.predictions(race_id);
CREATE INDEX idx_sprint_predictions_user ON public.sprint_predictions(user_id);
CREATE INDEX idx_sprint_predictions_race ON public.sprint_predictions(race_id);
CREATE INDEX idx_season_predictions_user_season ON public.season_predictions(user_id, season);
CREATE INDEX idx_season_results_season ON public.season_results(season);
CREATE INDEX idx_results_race ON public.race_results(race_id);
CREATE INDEX idx_points_log_user ON public.points_log(user_id);
CREATE INDEX idx_points_log_race ON public.points_log(race_id);
CREATE INDEX idx_races_season_round ON public.races(season, round);
CREATE INDEX idx_leaderboard_season ON public.leaderboard(season);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard(rank);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

-- Basic Policies
DO $$ BEGIN CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated view all profiles" ON public.users FOR SELECT USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view seasons" ON public.seasons FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users view all predictions" ON public.predictions FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users insert own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users update own predictions" ON public.predictions FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users view all sprint predictions" ON public.sprint_predictions FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users insert own sprint predictions" ON public.sprint_predictions FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Users update own sprint predictions" ON public.sprint_predictions FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view races" ON public.races FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view results" ON public.race_results FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view sprint results" ON public.sprint_results FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view season results" ON public.season_results FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view leaderboard" ON public.leaderboard FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone view points log" ON public.points_log FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ------------------------------------------------------------------------------
-- 6. SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.seasons (year, is_active) VALUES (2024, false), (2025, false), (2026, true) ON CONFLICT (year) DO NOTHING;
