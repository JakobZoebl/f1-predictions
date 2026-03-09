# Detailed Analysis of F1 Predictions Cron Job & Results Processing

This document outlines the end-to-end flow of how the F1 Predictions app automated cron job works, how the API fetches actual race/sprint results, and how these results propagate through the PostgreSQL database to update user points and leaderboards.

---

## 1. Cron Job Execution ([api/cron/fetch_results.py](file:///c:/Uni/Projekte/f1-predictions/api/cron/fetch_results.py))

The cron job is a Vercel serverless function endpoint (`/api/cron/fetch-results`) scheduled to run periodically (e.g., every 2 hours on Sundays). Its execution flow is as follows:

1. **Authorization**: Validates the `Authorization: Bearer <CRON_SECRET>` header to ensure only authorized or automated Vercel requests can trigger the job.
2. **Finding Completed Events**: It queries the Supabase database for:
   - `sprints` where `date` is in the past and `status` is not `'completed'`.
   - `races` where `date` is in the past and `status` is not `'completed'`.
3. **Data Fetching**: For each pending sprint and race, it calls the internal API utilities ([fetch_sprint_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#179-238) and [fetch_race_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#109-178)) to obtain the official results.
4. **Database Insertion & Completion**:
   - Upserts the fetched results into the [sprint_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#179-238) or [race_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#109-178) tables.
   - Updates the sprint's or race's `status` to `'completed'`.

---

## 2. API Fetching Logic ([api/_utils/f1_api.py](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py))

The API integrations rely primarily on the **Jolpica F1 API** (Ergast compatible) and the **OpenF1 API**. 

### Race Results & Sprint Results
- **Results Query**: Fetches official results from `https://api.jolpi.ca/ergast/f1/{season}/{round}/results.json` (or `sprint.json`).
- **Drivers**: Extracts the top 10 positions for races (P1-P10) or top 8 for sprints (P1-P8). Re-maps the Ergast driver IDs to the app's internal driver defaults.
- **Constructors**: Aggregates the points scored by all drivers of the same constructor in the specific session. The top 5 constructors with the most points are extracted (C1-C5) and re-mapped to internal IDs.
- **Fastest Lap**: Identifies the driver who achieved the fastest lap by checking the `FastestLap.rank == "1"` attribute.
- **First Retirement**: Evaluates the `status` of all drivers. If a driver's status does not contain "Finished", "+", or "Lapped", they are considered retired. The driver with the minimum number of completed laps among the retirees is marked as the first retirement.

### Qualifying & Interruptions
- **Pole Position**: Makes an additional request to the `qualifying.json` endpoint to determine the Pole Position. Falls back to detecting `grid == "1"` in the race results if qualifying data is unavailable.
- **Safety Car & Red Flags**: Queries the OpenF1 API `race_control` endpoint to monitor messages. If a "SafetyCar" category or a "RED" flag event is detected during the race/sprint session, it marks the respective `safety_car` and `red_flag` boolean properties as `True`.

---

## 3. Database Triggers and Points Update ([SQL/schema.sql](file:///c:/Uni/Projekte/f1-predictions/SQL/schema.sql))

Once the cron job inserts the parsed payload into [race_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#109-178) or [sprint_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#179-238), powerful PostgreSQL triggers and functions immediately take over inside the database to score user predictions without blocking the cron process.

### Step 3.1: Trigger Activation
- **`tr_calculate_race_points`**: Fires after an `INSERT` or `UPDATE` on [race_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#109-178).
- **`tr_calculate_sprint_points`**: Fires after an `INSERT` or `UPDATE` on [sprint_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#179-238).
Both call the `public.calculate_f1_points()` function automatically.

### Step 3.2: User Scoring Logic (`calculate_f1_points`)
This function iterates through all users' `predictions` (or `sprint_predictions`) for the newly completed race:
1. **Driver Matches**:
   - Exact Position Match: Grants high points (e.g., 25 for P1, 18 for P2, down to 1 for P10).
   - Partial Match (Driver is in the top 10/8 but wrong position): Grants 2 points (or 1 point for sprints).
2. **Constructor Matches**:
   - Exact Position Match: Grants scale points (25 for C1, 18 for C2, etc.).
   - Partial Match (Constructor is in the top 5 but wrong pos): Grants 10 points (or 4 points for sprints).
3. **Bonuses**:
   - Correct Pole, Fastest Lap, or First Retirement matches award +10 points each.
   - Correct Safety Car prediction awards +5 points.
   - Correct Red Flag prediction awards +5 points (if true) or +1 point (if false).

### Step 3.3: Storage and Leaderboard Update
After summing up the points for a specific user's prediction:
- Updates the `points` column in the `predictions` (or `sprint_predictions`) table.
- Inserts a detailed JSON breakdown (Driver points, Constructor points, Bonuses) into the `points_log` table for audit/history.
- **Aggregates Total Score**: Queries all logs for the user in the current season and updates their `total_points`, `races_predicted`, and `avg_points_per_race` in the `leaderboard` table.
- **Global Rank Recalculation**: Runs a window function (`RANK() OVER (...)`) for the current season to recalculate and persist the exact ranking of every user, pushing their old rank to `previous_rank`.

---

## 4. Season Standings & Results ([schema.sql](file:///c:/Uni/Projekte/f1-predictions/SQL/schema.sql))

There is an additional layer for entire season predictions:
- When the overall **`driver_standings`** or **`constructor_standings`** are updated, triggers (`tr_after_driver_standings_update`, `tr_after_constructor_standings_update`) automatically fire the `update_season_results_from_standings()` function.
- This function dynamically queries the standings table, orders all entities by points descending (and tie-breaking position ascending), and directly overwrites the `season_results` top 22 drivers and top 11 constructors columns. 

### Conclusion
The architecture is heavily asynchronous and database-driven. The serverless Cron job merely acts as a bridge to fetch external API data and push the raw F1 results into Supabase. All complex point aggregations, prediction scoring, and leaderboard ranking are shifted to the PostgreSQL level for instant transactional integrity and performance.
