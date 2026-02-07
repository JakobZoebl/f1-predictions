# F1 PREDICTIONS - MASTER INDEX & USAGE GUIDE

## 📁 Section Files Overview

Your F1 project documentation has been split into **6 specialized sections** that you can feed to Gemini AI in Google Antigravity as you build each feature.

---

## 📚 SECTION FILES

### Section 1: Project Overview & Scoring System
**File:** `01_project_overview_scoring.md`

**Contains:**
- Complete project description
- Race prediction scoring rules
- Sprint prediction scoring rules
- Season prediction scoring rules (10x multiplier)
- Point values for all prediction types
- Deadline rules
- Maximum possible points per category

**Use when:**
- Starting the project (give full context to Gemini)
- Implementing scoring calculation functions
- Building prediction forms
- Creating the points calculation engine
- Need to understand how points are awarded

---

### Section 2: Database Schema
**File:** `02_database_schema.md`

**Contains:**
- Complete SQL schema for all tables
- Table relationships and foreign keys
- Indexes for performance
- Row Level Security (RLS) policies
- Materialized view for leaderboard
- Database constraints and validations

**Use when:**
- Setting up Supabase database
- Creating migration files
- Writing TypeScript types for database entities
- Building API routes that query database
- Implementing RLS policies
- Optimizing database queries

---

### Section 3: Stats & Visualization
**File:** `03_stats_visualization.md`

**Contains:**
- Profile stats specifications
- Leaderboard table requirements
- Interactive chart specifications (Recharts)
- Data visualization requirements
- Query examples for stats
- Responsive design for charts
- Color schemes

**Use when:**
- Building leaderboard page
- Creating profile stats display
- Implementing Recharts visualizations
- Designing stats dashboard
- Building comparison tools
- Writing aggregation queries

---

### Section 4: Authentication & Security
**File:** `04_authentication_security.md`

**Contains:**
- Supabase Auth setup
- Login/signup flows
- Password requirements (minimal for friends)
- Session management
- JWT token handling
- Route protection with middleware
- RLS policies
- Admin role implementation
- Security best practices

**Use when:**
- Setting up authentication system
- Building login/signup pages
- Protecting routes
- Implementing middleware
- Adding admin functionality
- Securing API endpoints
- Managing sessions

---

### Section 5: API Endpoints
**File:** `05_api_endpoints.md`

**Contains:**
- All internal API routes (Next.js)
- Request/response formats
- Validation requirements
- External F1 API integration (Jolpica)
- Cron job specifications
- Rate limiting
- Error handling
- Caching strategies

**Use when:**
- Building Next.js API routes
- Integrating F1 data from Jolpica API
- Setting up Vercel Cron jobs
- Creating admin endpoints
- Implementing automated results fetching
- Adding error handling and retries
- Building prediction submission endpoints

---

### Section 6: Component Specifications
**File:** `06_components.md`

**Contains:**
- React component specifications
- Drag & drop implementation (@dnd-kit)
- Form components with validation
- Chart components (Recharts)
- Layout specifications
- Responsive design patterns
- Accessibility requirements
- shadcn/ui component usage

**Use when:**
- Building React components
- Implementing drag-and-drop
- Creating prediction forms
- Building leaderboard charts
- Designing responsive layouts
- Adding form validation (Zod)
- Implementing accessibility features

---

## 🎯 HOW TO USE WITH GOOGLE ANTIGRAVITY

### Step 1: Start Your Project

1. Open **Google Antigravity** (VS Code fork with Gemini)
2. Create new Next.js project
3. Open Gemini chat panel

### Step 2: Give Context

**Copy-paste Section 1 into Gemini:**
```
[Paste entire content of 01_project_overview_scoring.md]

I'm building this F1 prediction platform. Please acknowledge 
that you understand the project scope and scoring system.
```

Gemini will understand your entire project context.

### Step 3: Build Feature by Feature

**Example: Setting up Database**
```
[Paste 02_database_schema.md into Gemini]

Based on this schema, create the Supabase migration file 
for all tables with proper constraints and indexes.
```

**Example: Building Login Page**
```
[Paste relevant parts of 04_authentication_security.md]

Create app/(auth)/login/page.tsx with:
- React Hook Form
- Zod validation
- Supabase Auth integration
- Error handling
```

**Example: Creating Drag & Drop**
```
[Paste DriverDragDrop section from 06_components.md]

Implement components/predictions/DriverDragDrop.tsx using:
- @dnd-kit/sortable
- All 20 drivers available
- Top 10 predicted positions
- Prevent duplicates
```

### Step 4: Combine Sections When Needed

**Example: Building Complete Prediction Page**
```
Context from these sections:
[Paste scoring rules from Section 1]
[Paste database schema for predictions from Section 2]
[Paste component spec from Section 6]

Now create the complete race prediction page that:
- Uses DriverDragDrop component
- Calculates points in real-time
- Saves to Supabase
- Auto-saves every 30 seconds
```

---

## 📋 RECOMMENDED BUILD ORDER

### Week 1: Foundation

**Day 1: Setup**
- [ ] Initialize Next.js project
- [ ] Install dependencies
- [ ] Set up Supabase
- [ ] Create database (use Section 2)
- [ ] Configure environment variables

**Day 2-3: Authentication**
- [ ] Use Section 4 for auth context
- [ ] Build login page
- [ ] Build signup page
- [ ] Implement middleware
- [ ] Test auth flow

**Day 4: Landing & Dashboard**
- [ ] Create landing page
- [ ] Build dashboard layout
- [ ] Add navigation

