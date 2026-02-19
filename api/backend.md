# Backend Structure – Walkthrough

## What Was Created

**30 Python files** across 8 directories under `api/`, plus updates to 4 config files.

### File Tree

```
api/
├── index.py                      # GET /api — Health check
├── requirements.txt              # Python dependencies
│
├── _utils/                       # Shared utilities (6 files)
│   ├── __init__.py
│   ├── supabase_client.py        # Supabase client factory
│   ├── auth_helpers.py           # JWT verify, @require_auth, @require_admin
│   ├── scoring.py                # Points calculation (race/sprint/season)
│   ├── f1_api.py                 # Jolpica API client + retry logic
│   └── validators.py             # Input validation for all endpoints
│
├── auth/                         # Authentication (5 files)
│   ├── login.py                  # POST — Email/password login
│   ├── signup.py                 # POST — Register + create profile
│   ├── logout.py                 # POST — Invalidate session
│   ├── reset_password.py         # POST — Send password reset email
│   └── update_password.py        # PUT  — Set new password
│
├── predictions/                  # Prediction CRUD (3 files)
│   ├── race.py                   # GET/POST — Race predictions
│   ├── sprint.py                 # GET/POST — Sprint predictions
│   └── season.py                 # GET/POST — Season predictions
│
├── races/                        # Race data (2 files)
│   ├── index.py                  # GET — List races (with filters)
│   └── next.py                   # GET — Next upcoming race + countdown
│
├── results/                      # Results read-only (2 files)
│   ├── race.py                   # GET — Race results
│   └── sprint.py                 # GET — Sprint results
│
├── leaderboard/                  # Leaderboard (2 files)
│   ├── index.py                  # GET — Standings
│   └── chart_data.py             # GET — Points progression for charts
│
├── profile/                      # User profiles (2 files)
│   ├── index.py                  # GET/PUT — Profile + stats
│   └── preferences.py            # GET/PUT — Favorite team/driver
│
├── admin/                        # Admin-only (5 files)
│   ├── races.py                  # POST/PUT/DELETE — Race management
│   ├── results.py                # POST — Enter race results manually
│   ├── sprint_results.py         # POST — Enter sprint results manually
│   ├── calculate_points.py       # POST — Trigger points calculation
│   └── fetch_results.py          # POST — Fetch from Jolpica API
│
└── cron/                         # Cron jobs (1 file)
    └── fetch_results.py          # GET — Auto-fetch after races (Sundays)
```

### Config Changes

| File | Change |
|------|--------|
| [vercel.json](file:///home/jakob/Uni/Projects/f1-predictions/vercel.json) | Removed catch-all API rewrite, added cron schedule |
| [requirements.txt](file:///home/jakob/Uni/Projects/f1-predictions/api/requirements.txt) | Added `PyJWT` and `pydantic` |
| [.env.example](file:///home/jakob/Uni/Projects/f1-predictions/.env.example) | Added `SUPABASE_JWT_SECRET` and `CRON_SECRET` |

### What Each File Contains

Every endpoint file has:
- Module-level docstring with **endpoint URL**, **HTTP methods**, **request/response schemas**, and **error codes**
- A stub Flask app with route decorator
- A function with a docstring listing the **implementation steps** (all with [pass](file:///home/jakob/Uni/Projects/f1-predictions/api/auth/reset_password.py#22-34) — no logic yet)

The `_utils/` files have fully documented function signatures with type hints, args/returns docs, and `# TODO` comments describing what needs to be implemented.

## Verification

✅ `find api/ -type f | sort` confirms all 30 files are present in the expected locations.
