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

---

## Prediction Endpoints

### Get Prediction

- **URL**: `/api/predictions`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `session_type`: `race` | `sprint` | `season` (Required)
  - `race_id`: The ID of the race (Required for `race` and `sprint`)
  - `season`: Year (Default: `2026`, only for `season`)
- **Success Response (200 OK)**:
  ```json
  {
    "prediction": { ...prediction_object } | null
  }
  ```

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
- **Success Response (200 OK)**: Returns consolidated stats like rank, total points, avg points, etc.

### Get Card Stats

- **URL**: `/api/profile/cards-stats`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Parameters**: `team_id`, `driver_id`
- **Success Response (200 OK)**: Returns detailed driver and constructor standings and recent results.

---

## Results Endpoints

### Get Last Race Results

- **URL**: `/api/results/last`
- **Method**: `GET`
- **Auth Required**: Optional (Provide Bearer token to include user prediction comparison)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "results": [ ...rows ],
    "race": { ...race_info }
  }
  ```

---

## Admin Endpoints (Require Admin Auth)

### Fetch Results

- **URL**: `/api/admin/fetch-results`
- **Method**: `POST`
- **Body**: `{ "race_id": 1, "session_type": "race" | "sprint" }`

### Race Management

- **URL**: `/api/admin/races`
- **Method**: `POST` | `PUT` | `DELETE`

### Enter Results Manually

- **URL**: `/api/admin/results`
- **Method**: `POST`

---

## Cron Jobs

### Auto-Fetch Results

- **URL**: `/api/cron/fetch-results`
- **Method**: `GET`
- **Auth Required**: `Authorization: Bearer <CRON_SECRET>`
- **Description**: Automatically fetches results for locked races after the cutoff.
