-- ==============================================================================
-- 2026 F1 SEASON SEED DATA
-- ==============================================================================
-- 1. SEASONS
INSERT INTO
    public.seasons (year, is_active)
VALUES
    (2026, true) ON CONFLICT (year) DO NOTHING;

-- 2. RACES
INSERT INTO
    public.races (season, round, date, cutoff, has_sprint, status)
VALUES
    (
        2026,
        1,
        '2026-03-08 05:00:00',
        '2026-03-07 06:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        2,
        '2026-03-15 08:00:00',
        '2026-03-14 08:00:00',
        true,
        'upcoming'
    ), -- Chinese GP (Sprint)
    (
        2026,
        3,
        '2026-03-29 06:00:00',
        '2026-03-28 07:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        4,
        '2026-04-12 16:00:00',
        '2026-04-11 18:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        5,
        '2026-04-19 18:00:00',
        '2026-04-18 19:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        6,
        '2026-05-03 21:00:00',
        '2026-05-02 22:00:00',
        true,
        'upcoming'
    ), -- Miami GP (Sprint)
    (
        2026,
        7,
        '2026-05-24 19:00:00',
        '2026-05-23 22:00:00',
        true,
        'upcoming'
    ), -- Canadian GP (Sprint)
    (
        2026,
        8,
        '2026-06-07 14:00:00',
        '2026-06-06 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        9,
        '2026-06-14 14:00:00',
        '2026-06-13 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        10,
        '2026-06-28 14:00:00',
        '2026-06-27 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        11,
        '2026-07-05 15:00:00',
        '2026-07-04 17:00:00',
        true,
        'upcoming'
    ), -- British GP (Sprint)
    (
        2026,
        12,
        '2026-07-19 14:00:00',
        '2026-07-18 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        13,
        '2026-07-26 14:00:00',
        '2026-07-25 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        14,
        '2026-08-23 14:00:00',
        '2026-08-22 16:00:00',
        true,
        'upcoming'
    ), -- Dutch GP (Sprint)
    (
        2026,
        15,
        '2026-09-06 14:00:00',
        '2026-09-05 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        16,
        '2026-09-13 14:00:00',
        '2026-09-12 16:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        17,
        '2026-09-27 12:00:00',
        '2026-09-25 14:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        18,
        '2026-10-11 13:00:00',
        '2026-10-10 15:00:00',
        true,
        'upcoming'
    ), -- Singapore GP (Sprint)
    (
        2026,
        19,
        '2026-10-25 20:00:00',
        '2026-10-24 23:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        20,
        '2026-11-01 21:00:00',
        '2026-10-31 22:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        21,
        '2026-11-08 18:00:00',
        '2026-11-07 19:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        22,
        '2026-11-21 07:00:00',
        '2026-11-21 05:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        23,
        '2026-11-29 16:00:00',
        '2026-11-28 19:00:00',
        false,
        'upcoming'
    ),
    (
        2026,
        24,
        '2026-12-06 14:00:00',
        '2026-12-05 15:00:00',
        false,
        'upcoming'
    ) ON CONFLICT (season, round) DO NOTHING;

-- 2.1 SPRINTS
INSERT INTO
    public.sprints (race_id, season, round, date, cutoff, status)
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
        2026,
        2,
        '2026-03-14 08:00:00',
        '2026-03-13 08:30:00',
        'upcoming'
    ),
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 6
        ),
        2026,
        6,
        '2026-05-02 21:00:00',
        '2026-05-01 22:30:00',
        'upcoming'
    ),
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 7
        ),
        2026,
        7,
        '2026-05-23 19:00:00',
        '2026-05-22 22:30:00',
        'upcoming'
    ),
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 11
        ),
        2026,
        11,
        '2026-07-04 15:00:00',
        '2026-07-03 17:30:00',
        'upcoming'
    ),
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 14
        ),
        2026,
        14,
        '2026-08-22 14:00:00',
        '2026-08-21 16:30:00',
        'upcoming'
    ),
    (
        (
            SELECT
                id
            FROM
                public.races
            WHERE
                season = 2026
                AND round = 18
        ),
        2026,
        18,
        '2026-10-10 13:00:00',
        '2026-10-09 14:30:00',
        'upcoming'
    ) ON CONFLICT (season, round) DO NOTHING;

-- 3. DRIVER STANDINGS (Initial alphabetical order, 0 points)
INSERT INTO
    public.driver_standings (season, driver_id, points, position)
VALUES
    (2026, 'albon', 0, 1),
    (2026, 'alonso', 0, 2),
    (2026, 'antonelli', 0, 3),
    (2026, 'bearman', 0, 4),
    (2026, 'bortoleto', 0, 5),
    (2026, 'bottas', 0, 6),
    (2026, 'colapinto', 0, 7),
    (2026, 'gasly', 0, 8),
    (2026, 'hadjar', 0, 9),
    (2026, 'hamilton', 0, 10),
    (2026, 'hulkenberg', 0, 11),
    (2026, 'lawson', 0, 12),
    (2026, 'leclerc', 0, 13),
    (2026, 'lindblad', 0, 14),
    (2026, 'norris', 0, 15),
    (2026, 'ocon', 0, 16),
    (2026, 'perez', 0, 17),
    (2026, 'piastri', 0, 18),
    (2026, 'russell', 0, 19),
    (2026, 'sainz', 0, 20),
    (2026, 'stroll', 0, 21),
    (2026, 'verstappen', 0, 22) ON CONFLICT (season, driver_id) DO
UPDATE
SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;

-- 4. CONSTRUCTOR STANDINGS (Initial alphabetical order, 0 points)
INSERT INTO
    public.constructor_standings (season, constructor_id, points, position)
VALUES
    (2026, 'alpine', 0, 1),
    (2026, 'astonmartin', 0, 2),
    (2026, 'audi', 0, 3),
    (2026, 'cadillac', 0, 4),
    (2026, 'ferrari', 0, 5),
    (2026, 'haas', 0, 6),
    (2026, 'mclaren', 0, 7),
    (2026, 'mercedes', 0, 8),
    (2026, 'rb', 0, 9),
    (2026, 'redbull', 0, 10),
    (2026, 'williams', 0, 11) ON CONFLICT (season, constructor_id) DO
UPDATE
SET
    points = EXCLUDED.points,
    position = EXCLUDED.position;