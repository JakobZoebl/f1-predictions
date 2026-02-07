# F1 PREDICTIONS - SECTION 1: PROJECT OVERVIEW & SCORING SYSTEM

## Copy-paste this into Antigravity's Gemini chat when starting the project

---

## PROJECT OVERVIEW

This is a Formula 1 prediction platform where friends compete by predicting race results throughout the F1 season. Users earn points based on prediction accuracy using F1's scoring system.

**Key Features:**
- Race-by-race predictions (every F1 weekend)
- Season-long championship predictions
- Leaderboard with interactive charts
- Profile pages with team theming
- Admin panel for race management
- Automated results fetching and points calculation

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- Vercel (Hosting + Serverless Functions)
- Recharts (Data visualization)
- @dnd-kit (Drag and drop)

---

## SCORING SYSTEM - RACE PREDICTIONS

### Top 10 Drivers Prediction
**Method:** Drag and drop with all 20 drivers listed
**Scoring:**
- Exact position match: F1 points (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
- Driver in top 10 but wrong position: 2 points
- Driver not in top 10: 0 points

**Maximum possible:** 152 points (100 from exact + 52 from partials if all drivers correct but wrong positions)

### Top 5 Constructors Prediction
**Method:** Drag and drop with all 10 teams listed
**Scoring:**
- Exact position match: F1 constructor points (25, 18, 15, 12, 10)
- Constructor in top 5 but wrong position: 10 points
- Constructor not in top 5: 0 points

**Maximum possible:** 70 points

### Bonus Predictions
**Pole Position:** 10 points (dropdown menu)
**Fastest Lap:** 10 points (dropdown menu)
**First Retirement:** 10 points (dropdown menu, includes "No retirement" option)
**Safety Car/VSC Deployed:** 5 points (yes/no slider toggle)
**Red Flag:** 1 point for correct "No", 5 points for correct "Yes" (yes/no slider toggle)

**Maximum possible:** 41 points

**TOTAL RACE MAXIMUM:** 263 points (152 + 70 + 41)

---

## SCORING SYSTEM - SPRINT PREDICTIONS

### Top 8 Sprint Finish
**Method:** Drag and drop with all 20 drivers
**Scoring:**
- Exact position: Sprint points (8, 7, 6, 5, 4, 3, 2, 1)
- Driver in top 8 but wrong position: 1 point

**Maximum possible:** 44 points

### Sprint Bonus Predictions
**Same as race:** Pole position (10), Fastest lap (10), First retirement (10), Safety Car (5), Red Flag (1/5)

**Maximum possible:** 41 points

**TOTAL SPRINT MAXIMUM:** 85 points (44 + 41)

---

## SCORING SYSTEM - SEASON-LONG PREDICTIONS

### All 20 Drivers Championship Ranking
**Method:** Drag and drop all 20 drivers in predicted championship order
**Scoring:** 10x race scoring multiplier
- Exact position in Top 10: 250, 180, 150, 120, 100, 80, 60, 40, 20, 10 points
- Driver in Top 10 but wrong position: 20 points
- Exact position outside Top 10 (P11-P20): 10 points each

**Maximum possible:** 1,700 points

### All 10 Constructors Championship Ranking
**Method:** Drag and drop all 10 teams in predicted championship order
**Scoring:** 10x race scoring multiplier
- Exact position in Top 5: 250, 180, 150, 120, 100 points
- Constructor in Top 5 but wrong position: 20 points
- Exact position outside Top 5 (P6-P10): 10 points each

**Maximum possible:** 900 points

### Season Statistics Predictions
**Most Pole Positions:** 100 points (dropdown menu)
**Most Fastest Laps:** 100 points (dropdown menu)

**Maximum possible:** 200 points

**TOTAL SEASON MAXIMUM:** 2,800 points (1,700 + 900 + 200)

**IMPORTANT:** Season predictions lock permanently after Round 1 starts and cannot be changed.

---

## PREDICTION DEADLINES

- **Race predictions:** Lock 1 hour before FP1 or qualifying (whichever comes first)
- **Sprint predictions:** Lock 1 hour before sprint qualifying
- **Season predictions:** Lock before Round 1 (Bahrain GP)

---

## Use this context for:
1. Understanding the overall system
2. Implementing scoring calculation functions
3. Creating prediction forms
4. Validating user inputs
5. Calculating and displaying potential points
6. Building the points calculation engine

**Next sections will cover:**
- Section 2: Database schema
- Section 3: UI/UX specifications
- Section 4: Authentication & security
- Section 5: API endpoints
- Section 6: Component specifications
