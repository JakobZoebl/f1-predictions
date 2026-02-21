# F1 Predictions API Documentation

This document describes all API endpoints available in the F1 Predictions application.

## Base URL

All API endpoints are prefixed with `/api`. When running locally, the base URL is usually `http://localhost:3000/api` (proxied via Vite) or `http://localhost:5328/api`.

---

## Authentication Endpoints

### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "session": {
      "access_token": "jwt_token...",
      "refresh_token": "refresh_token...",
      "expires_in": 3600,
      "token_type": "bearer"
    },
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: Server error.

### Signup

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "password": "securepassword",
    "favorite_team_id": "redbull", (optional)
    "favorite_driver_id": "verstappen" (optional)
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "display_name": "John Doe"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid input or missing fields.
  - `409 Conflict`: Username already taken.
  - `500 Internal Server Error`: Auth or database error.

### Logout

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

### Reset Password

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Auth Required**: No
- **Status**: Not implemented (TODO). Intended to send a password reset email via Supabase Auth.

---

## Prediction Endpoints

### Get Prediction

- **URL**: `/api/predictions`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `session_type`: `race` | `sprint` | `season` (Required)
  - `race_id`: The ID of the race (Required for `race` and `sprint`)
  - `season`: Year (Default: `2026`; only used when `session_type` is `season`)
- **Success Response (200 OK)**:
  ```json
  {
    "prediction": { ...prediction_object } | null
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing `session_type` or `race_id` (when required).
  - `401 Unauthorized`: Missing or invalid Bearer token.
  - `500 Internal Server Error`: Database error.

### Submit Prediction

- **URL**: `/api/predictions`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "session_type": "race" | "sprint" | "season",
    "race_id": "id" (if race/sprint),
    "drivers": ["driver_id_1", "driver_id_2", ...],
    "constructors": ["team_id_1", ...],
    "bonus": {
      "pole_position": "driver_id",
      "fastest_lap": "driver_id",
      "first_retirement": "driver_id",
      "safety_car": true/false,
      "red_flag": true/false
    }
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Prediction saved successfully!"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing `session_type`, `race_id` (for race/sprint), or invalid payload.
  - `401 Unauthorized`: Missing or invalid Bearer token.
  - `500 Internal Server Error`: Database error.

---

## Profile Endpoints

### Get Profile

- **URL**: `/api/profile`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "profile": {
      "username": "johndoe",
      "display_name": "John Doe",
      "avatar_url": "url...",
      "favorite_team_id": "...",
      "favorite_driver_id": "...",
      "created_at": "...",
      "email": "..."
    }
  }
  ```

### Update Profile

- **URL**: `/api/profile`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Request Body**: (all fields optional)
  ```json
  {
    "display_name": "New Name",
    "favorite_team_id": "new_team",
    "favorite_driver_id": "new_driver",
    "password": "newpassword"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "profile": { ...updated_profile }
  }
  ```

### Manage Avatar

- **URL**: `/api/profile/avatar`
- **Method**: `POST` (upload) | `DELETE` (remove)
- **Auth Required**: Yes (Bearer Token)
- **POST (Multipart Form Data)**: `file` field with image.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "avatar_url": "..." (for POST)
  }
  ```

### Get Season Stats

- **URL**: `/api/profile/season-stats`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "stats": {
      "rank": "#1",
      "total_points": 150,
      "avg_points": 25.5,
      "races_predicted": 6,
      "total_completed_races": 8,
      "last_race": { "name": "Monaco GP", "points": 42 },
      "best_finish": "-",
      "worst_finish": "-",
      "accuracyBars": { "exactMatches": 0, "top10": 0, "polePosition": 0, "fastestLap": 0, "safetyCar": 0, "redFlag": 0 }
    }
  }
  ```
- **Error Responses**: `404` if no active season; `500` on server error.

### Get Card Stats

