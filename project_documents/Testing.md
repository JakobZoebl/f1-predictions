# Comprehensive Automated Testing Script for Claude 4.6

**Goal:** You are Claude Opus 4.6, an advanced AI agent. Your task is to execute a comprehensive end-to-end (E2E) testing suite for the F1 Predictions App. You are inside Antigravity from google and have easy access to the browser for real time testing in the web. You will interact with the browser, navigate pages, fill forms, and assert expected text/elements.

## Prerequisites and Environment Setup

1. **Frontend:** Running on `http://localhost:5173`
2. **Backend:** Running on `http://localhost:5328`
3. **Database:** Supabase seeded with `mock_seed_data.sql` and using the `schema.sql´ database layout
4. **Test Accounts:**
   - Account 1: `jakob@zoebl-edv.at` / `01022004` (seeded with predictions)

**Instructions for Claude:**

- Follow each test case sequentially.
- If a test fails, document the failure but proceed to the next independent test if possible.
- Use your browser automation capabilities to click, type, drag-and-drop, and verify DOM text/elements.
- Ensure that you are validating all edge cases, validations, and API error handling.
- Always keep track of the console that runs the python backend to see any possible API errors.

---

## Scope 1: Authentication & Authorization

### Test 1.1: Protected Route Enforcement

- **Action:** Navigate directly to `http://localhost:5173/home` without logging in.
- **Expected:** Automatically redirected to `/login` or `/`.

### Test 1.2: Invalid Login Handling

- **Action:** Navigate to `http://localhost:5173/login`. Submit email `fake@test.com` and password `WrongPass!`.
- **Expected:** Error message displayed (e.g., "Invalid login credentials").

### Test 1.3: Successful Sign Up

- **Action:** Navigate to `http://localhost:5173/signup`. Fill out the form with email `claude_tester@test.com`, username `claudetester`, display name `Claude Tester`, password `Test123!`, favorite team `McLaren`, favorite driver `Lando Norris`. Submit.
- **Expected:** Successful account creation, redirected to `/home`.

### Test 1.4: Successful Log In & Log Out

- **Action:** Click "Log Out" from the navigation menu. Navigate to `http://localhost:5173/login`. Log in with `testuser1@test.com` and `Test123!`.
- **Expected:** Redirected to `/home`. Global state reflects "Max Predictor" is logged in.

### Test 1.5: Delete Account

- **Action:** As the newly created `claude_tester@test.com`, navigate to Profile -> Settings -> Delete Account. Confirm deletion.
- **Expected:** Account deleted, redirected to landing page or `/login`. _(Note: For the remainder of the tests, ensure you are logged in as `testuser1@test.com`)_.

---

## Scope 2: Core Navigation & Home Page

_Prereq: Logged in as `testuser1@test.com`._

### Test 2.1: Home Page Elements Load

- **Action:** Navigate to `http://localhost:5173/home`.
- **Expected:**
  - Season Summary card displays "Last Race" points and rank.
  - "Next Race" countdown shows an upcoming race (Round 3).
  - Quick Stats card displays total points and rank.

### Test 2.2: Season Overview Calendar

- **Action:** Navigate to `http://localhost:5173/season-overview`.
- **Expected:**
  - All 24 rounds display.
  - Round 1 and Round 2 show as "Completed" with "View Results" buttons.
  - Sprint badge is visible on Sprint weekends (e.g., Round 2, Round 6).
  - Clicking "View Results" on Round 1 correctly navigates to `http://localhost:5173/race-results/1`.

---

## Scope 3: Making & Editing Predictions

### Test 3.1: Cutoff Enforcement (Locked Race)

- **Action:** Navigate to `http://localhost:5173/race-predictions`. Select Round 1 from the dropdown.
- **Expected:** Prediction form is locked/disabled. A message indicates the cutoff has passed.

### Test 3.2: Prediction Form Validation (Incomplete Form)

- **Action:** Select an upcoming round (e.g., Round 3). Select fewer than 10 drivers. Leave constructor choices blank. Attempt to submit.
- **Expected:** Form validation error prevents submission until exactly 10 drivers and 5 constructors are selected.

