-- ==============================================================================
-- 2026 F1 SEASON MOCK SEED DATA (FOR STAGING/TESTING ONLY)
-- ==============================================================================
-- ⚠️  NEVER RUN THIS ON PRODUCTION!
--
-- SETUP INSTRUCTIONS:
--   1. Create a test user in your staging Supabase project
--      (via Dashboard → Auth → Users, or via the /api/auth/signup endpoint)
--   2. Replace the placeholder UUID below with the real auth.users ID
--   3. Run this script in the Supabase SQL Editor
--   4. The scoring triggers will auto-populate: points_log, leaderboard, season_results
-- ==============================================================================

-- ============================================
-- ⚙️  REPLACE THESE WITH REAL AUTH USER IDs
-- ============================================
-- After creating test users in Supabase Auth, paste their UUIDs here:
DO $$
BEGIN
    -- Verify these are set before proceeding
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '4648bb08-459f-4291-ad28-b7097db49f02') THEN
        RAISE NOTICE '⚠️  Placeholder UUID detected for user 1! Replace the UUIDs in this script with real auth.users IDs.';
        RAISE NOTICE '    Create test users first via Supabase Dashboard → Auth → Users';
        RAISE NOTICE '    Then replace 4648bb08-459f-4291-ad28-b7097db49f02 with the real ID.';
    END IF;
END $$;

-- ==============================================================================
-- 1. SEASONS
-- ==============================================================================
INSERT INTO public.seasons (year, is_active)
VALUES (2026, true)
ON CONFLICT (year) DO UPDATE SET is_active = EXCLUDED.is_active;

-- ==============================================================================
-- 2. RACES (24 rounds, R1-R2 completed, R3+ upcoming)
-- ==============================================================================
INSERT INTO public.races (season, round, date, cutoff, has_sprint, status)
VALUES
    (2026, 1,  '2026-02-08 14:00:00', '2026-02-08 13:00:00', false, 'completed'),
    (2026, 2,  '2026-02-15 14:00:00', '2026-02-14 13:00:00', true,  'completed'),
    (2026, 3,  '2026-03-29 06:00:00', '2026-03-29 05:00:00', false, 'upcoming'),
    (2026, 4,  '2026-04-12 16:00:00', '2026-04-12 15:00:00', false, 'upcoming'),
    (2026, 5,  '2026-04-19 18:00:00', '2026-04-19 17:00:00', false, 'upcoming'),
    (2026, 6,  '2026-05-03 21:00:00', '2026-05-02 20:00:00', true,  'upcoming'),
    (2026, 7,  '2026-05-24 19:00:00', '2026-05-23 18:00:00', true,  'upcoming'),
    (2026, 8,  '2026-06-07 14:00:00', '2026-06-07 13:00:00', false, 'upcoming'),
    (2026, 9,  '2026-06-14 14:00:00', '2026-06-14 13:00:00', false, 'upcoming'),
    (2026, 10, '2026-06-28 14:00:00', '2026-06-28 13:00:00', false, 'upcoming'),
    (2026, 11, '2026-07-05 15:00:00', '2026-07-04 14:00:00', true,  'upcoming'),
    (2026, 12, '2026-07-19 14:00:00', '2026-07-19 13:00:00', false, 'upcoming'),
    (2026, 13, '2026-07-26 14:00:00', '2026-07-26 13:00:00', false, 'upcoming'),
    (2026, 14, '2026-08-23 14:00:00', '2026-08-22 13:00:00', true,  'upcoming'),
    (2026, 15, '2026-09-06 14:00:00', '2026-09-06 13:00:00', false, 'upcoming'),
    (2026, 16, '2026-09-13 14:00:00', '2026-09-13 13:00:00', false, 'upcoming'),
    (2026, 17, '2026-09-27 12:00:00', '2026-09-27 11:00:00', false, 'upcoming'),
    (2026, 18, '2026-10-11 13:00:00', '2026-10-10 12:00:00', true,  'upcoming'),
    (2026, 19, '2026-10-25 20:00:00', '2026-10-25 19:00:00', false, 'upcoming'),
    (2026, 20, '2026-11-01 21:00:00', '2026-11-01 20:00:00', false, 'upcoming'),
    (2026, 21, '2026-11-08 18:00:00', '2026-11-08 17:00:00', false, 'upcoming'),
    (2026, 22, '2026-11-21 07:00:00', '2026-11-21 06:00:00', false, 'upcoming'),
    (2026, 23, '2026-11-29 16:00:00', '2026-11-29 15:00:00', false, 'upcoming'),
    (2026, 24, '2026-12-06 14:00:00', '2026-12-06 13:00:00', false, 'upcoming')
