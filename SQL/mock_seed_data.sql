-- ==============================================================================
-- 2026 F1 SEASON MOCK SEED DATA (WITH PAST RESULTS)
-- ==============================================================================
-- 1. SEASONS
INSERT INTO
    public.seasons (year, is_active)
VALUES
    (2026, true) ON CONFLICT (year) DO NOTHING;

-- 2. RACES
-- Round 1: Past (March 8 -> Feb 8)
-- Round 2: Past (March 15 -> Feb 15) - Sprint
INSERT INTO
    public.races (season, round, date, cutoff, has_sprint, status)
VALUES
    (
        2026,
        1,
        '2026-02-08 14:00:00',
        '2026-02-08 13:00:00',
        false,
        'completed'
    ),
    (
        2026,
        2,
        '2026-02-15 14:00:00',
        '2026-02-14 13:00:00',
        true,
        'completed'
    ),
    (
        2026,
        3,
        '2026-03-29 06:00:00',
        '2026-03-29 05:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        4,
        '2026-04-12 16:00:00',
        '2026-04-12 15:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        5,
        '2026-04-19 18:00:00',
        '2026-04-19 17:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        6,
        '2026-05-03 21:00:00',
        '2026-05-02 20:00:00',
        true,
        'upcoming'
    ),
    (
        2026,
        7,
        '2026-05-24 19:00:00',
        '2026-05-23 18:00:00',
        true,
        'upcoming'
    ),
    (
        2026,
        8,
        '2026-06-07 14:00:00',
        '2026-06-07 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        9,
        '2026-06-14 14:00:00',
        '2026-06-14 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        10,
        '2026-06-28 14:00:00',
        '2026-06-28 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        11,
        '2026-07-05 15:00:00',
        '2026-07-04 14:00:00',
        true,
        'upcoming'
    ),
    (
        2026,
        12,
        '2026-07-19 14:00:00',
        '2026-07-19 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        13,
        '2026-07-26 14:00:00',
        '2026-07-26 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        14,
        '2026-08-23 14:00:00',
        '2026-08-22 13:00:00',
        true,
        'upcoming'
    ),
    (
        2026,
        15,
        '2026-09-06 14:00:00',
        '2026-09-06 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        16,
        '2026-09-13 14:00:00',
        '2026-09-13 13:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        17,
        '2026-09-27 12:00:00',
        '2026-09-27 11:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        18,
        '2026-10-11 13:00:00',
        '2026-10-10 12:00:00',
        true,
        'upcoming'
    ),
    (
        2026,
        19,
        '2026-10-25 20:00:00',
        '2026-10-25 19:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        20,
        '2026-11-01 21:00:00',
        '2026-11-01 20:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        21,
        '2026-11-08 18:00:00',
        '2026-11-08 17:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        22,
        '2026-11-21 07:00:00',
        '2026-11-21 06:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        23,
        '2026-11-29 16:00:00',
        '2026-11-29 15:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        24,
        '2026-12-06 14:00:00',
        '2026-12-06 13:00:00',
        false,
        'upcoming'
    ) ON CONFLICT (season, round) DO
UPDATE
SET
    date = EXCLUDED.date,
    cutoff = EXCLUDED.cutoff,
    status = EXCLUDED.status;

-- 3. DRIVER STANDINGS (Updated with mock result points)
INSERT INTO
    public.driver_standings (season, driver_id, points, position)
VALUES
    (2026, 'norris', 51, 1),
    (2026, 'verstappen', 48, 2),
    (2026, 'leclerc', 36, 3),
    (2026, 'hamilton', 28, 4),
    (2026, 'piastri', 28, 5),
    (2026, 'russell', 18, 6),
    (2026, 'sainz', 16, 7),
    (2026, 'perez', 9, 8),
    (2026, 'alonso', 4, 9),
    (2026, 'hulkenberg', 1, 10),
    (2026, 'gasly', 1, 11),
    (2026, 'albon', 0, 12),
    (2026, 'antonelli', 0, 13),
    (2026, 'bearman', 0, 14),
    (2026, 'bortoleto', 0, 15),
    (2026, 'bottas', 0, 16),
    (2026, 'colapinto', 0, 17),
    (2026, 'hadjar', 0, 18),
    (2026, 'lawson', 0, 19),
    (2026, 'lindblad', 0, 20),
    (2026, 'ocon', 0, 21),
    (2026, 'stroll', 0, 22) ON CONFLICT (season, driver_id) DO