### Week 2: Core Features

**Day 5-7: Race Predictions**
- [ ] Use Section 1 for scoring logic
- [ ] Use Section 6 for components
- [ ] Build DriverDragDrop
- [ ] Build ConstructorDragDrop
- [ ] Build BonusPredictions
- [ ] Create race prediction page
- [ ] Use Section 5 for API routes
- [ ] Test full flow

**Day 8-9: Season Predictions**
- [ ] Similar to race but all 20 drivers
- [ ] Add locking logic
- [ ] Test

### Week 3: Display & Stats

**Day 10-11: Leaderboard**
- [ ] Use Section 3 for specs
- [ ] Build leaderboard table
- [ ] Add Recharts line chart
- [ ] Use Section 5 for API route
- [ ] Test chart interactions

**Day 12-13: Profile**
- [ ] Use Section 3 for stats
- [ ] Use Section 6 for layout
- [ ] Implement team theming
- [ ] Add donut chart
- [ ] Test theme switching

### Week 4: Admin & Deploy

**Day 14-15: Admin Panel**
- [ ] Use Section 5 for endpoints
- [ ] Build race management
- [ ] Build results entry
- [ ] Integrate Jolpica API
- [ ] Test points calculation

**Day 16-17: Automation**
- [ ] Use Section 5 for cron job
- [ ] Set up Vercel Cron
- [ ] Test automated fetching

**Day 18-21: Testing & Deploy**
- [ ] Test all features
- [ ] Fix bugs
- [ ] Mobile testing
- [ ] Deploy to Vercel

---

## 🤖 EXAMPLE GEMINI PROMPTS

### For Each Feature

**Authentication:**
```
Use Section 4 (Authentication & Security):
[paste content]

Create the complete Supabase Auth setup:
1. lib/supabase/client.ts
2. lib/supabase/server.ts
3. middleware.ts
4. app/(auth)/login/page.tsx
5. app/(auth)/signup/page.tsx

Follow the exact specifications in the document.
```

**Drag & Drop:**
```
Use Section 6 (Components):
[paste DriverDragDrop spec]

And Section 1 (Scoring):
[paste driver prediction scoring]

Create components/predictions/DriverDragDrop.tsx that:
- Uses @dnd-kit/sortable
- Shows points next to each position
- Prevents duplicates
- Is mobile-friendly
```

**API Routes:**
```
Use Section 5 (API Endpoints):
[paste predictions endpoint spec]

And Section 2 (Database):
[paste predictions table schema]

Create app/api/predictions/race/route.ts with:
- POST endpoint for saving predictions
- GET endpoint for fetching user's prediction
- Full validation
- Error handling
```

**Charts:**
```
Use Section 3 (Stats & Visualization):
[paste line chart spec]

Create components/leaderboard/PointsProgressionChart.tsx with:
- Recharts LineChart
- Multiple user lines
- Toggle users on/off
- Hover tooltips
- Responsive design
```

---

## 💡 TIPS FOR USING WITH GEMINI

### 1. Provide Context First
Always paste the relevant section **before** asking Gemini to generate code.

### 2. Be Specific
Combine specs from multiple sections when needed:
- Section 1 (what) + Section 6 (how) = complete component
- Section 2 (data) + Section 5 (API) = complete endpoint

### 3. Iterate
Start with basic implementation, then refine:
```
"Now add TypeScript types"
"Add error handling"
"Make it responsive"
"Add loading states"
```

### 4. Reference Files
Use @ to reference files in Antigravity:
```
"Update @DriverDragDrop.tsx to prevent duplicates"
```

### 5. Ask for Explanations
```
"Explain how this drag and drop code works"
"Why did you structure it this way?"
```

### 6. Request Reviews
```
"Review this component for performance issues"
"Check if this follows the spec from Section 6"
```

---

## ✅ QUICK CHECKLIST

Before starting, have:
- [ ] All 6 section files ready
- [ ] Google Antigravity installed and open
- [ ] Supabase account created
- [ ] Vercel account ready
- [ ] Project initialized (Next.js)

During development:
- [ ] Paste relevant section before each feature
- [ ] Follow the build order
- [ ] Test each feature before moving on
- [ ] Commit progress regularly

---

## 🚨 COMMON PATTERNS

### Pattern 1: Building a New Page
1. Paste Section 1 (context) + Section 6 (component spec)
2. Ask Gemini to create the page
3. Paste Section 5 (API spec) for data fetching
4. Add API route
5. Connect page to API

### Pattern 2: Adding a Feature
1. Find relevant section(s)
2. Paste into Gemini
3. Ask for implementation
4. Test
5. Iterate with refinements

### Pattern 3: Fixing Bugs
1. Describe error to Gemini
2. Reference the section with correct spec
3. Ask Gemini to fix based on spec
4. Apply fix

---

## 📞 GETTING HELP FROM GEMINI

**If stuck:**
```
"I'm trying to implement [feature]. 
Here's the spec from Section X:
[paste spec]

Here's my current code:
[paste code]

Here's the error:
[paste error]

What's wrong and how do I fix it?"
```

**If confused:**
```
"I need to build [feature] but I'm not sure where to start.
Here are the relevant specs:
[paste from sections]

Give me a step-by-step plan."
```

**If refactoring:**
```
"Review this code:
[paste code]

Based on the spec in Section X:
[paste spec]

Suggest improvements."
```

---

You now have a complete, organized reference system for building your F1 prediction platform with Google Antigravity and Gemini AI! 🏎️💨