ON CONFLICT (season, round) DO UPDATE SET
    status = EXCLUDED.status,
    date = EXCLUDED.date,
    cutoff = EXCLUDED.cutoff,
    has_sprint = EXCLUDED.has_sprint;

-- ==============================================================================
-- 2.1 SPRINTS (6 sprint weekends)
-- ==============================================================================
INSERT INTO public.sprints (race_id, season, round, date, cutoff, status)
VALUES
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 2),
     2026, 2,  '2026-02-14 14:00:00', '2026-02-14 13:00:00', 'completed'),
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 6),
     2026, 6,  '2026-05-02 21:00:00', '2026-05-01 20:00:00', 'upcoming'),
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 7),
     2026, 7,  '2026-05-23 19:00:00', '2026-05-22 18:00:00', 'upcoming'),
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 11),
     2026, 11, '2026-07-04 15:00:00', '2026-07-03 14:00:00', 'upcoming'),
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 14),
     2026, 14, '2026-08-22 14:00:00', '2026-08-21 13:00:00', 'upcoming'),
    ((SELECT id FROM public.races WHERE season = 2026 AND round = 18),
     2026, 18, '2026-10-10 13:00:00', '2026-10-09 12:00:00', 'upcoming')
ON CONFLICT (season, round) DO NOTHING;

-- ==============================================================================
-- 3. TEST USERS
-- ==============================================================================
-- ⚠️  Replace these UUIDs with real auth.users IDs from your staging project!
--     The users table has a FK to auth.users(id), so these must exist there first.
--     Create them via: Supabase Dashboard → Auth → Users → Add User
--     Or via: POST /api/auth/signup
INSERT INTO public.users (id, username, display_name, favorite_team_id, favorite_driver_id)
VALUES
    ('4648bb08-459f-4291-ad28-b7097db49f02', 'testuser1', 'Max Predictor',   'redbull',  'verstappen')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    favorite_team_id = EXCLUDED.favorite_team_id,
    favorite_driver_id = EXCLUDED.favorite_driver_id;

-- ==============================================================================
-- 4. PREDICTIONS FOR R1
-- ==============================================================================
-- User 1: "Max Predictor" — very accurate for R1
INSERT INTO public.predictions (
    user_id, race_id,
    p1_driver, p2_driver, p3_driver, p4_driver, p5_driver,
    p6_driver, p7_driver, p8_driver, p9_driver, p10_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    '4648bb08-459f-4291-ad28-b7097db49f02',
    (SELECT id FROM public.races WHERE season = 2026 AND round = 1),
    'verstappen', 'norris', 'leclerc', 'hamilton', 'piastri',
    'russell', 'sainz', 'perez', 'alonso', 'hulkenberg',
    'redbull', 'mclaren', 'ferrari', 'mercedes', 'williams',
    'verstappen', 'verstappen', 'albon',
    true, false
)
ON CONFLICT (user_id, race_id) DO UPDATE SET
    p1_driver = EXCLUDED.p1_driver, p2_driver = EXCLUDED.p2_driver,
    p3_driver = EXCLUDED.p3_driver, p4_driver = EXCLUDED.p4_driver,
    p5_driver = EXCLUDED.p5_driver, p6_driver = EXCLUDED.p6_driver,
    p7_driver = EXCLUDED.p7_driver, p8_driver = EXCLUDED.p8_driver,
    p9_driver = EXCLUDED.p9_driver, p10_driver = EXCLUDED.p10_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;



-- ==============================================================================
-- 5. PREDICTIONS FOR R2
-- ==============================================================================
-- User 1: decent R2 prediction
INSERT INTO public.predictions (
    user_id, race_id,
    p1_driver, p2_driver, p3_driver, p4_driver, p5_driver,
    p6_driver, p7_driver, p8_driver, p9_driver, p10_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    '4648bb08-459f-4291-ad28-b7097db49f02',
    (SELECT id FROM public.races WHERE season = 2026 AND round = 2),
    'norris', 'verstappen', 'leclerc', 'piastri', 'hamilton',
    'russell', 'sainz', 'perez', 'gasly', 'alonso',
    'mclaren', 'redbull', 'ferrari', 'mercedes', 'williams',
    'norris', 'norris', 'stroll',
    true, false
)
ON CONFLICT (user_id, race_id) DO UPDATE SET
    p1_driver = EXCLUDED.p1_driver, p2_driver = EXCLUDED.p2_driver,
    p3_driver = EXCLUDED.p3_driver, p4_driver = EXCLUDED.p4_driver,
    p5_driver = EXCLUDED.p5_driver, p6_driver = EXCLUDED.p6_driver,
    p7_driver = EXCLUDED.p7_driver, p8_driver = EXCLUDED.p8_driver,
    p9_driver = EXCLUDED.p9_driver, p10_driver = EXCLUDED.p10_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;