- **URL**: `/api/profile/cards-stats`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Parameters**: `team_id` (required), `driver_id` (required)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "constructor": {
        "standingsPos": 1,
        "standingsPoints": 250,
        "seasonStats": { "races": 8, "wins": 4, "podiums": 6, "dnfs": 0 },
        "recentResults": ["1st", "2nd", "1st", "3rd", "1st"]
      },
      "driver": {
        "standingsPos": 1,
        "standingsPoints": 120,
        "seasonStats": { "races": 8, "wins": 3, "podiums": 5, "poles": 2 },
        "recentResults": ["1st", "2nd", "OUT", "1st", "3rd"]
      }
    }
  }
  ```
- **Error Responses**: `400` if `team_id` or `driver_id` missing; `404` if no active season; `500` on server error.

---

## Results Endpoints

### Get Last Race Results

- **URL**: `/api/results/last`
- **Method**: `GET`
- **Auth Required**: Optional (Provide Bearer token to include user prediction comparison and per-user points)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "results": [
      { "Category": "RESULT", "Position": "1", "Actual": "verstappen", "Predicted": "verstappen", "Points": "25", "Team": "", "Details": "" },
      { "Category": "CONSTRUCTOR", ... },
      { "Category": "BONUS", ... },
      { "Category": "LEADERBOARD", "Position": "1", "Points": "180", "Team": "username", ... }
    ],
    "race": { "id": 1, "name": "...", "round": 1, "season": 2026, ... }
  }
  ```
- **Error Responses**: `500` on server error.

### Get Last Sprint Results

- **URL**: `/api/results/last-sprint`
- **Method**: `GET`
- **Auth Required**: Optional (Provide Bearer token to include user prediction comparison and per-user points)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "results": [
      { "Category": "RESULT", "Position": "1", "Actual": "driver_id", "Predicted": "driver_id", "Points": "8", "Team": "", "Details": "" },
      { "Category": "CONSTRUCTOR", ... },
      { "Category": "BONUS", ... },
      { "Category": "LEADERBOARD", "Position": "1", "Points": "85", "Team": "username", ... }
    ],
    "race": { "id": 1, "name": "...", "round": 1, "season": 2026, ... }
  }
  ```
- **Notes**: Same structure as last race results; driver positions are top 8 (sprint scoring). Leaderboard entries are filtered by `session_type: "sprint"`.
- **Error Responses**: `500` on server error.

---

## Admin Endpoints (Require Admin Auth)

### Fetch Results

- **URL**: `/api/admin/fetch-results`
- **Method**: `POST`
- **Auth Required**: Admin (Bearer Token with admin role)
- **Request Body**:
  ```json
  { "race_id": 1, "session_type": "race" | "sprint" }
  ```
- **Status**: Not fully implemented (TODO). Intended to fetch results from Jolpica API and store in `race_results` or `sprint_results`.

### Race Management

- **URL**: `/api/admin/races`
- **Method**: `POST` | `PUT` | `DELETE`
- **Auth Required**: Admin
- **Status**: Not fully implemented (TODO). Intended for creating, updating, and deleting race records.

### Enter Results Manually

- **URL**: `/api/admin/results`
- **Method**: `POST`
- **Auth Required**: Admin
- **Request Body**: `{ "race_id": 1, "session_type": "race" | "sprint", ...results }`
- **Status**: Not fully implemented (TODO). Intended for manual entry of race or sprint results.

---

## Health Check

### API Health

- **URL**: `/api` | `/api/index.py` | `/api/health`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "F1 Predictions API is running via single Vercel Function"
  }
  ```

---

## Cron Jobs

### Auto-Fetch Results

- **URL**: `/api/cron/fetch-results`
- **Method**: `GET`
- **Auth Required**: `Authorization: Bearer <CRON_SECRET>` (environment variable)
- **Description**: Cron job that runs on a schedule (e.g. every 2 hours on Sundays). Intended to:
  1. Verify cron secret
  2. Find races with `status='locked'` and cutoff passed
  3. For each race without results: fetch from Jolpica API, save results, calculate points, update race status to `completed`
  4. Refresh leaderboard
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "races_processed": 1,
    "errors": []
  }
  ```
- **Error Responses**: `401` invalid cron secret; `500` server error.
- **Status**: Logic is not fully implemented (TODO in `api/cron/fetch_results.py`).