### Test 3.3: Submit New Race Prediction

- **Action:** For Round 3, select exactly 10 drivers in order, 5 constructors in order, Pole Position, Fastest Lap, First Retirement, Safety Car (Yes/No), and Red Flag (Yes/No). Submit.
- **Expected:** Success notification. The prediction is saved successfully and is visible upon refreshing the page.

### Test 3.4: Edit Existing Prediction

- **Action:** Refresh the page for Round 3 predictions. Change the P1 driver to a different driver and submit.
- **Expected:** Success notification. Changes are saved and persist after reloading.

### Test 3.5: Submit Sprint Prediction

- **Action:** Navigate to `http://localhost:5173/sprint-predictions`. Select an upcoming Sprint round (e.g., Round 6). Submit a valid sprint prediction (8 drivers, 5 constructors, bonuses).
- **Expected:** Success notification. The prediction is saved.

### Test 3.6: Locked Sprint Cutoff Enforcement

- **Action:** Select Round 2 (a past sprint).
- **Expected:** Form is locked and disabled with a cutoff message.

### Test 3.7: Locked Season Prediction View

- **Action:** Navigate to `http://localhost:5173/season-predictions`.
- **Expected:** The form is disabled (locked) because `testuser1` has already submitted it and the season has started. The saved 22-driver/11-constructor picks are clearly visible as read-only.

---

## Scope 4: Viewing Results & Scoring Validation

### Test 4.1: View Last Race Results

- **Action:** Navigate to `http://localhost:5173/race-results` and select Round 2.
- **Expected:**
  - Shows actual race results vs user predictions side-by-side.
  - Green checkmarks for correct hits.
  - Red minuses for misses.
  - Total points for the race matches calculated value in `points_log`.

### Test 4.2: View Sprint Results

- **Action:** Navigate to `http://localhost:5173/sprint-results` and select Round 2.
- **Expected:** Displays 8 actual sprint finishing positions vs user predictions, properly scored with correct points breakdown.

### Test 4.3: View Season Results

- **Action:** Navigate to `http://localhost:5173/season-results`.
- **Expected:** Displays current driver/constructor standings.

---

## Scope 5: Leaderboard & Profile Stats

### Test 5.1: Leaderboard Table and Trends

- **Action:** Navigate to `http://localhost:5173/leaderboard`.
- **Expected:**
  - Table shows all seeded users.
  - Total points, rank, and "trend" arrows (▲/▼/--) are correctly displayed.
  - Stats cards load average points, highest score, active players, and total predictions.

### Test 5.2: Profile Season Stats and Cards

- **Action:** Navigate to `http://localhost:5173/profile`.
- **Expected:**
  - "Season Stats" display total points, best race, worst race, and average points.
  - "Favorite Cards" show favorite driver and constructor stats (Wins, Poles, Podiums).

### Test 5.3: Update Profile Settings

- **Action:** Click "Settings" (or navigate to `http://localhost:5173/profile-settings`). Change Display Name to "Claude The Great" and update favorite driver to "Charles Leclerc". Save.
- **Expected:**
  - Success message.
  - Navigation bar/Profile page instantly reflects the new name.
  - Profile favorite card updates to Leclerc.

### Test 5.4: Avatar Upload & Delete

- **Action:** In Profile Settings, attempt to upload a valid image for an avatar. Once uploaded, delete it.
- **Expected:** Avatar displays temporarily, and once deleted, falls back to the default placeholder.

---

## Scope 6: Backend API & Cron Validations (Direct API Execution)

### Test 6.1: Manual Cron Execution

- **Action:** Perform a `GET` request to `http://localhost:5328/api/cron/fetch-results` (you may use fetch or cURL in the terminal).
- **Expected:** 200 OK response with a JSON body indicating processing status.

### Test 6.2: Validate Standings Update

- **Action:** After running the cron job, perform a `GET` request to `http://localhost:5328/api/results/season` (requires Authorization header).
- **Expected:** Returns array of driver and constructor standings. Ensure `position` and `points` fields are strictly greater than 0 for Max Verstappen and Lando Norris.