-- ==============================================================================
-- 6. SPRINT PREDICTIONS FOR R2
-- ==============================================================================
-- User 1: accurate sprint prediction
INSERT INTO public.sprint_predictions (
    user_id, race_id,
    sp1_driver, sp2_driver, sp3_driver, sp4_driver,
    sp5_driver, sp6_driver, sp7_driver, sp8_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    '4648bb08-459f-4291-ad28-b7097db49f02',
    (SELECT id FROM public.races WHERE season = 2026 AND round = 2),
    'norris', 'verstappen', 'piastri', 'leclerc',
    'russell', 'hamilton', 'sainz', 'perez',
    'mclaren', 'redbull', 'ferrari', 'mercedes', 'williams',
    'norris', 'piastri', 'stroll',
    false, false
)
ON CONFLICT (user_id, race_id) DO UPDATE SET
    sp1_driver = EXCLUDED.sp1_driver, sp2_driver = EXCLUDED.sp2_driver,
    sp3_driver = EXCLUDED.sp3_driver, sp4_driver = EXCLUDED.sp4_driver,
    sp5_driver = EXCLUDED.sp5_driver, sp6_driver = EXCLUDED.sp6_driver,
    sp7_driver = EXCLUDED.sp7_driver, sp8_driver = EXCLUDED.sp8_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;



-- ==============================================================================
-- 7. SEASON PREDICTIONS
-- ==============================================================================
-- User 1: season prediction
INSERT INTO public.season_predictions (
    user_id, season,
    d1_driver, d2_driver, d3_driver, d4_driver, d5_driver,
    d6_driver, d7_driver, d8_driver, d9_driver, d10_driver,
    d11_driver, d12_driver, d13_driver, d14_driver, d15_driver,
    d16_driver, d17_driver, d18_driver, d19_driver, d20_driver,
    d21_driver, d22_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    c6_constructor, c7_constructor, c8_constructor, c9_constructor, c10_constructor,
    c11_constructor,
    most_poles, most_fastest_laps, most_retirements,
    locked
)
VALUES (
    '4648bb08-459f-4291-ad28-b7097db49f02', 2026,
    'verstappen', 'norris', 'leclerc', 'hamilton', 'piastri',
    'russell', 'sainz', 'alonso', 'perez', 'gasly',
    'hulkenberg', 'albon', 'bearman', 'antonelli', 'ocon',
    'bortoleto', 'lawson', 'hadjar', 'bottas', 'stroll',
    'colapinto', 'lindblad',
    'redbull', 'mclaren', 'ferrari', 'mercedes', 'astonmartin',
    'alpine', 'williams', 'haas', 'rb', 'audi',
    'cadillac',
    'verstappen', 'norris', 'stroll',
    true
)
ON CONFLICT (user_id, season) DO UPDATE SET
    d1_driver = EXCLUDED.d1_driver, d2_driver = EXCLUDED.d2_driver,
    d3_driver = EXCLUDED.d3_driver, d4_driver = EXCLUDED.d4_driver,
    d5_driver = EXCLUDED.d5_driver, d6_driver = EXCLUDED.d6_driver,
    d7_driver = EXCLUDED.d7_driver, d8_driver = EXCLUDED.d8_driver,
    d9_driver = EXCLUDED.d9_driver, d10_driver = EXCLUDED.d10_driver,
    d11_driver = EXCLUDED.d11_driver, d12_driver = EXCLUDED.d12_driver,
    d13_driver = EXCLUDED.d13_driver, d14_driver = EXCLUDED.d14_driver,
    d15_driver = EXCLUDED.d15_driver, d16_driver = EXCLUDED.d16_driver,
    d17_driver = EXCLUDED.d17_driver, d18_driver = EXCLUDED.d18_driver,
    d19_driver = EXCLUDED.d19_driver, d20_driver = EXCLUDED.d20_driver,
    d21_driver = EXCLUDED.d21_driver, d22_driver = EXCLUDED.d22_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor, c6_constructor = EXCLUDED.c6_constructor,
    c7_constructor = EXCLUDED.c7_constructor, c8_constructor = EXCLUDED.c8_constructor,
    c9_constructor = EXCLUDED.c9_constructor, c10_constructor = EXCLUDED.c10_constructor,
    c11_constructor = EXCLUDED.c11_constructor,
    most_poles = EXCLUDED.most_poles, most_fastest_laps = EXCLUDED.most_fastest_laps,
    most_retirements = EXCLUDED.most_retirements, locked = EXCLUDED.locked;



