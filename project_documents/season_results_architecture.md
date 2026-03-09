# F1 Predictions — Season Results Architecture Report

This report details how the season-level prediction system operates, from the database tier up to the React frontend.

## 1. How the Tables are Interlocked

The database uses three distinct tables to manage season-long standings and results:

- **`driver_standings`**: Stores the real-world championship points and current position for each driver.
- **`constructor_standings`**: Stores the real-world championship points and current position for each constructor team.
- **[season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802)**: Acts as a **materialized view** of the standings. Instead of querying multiple tables and joining them on the fly, this table flattens the entire season's final (or current) outcome into a single row. It has columns for `d1_driver` through `d22_driver` (representing the top 22 drivers in order) and `c1_constructor` through `c11_constructor` (representing the top 11 teams). It also stores the categorical bonuses (`most_poles`, `most_fastest_laps`, `most_first_retirements`).

**The Interlock**: The [season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802) table is completely dependent on the two standings tables. It is designed to be the single source of truth that the API queries to score a user's `season_predictions`. 

## 2. How the Tables are Updated

The system relies heavily on PostgreSQL **Triggers** to keep the data synchronized automatically.

1. **External Updates to Standings**: When a race finishes, an external process (or future cron job) fetches the latest real-world championship standings and updates the `points` and `position` columns in `driver_standings` and `constructor_standings`.
2. **Trigger Activation**: The database has two triggers defined in [SQL/schema.sql](file:///c:/Uni/Projekte/f1-predictions/SQL/schema.sql):
   - `tr_after_driver_standings_update`
   - `tr_after_constructor_standings_update`
3. **The Sync Function**: Whenever either standings table is modified, the trigger fires the `update_season_results_from_standings()` plpgsql function.
4. **Flattening the Data**:
   - The function queries all drivers, ordering them by `points DESC, position ASC`.
   - It queries all constructors, ordering them similarly.
   - It then performs an `INSERT ... ON CONFLICT (season) DO UPDATE` into the [season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802) table, mapping the #1 driver to `d1_driver`, #2 to `d2_driver`, etc., and the #1 constructor to `c1_constructor`, etc.

This guarantees that [season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802) is always a perfectly accurate, flattened representation of the current live standings.

## 3. Populating the Season Results Page

When a user navigates to the Season Results page, the frontend calls the `GET /api/results/season` endpoint (`[api/routes/results.py]`). Here is the step-by-step data flow:

1. **Fetch Actuals**: The API queries the single row from [season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802) for the active season to get the real-world driver and constructor ordering (`d1`, `d2`... `c1`, `c2`...).
2. **Calculate Bonuses Dynamically**: Interestingly, the categorical bonuses (Most Poles, etc.) are **not** read from the [season_results](file:///c:/Uni/Projekte/f1-predictions/api/routes/results.py#614-802) table directly. Instead, the API dynamically calculates them on-the-fly by querying all completed [race_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#109-178) and [sprint_results](file:///c:/Uni/Projekte/f1-predictions/api/_utils/f1_api.py#179-238) for the season, counting who actually got the most poles, fastest laps, and retirements so far using a Python `Counter`.
3. **Fetch User Prediction**: The API queries `season_predictions` to get what the user guessed before the season started.
4. **Compute Component Scores**: The API iterates through all 22 driver slots and 11 constructor slots:
   - For positions 1-10 (Drivers) and 1-5 (Constructors), it awards exact match points (e.g., 250 for P1, 180 for P2) or partial match points (20 pts if predicted driver is anywhere in the top 10).
   - For the remaining positions (11-22 drivers, 6-11 constructors), it awards 10 points for an exact match.
5. **Format Response**: The API formats all this raw data into a generic array of `RaceResult` objects (with `Category`, `Position`, `Actual`, `Predicted`, `Points`) and sends it to the frontend.

## 4. Calculating Points in the Hero Element

In [src/frontend/pages/SeasonResults.tsx](file:///c:/Uni/Projekte/f1-predictions/src/frontend/pages/SeasonResults.tsx), the points displayed in the top Hero element are calculated entirely **client-side** based on the data array returned by the API.

Here is the exact calculation flow (lines 84-97):

1. **Filtering by Category**: The frontend splits the flat array from the API into three groups:
   ```typescript
   const drivers = results.filter((r) => r.Category === "RESULT")
   const constructors = results.filter((r) => r.Category === "CONSTRUCTOR")
   const bonus = results.filter((r) => r.Category === "BONUS")
   ```
2. **Summing the Groups**: It uses `reduce` to sum up the `Points` string value provided by the API for each row:
   ```typescript
   const driverScore = drivers.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
   const constructorScore = constructors.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
   const bonusScore = bonus.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
   ```
3. **Hero Total Calculation**: The total score is simply the sum of the three categories:
   ```typescript
   const userScore = driverScore + constructorScore + bonusScore
   ```
   *(Note: The code attempts to find the user in the `LEADERBOARD` rows first, but if it doesn't find them—which is common for the active season view—it falls back to this dynamic sum of the individual rows).*

Because this calculation happens dynamically based on the current standings, the page includes a "Preliminary Results" banner explaining that these points fluctuate with every race until the season ends.