UPDATE
SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;

-- 4. CONSTRUCTOR STANDINGS (Updated with mock result points)
INSERT INTO
    public.constructor_standings (season, constructor_id, points, position)
VALUES
    (2026, 'mclaren', 79, 1),
    (2026, 'ferrari', 64, 2),
    (2026, 'redbull', 48, 3),
    (2026, 'mercedes', 18, 4),
    (2026, 'williams', 16, 5),
    (2026, 'cadillac', 9, 6),
    (2026, 'astonmartin', 4, 7),
    (2026, 'audi', 1, 8),
    (2026, 'alpine', 1, 9),
    (2026, 'haas', 0, 10),
    (2026, 'rb', 0, 11) ON CONFLICT (season, constructor_id) DO
UPDATE
SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;

-- 5. MOCK RESULTS FOR PAST RACES
-- Round 1 Result
INSERT INTO
    public.race_results (
        race_id,
        p1_driver,
        p2_driver,
        p3_driver,
        p4_driver,
        p5_driver,
        p6_driver,
        p7_driver,
        p8_driver,
        p9_driver,
        p10_driver,
        c1_constructor,
        c2_constructor,
        c3_constructor,
        c4_constructor,
        c5_constructor,
        pole_position,
        fastest_lap,
        first_retirement,
        safety_car,
        red_flag
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 1
        ),
        'verstappen',
        'norris',
        'hamilton',
        'leclerc',
        'piastri',
        'russell',
        'sainz',
        'perez',
        'alonso',
        'hulkenberg',
        'redbull',
        'mclaren',
        'ferrari',
        'mercedes',
        'williams',
        'verstappen',
        'verstappen',
        'albon',
        true,
        false
    ) ON CONFLICT (race_id) DO NOTHING;

-- Round 2 Sprint Result
INSERT INTO
    public.sprint_results (
        race_id,
        sp1_driver,
        sp2_driver,
        sp3_driver,
        sp4_driver,
        sp5_driver,
        sp6_driver,
        sp7_driver,
        sp8_driver,
        c1_constructor,
        c2_constructor,
        c3_constructor,
        c4_constructor,
        c5_constructor,
        pole_position,
        fastest_lap,
        first_retirement,
        safety_car,
        red_flag
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 2
        ),
        'norris',
        'verstappen',
        'piastri',
        'leclerc',
        'russell',
        'hamilton',
        'sainz',
        'perez',
        'mclaren',
        'redbull',
        'ferrari',
        'mercedes',
        'williams',
        'norris',
        'piastri',
        'stroll',
        false,
        false
    ) ON CONFLICT (race_id) DO NOTHING;

-- Round 2 Race Result
INSERT INTO
    public.race_results (
        race_id,
        p1_driver,
        p2_driver,
        p3_driver,
        p4_driver,
        p5_driver,
        p6_driver,
        p7_driver,
        p8_driver,
        p9_driver,
        p10_driver,
        c1_constructor,
        c2_constructor,
        c3_constructor,
        c4_constructor,
        c5_constructor,
        pole_position,
        fastest_lap,
        first_retirement,
        safety_car,
        red_flag
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 2
        ),
        'norris',
        'leclerc',
        'verstappen',
        'piastri',
        'hamilton',
        'sainz',
        'russell',
        'perez',
        'alonso',
        'gasly',
        'mclaren',
        'ferrari',
        'redbull',
        'williams',
        'mercedes',
        'norris',
        'leclerc',
        'bearman',
        true,
        true
    ) ON CONFLICT (race_id) DO NOTHING;