-- ==============================================================================
-- 8. DRIVER STANDINGS (reflects 2 completed races)
-- ==============================================================================
INSERT INTO public.driver_standings (season, driver_id, points, position)
VALUES
    (2026, 'norris',       51, 1),
    (2026, 'verstappen',   48, 2),
    (2026, 'leclerc',      36, 3),
    (2026, 'hamilton',     28, 4),
    (2026, 'piastri',      28, 5),
    (2026, 'russell',      18, 6),
    (2026, 'sainz',        16, 7),
    (2026, 'perez',         9, 8),
    (2026, 'alonso',        4, 9),
    (2026, 'hulkenberg',    1, 10),
    (2026, 'gasly',         1, 11),
    (2026, 'albon',         0, 12),
    (2026, 'antonelli',     0, 13),
    (2026, 'bearman',       0, 14),
    (2026, 'bortoleto',     0, 15),
    (2026, 'bottas',        0, 16),
    (2026, 'colapinto',     0, 17),
    (2026, 'hadjar',        0, 18),
    (2026, 'lawson',        0, 19),
    (2026, 'lindblad',      0, 20),
    (2026, 'ocon',          0, 21),
    (2026, 'stroll',        0, 22)
ON CONFLICT (season, driver_id) DO UPDATE SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;

-- ==============================================================================
-- 9. CONSTRUCTOR STANDINGS (reflects 2 completed races)
-- ==============================================================================
INSERT INTO public.constructor_standings (season, constructor_id, points, position)
VALUES
    (2026, 'mclaren',      79, 1),
    (2026, 'ferrari',      64, 2),
    (2026, 'redbull',      48, 3),
    (2026, 'mercedes',     18, 4),
    (2026, 'williams',     16, 5),
    (2026, 'cadillac',      9, 6),
    (2026, 'astonmartin',   4, 7),
    (2026, 'audi',          1, 8),
    (2026, 'alpine',        1, 9),
    (2026, 'haas',          0, 10),
    (2026, 'rb',            0, 11)
ON CONFLICT (season, constructor_id) DO UPDATE SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;

-- ==============================================================================
-- 10. RACE RESULTS (triggers calculate_f1_points → scores predictions → fills points_log + leaderboard)
-- ==============================================================================
-- ⚠️  These use ON CONFLICT DO UPDATE so re-running re-triggers scoring!

-- Round 1 Result
-- Actual: VER NOR HAM LEC PIA RUS SAI PER ALO HUL
-- User1 predicted: VER NOR LEC HAM PIA RUS SAI PER ALO HUL → very close
INSERT INTO public.race_results (
    race_id,
    p1_driver, p2_driver, p3_driver, p4_driver, p5_driver,
    p6_driver, p7_driver, p8_driver, p9_driver, p10_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    (SELECT id FROM public.races WHERE season = 2026 AND round = 1),
    'verstappen', 'norris', 'hamilton', 'leclerc', 'piastri',
    'russell', 'sainz', 'perez', 'alonso', 'hulkenberg',
    'redbull', 'mclaren', 'ferrari', 'mercedes', 'williams',
    'verstappen', 'verstappen', 'albon',
    true, false
)
ON CONFLICT (race_id) DO UPDATE SET
    p1_driver = EXCLUDED.p1_driver, p2_driver = EXCLUDED.p2_driver,
    p3_driver = EXCLUDED.p3_driver, p4_driver = EXCLUDED.p4_driver,
    p5_driver = EXCLUDED.p5_driver, p6_driver = EXCLUDED.p6_driver,
    p7_driver = EXCLUDED.p7_driver, p8_driver = EXCLUDED.p8_driver,
    p9_driver = EXCLUDED.p9_driver, p10_driver = EXCLUDED.p10_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;

-- Round 2 Sprint Result
-- Actual sprint: NOR VER PIA LEC RUS HAM SAI PER
-- User1 predicted: NOR VER PIA LEC RUS HAM SAI PER → perfect!
INSERT INTO public.sprint_results (
    race_id,
    sp1_driver, sp2_driver, sp3_driver, sp4_driver,
    sp5_driver, sp6_driver, sp7_driver, sp8_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    (SELECT id FROM public.races WHERE season = 2026 AND round = 2),
    'norris', 'verstappen', 'piastri', 'leclerc',
    'russell', 'hamilton', 'sainz', 'perez',
    'mclaren', 'redbull', 'ferrari', 'mercedes', 'williams',
    'norris', 'piastri', 'stroll',
    false, false
)
ON CONFLICT (race_id) DO UPDATE SET
    sp1_driver = EXCLUDED.sp1_driver, sp2_driver = EXCLUDED.sp2_driver,
    sp3_driver = EXCLUDED.sp3_driver, sp4_driver = EXCLUDED.sp4_driver,
    sp5_driver = EXCLUDED.sp5_driver, sp6_driver = EXCLUDED.sp6_driver,
    sp7_driver = EXCLUDED.sp7_driver, sp8_driver = EXCLUDED.sp8_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;

-- Round 2 Race Result
-- Actual: NOR LEC VER PIA HAM SAI RUS PER ALO GAS
-- User1 predicted: NOR VER LEC PIA HAM RUS SAI PER GAS ALO → mostly right
INSERT INTO public.race_results (
    race_id,
    p1_driver, p2_driver, p3_driver, p4_driver, p5_driver,
    p6_driver, p7_driver, p8_driver, p9_driver, p10_driver,
    c1_constructor, c2_constructor, c3_constructor, c4_constructor, c5_constructor,
    pole_position, fastest_lap, first_retirement,
    safety_car, red_flag
)
VALUES (
    (SELECT id FROM public.races WHERE season = 2026 AND round = 2),
    'norris', 'leclerc', 'verstappen', 'piastri', 'hamilton',
    'sainz', 'russell', 'perez', 'alonso', 'gasly',
    'mclaren', 'ferrari', 'redbull', 'williams', 'mercedes',
    'norris', 'leclerc', 'bearman',
    true, true
)
ON CONFLICT (race_id) DO UPDATE SET
    p1_driver = EXCLUDED.p1_driver, p2_driver = EXCLUDED.p2_driver,
    p3_driver = EXCLUDED.p3_driver, p4_driver = EXCLUDED.p4_driver,
    p5_driver = EXCLUDED.p5_driver, p6_driver = EXCLUDED.p6_driver,
    p7_driver = EXCLUDED.p7_driver, p8_driver = EXCLUDED.p8_driver,
    p9_driver = EXCLUDED.p9_driver, p10_driver = EXCLUDED.p10_driver,
    c1_constructor = EXCLUDED.c1_constructor, c2_constructor = EXCLUDED.c2_constructor,
    c3_constructor = EXCLUDED.c3_constructor, c4_constructor = EXCLUDED.c4_constructor,
    c5_constructor = EXCLUDED.c5_constructor,
    pole_position = EXCLUDED.pole_position, fastest_lap = EXCLUDED.fastest_lap,
    first_retirement = EXCLUDED.first_retirement,
    safety_car = EXCLUDED.safety_car, red_flag = EXCLUDED.red_flag;

-- ==============================================================================
-- 11. VERIFICATION QUERIES (uncomment to check results after running)
-- ==============================================================================
-- SELECT 'points_log' as tbl, count(*) FROM points_log
-- UNION ALL SELECT 'leaderboard', count(*) FROM leaderboard
-- UNION ALL SELECT 'season_results', count(*) FROM season_results;
--
-- SELECT u.username, pl.session_type, pl.total_points, pl.breakdown, r.round
-- FROM points_log pl
-- JOIN users u ON pl.user_id = u.id
-- JOIN races r ON pl.race_id = r.id
-- ORDER BY r.round, pl.session_type, pl.total_points DESC;
--
-- SELECT u.username, l.total_points, l.rank, l.previous_rank, l.races_predicted, l.avg_points_per_race
-- FROM leaderboard l
-- JOIN users u ON l.user_id = u.id
-- ORDER BY l.rank;