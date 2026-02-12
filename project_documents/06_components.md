# F1 PREDICTIONS - SECTION 6: COMPONENT SPECIFICATIONS

## Copy-paste this when building React components with Gemini

---

## DRAG & DROP COMPONENTS

### DriverDragDrop Component

**File:** `components/predictions/DriverDragDrop.tsx`

**Purpose:** Allow users to drag and drop drivers into top 10 predicted positions

**Props:**

```typescript
interface DriverDragDropProps {
  drivers: Driver[]; // All 20 drivers
  selected: string[]; // Currently selected top 10 (in order)
  onChange: (selected: string[]) => void;
  disabled?: boolean; // Lock when deadline passed
  showPoints?: boolean; // Display point values
}

interface Driver {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  number: number;
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│ YOUR TOP 10 PREDICTION              │
├─────────────────────────────────────┤
│ P1  ≡ Max Verstappen    25 pts     │
│ P2  ≡ Charles Leclerc   18 pts     │
│ P3  ≡ Lando Norris      15 pts     │
│ ...                                  │
│ P10 ≡ Lance Stroll       1 pt      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ REMAINING DRIVERS (2 pts each)      │
├─────────────────────────────────────┤
│ ≡ Yuki Tsunoda    ≡ Pierre Gasly   │
│ ≡ Nico Hulkenberg ≡ Alex Albon     │
│ ...                                  │
└─────────────────────────────────────┘
```

**Behavior:**

- Drag driver from pool to position
- Drag driver from position back to pool
- Reorder within top 10 by dragging
- Prevent duplicate selections (highlight if attempted)
- Show team colors on driver cards
- Mobile: touch-friendly dragging

**Libraries:**

- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

**Implementation hints:**

```typescript
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";

// Two SortableContexts: one for top 10, one for remaining pool
// Track selected drivers in state
// Prevent adding duplicate drivers
```

---

### ConstructorDragDrop Component

**File:** `components/predictions/ConstructorDragDrop.tsx`

**Purpose:** Drag and drop constructors into top 5 predicted positions

**Props:**

```typescript
interface ConstructorDragDropProps {
  constructors: Constructor[]; // All 10 teams
  selected: string[]; // Currently selected top 5
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  showPoints?: boolean;
}

interface Constructor {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
}
```

**Similar to DriverDragDrop but:**

- Top 5 instead of top 10
- Points: 25, 18, 15, 12, 10
- Show team logos
- Use team colors for cards

---

## BONUS PREDICTIONS COMPONENT

### BonusPredictions Component

**File:** `components/predictions/BonusPredictions.tsx`

**Props:**

```typescript
interface BonusPredictionsProps {
  drivers: Driver[];
  values: {
    pole_position: string;
    fastest_lap: string;
    first_retirement: string;
    safety_car: boolean;
    red_flag: boolean;
  };
  onChange: (values: BonusPredictionsValues) => void;
  disabled?: boolean;
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│ BONUS PREDICTIONS                   │
├─────────────────────────────────────┤
│                                     │
│ 🏁 Pole Position (10 pts)          │
│ [Max Verstappen ▼]                 │
│                                     │
│ ⚡ Fastest Lap (10 pts)             │
│ [Charles Leclerc ▼]                │
│                                     │
│ ❌ First Retirement (10 pts)        │
│ [Logan Sargeant ▼]                 │
│ • No retirements                    │
│                                     │
│ 🚗 Safety Car (5 pts)               │
│ NO ●━━━━━━○ YES                    │
│                                     │
│ 🚨 Red Flag (1pt No / 5pts Yes)    │
│ NO ○━━━━━━● YES                    │
│                                     │
└─────────────────────────────────────┘
```

**Components:**

- shadcn/ui Select for dropdowns
- shadcn/ui Switch for toggles (styled as sliders)

**Validation:**

- All dropdowns must have selection
- Retirement dropdown includes "No retirements" option

---

## PREDICTION FORM PAGES

### RacePredictionPage Component

**File:** `app/(Home)/predictions/race/[raceId]/page.tsx`

**Structure:**

```typescript
'use client'

export default function RacePredictionPage({ params }: { params: { raceId: string } }) {
  // Fetch race details
  // Fetch user's existing prediction (if any)
  // Handle form state
  // Auto-save every 30 seconds
  // Submit final prediction

  return (
    <>
      <RaceHeader race={race} />
      <PredictionProgress percentage={completionPercentage} />

      <section>
        <h2>Top 10 Drivers (152 pts max)</h2>
        <DriverDragDrop {...driverProps} />
      </section>

      <section>
        <h2>Top 5 Constructors (70 pts max)</h2>
        <ConstructorDragDrop {...constructorProps} />
      </section>

      <section>
        <h2>Bonus Predictions (41 pts max)</h2>
        <BonusPredictions {...bonusProps} />
      </section>

      <PredictionSummary
        potentialPoints={calculatePotentialPoints(formState)}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        disabled={isPastDeadline}
      />
    </>
  )
}
```

**Features:**

- Auto-save draft every 30 seconds (debounced)
- Show countdown to deadline
- Lock form when deadline passed
- Calculate and display potential points
- Progress indicator (% complete)
- Toast notifications for save/submit
- Validation before submit

---

### SeasonPredictionPage Component

**File:** `app/(Home)/predictions/season/page.tsx`

**Similar to race page but:**

- Drag all 20 drivers (not just top 10)
- Drag all 10 constructors (not just top 5)
- 10x points multiplier (250, 180, 150...)
- Additional dropdowns for most poles/fastest laps
- Warning banner: "Locks after Round 1"
- Disable editing if Round 1 started
- Show total potential: 2,800 points

---

## LEADERBOARD COMPONENTS

### LeaderboardTable Component

**File:** `components/leaderboard/LeaderboardTable.tsx`

**Props:**

```typescript
interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId: string;
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
}

interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string;
  total_points: number;
  rank: number;
  rank_change: number; // +/- from last race
  avg_points_per_race: number;
  last_race_points: number;
}
```

**Features:**

- Sortable columns (click header)
- Medal icons for top 3 (🥇🥈🥉)
- Highlight current user row
- Rank change indicators (↑2, ↓1)
- Responsive: scroll horizontally on mobile
- shadcn/ui Table component

---

### PointsProgressionChart Component

**File:** `components/leaderboard/PointsProgressionChart.tsx`

**Props:**

```typescript
interface PointsProgressionChartProps {
  data: ChartData;
  visibleUsers: string[]; // User IDs to show
  onToggleUser: (userId: string) => void;
}

interface ChartData {
  races: RaceInfo[];
  users: UserPointsData[];
}

interface UserPointsData {
  user_id: string;
  username: string;
  color: string;
  points_by_race: {
    round: number;
    points: number;
    cumulative: number;
  }[];
}
```

**Implementation:**

- Recharts LineChart
- One line per user
- Toggle users via checkboxes in legend
- Hover tooltips with details
- Responsive: reduce legend on mobile
- Colors: distinct for each user

---

## PROFILE COMPONENTS

### ProfileHeader Component

**File:** `components/profile/ProfileHeader.tsx`

**Layout:**

```
┌───────────────────────────────────────────┐
│ [Avatar] @username                        │
│          Display Name                     │
│          Member since: Jan 2026           │
│          #4 Overall • 987 points          │
│                                           │
│ [Edit Profile] [Change Theme]             │
└───────────────────────────────────────────┘
```

---

### TeamTheme Component

**File:** `components/profile/TeamTheme.tsx`

**Purpose:** Apply team colors dynamically via CSS variables

**Props:**

```typescript
interface TeamThemeProps {
  teamId: string;
  driverId: string;
}
```

**Implementation:**

```typescript
useEffect(() => {
  const teamColors = getTeamColors(teamId);
  document.documentElement.style.setProperty(
    "--team-primary",
    teamColors.primary,
  );
  document.documentElement.style.setProperty(
    "--team-secondary",
    teamColors.secondary,
  );
}, [teamId]);
```

**Split Layout:**

```
┌──────────────────┬───────────────────┐
│ CONSTRUCTOR      │ DRIVER            │
│                  │                   │
│ [Team Logo]      │ [Driver Photo]    │
│ ████████ Color   │ #1 • 2x WDC      │
│ P1 • 151 pts     │ P1 • 87 pts      │
│ Wins: 1          │ Poles: 1         │
│                  │                   │
│ Your picks:      │ Your accuracy:    │
│ Constructor: ✓   │ Exact pos: 1/1   │
└──────────────────┴───────────────────┘
```

---

### StatsDonutChart Component

**File:** `components/profile/StatsDonutChart.tsx`

**Purpose:** Show points breakdown by category

**Props:**

```typescript
interface StatsDonutChartProps {
  breakdown: {
    driver_positions: number;
    constructors: number;
    pole_position: number;
    fastest_lap: number;
    other_bonuses: number;
  };
}
```

**Implementation:**

- Recharts PieChart with innerRadius (donut)
- Legend with percentages
- Hover shows exact points
- Responsive: smaller on mobile

---

## ADMIN COMPONENTS

### RaceManagement Component

**File:** `components/admin/RaceManagement.tsx`

**Features:**

- Table of all races
- Add race form (modal)
- Edit race (inline or modal)
- Delete race (confirmation dialog)
- Lock/unlock predictions button
- Mark as completed button

---

### ResultsEntry Component

**File:** `components/admin/ResultsEntry.tsx`

**Features:**

- Race selector dropdown
- "Fetch from API" button
- Manual entry form (fallback)
- Preview results before saving
- Calculate points button

**Layout:**

```
┌─────────────────────────────────────┐
│ Select Race: [Bahrain GP ▼]        │
│                                     │
│ [📥 Fetch from Jolpica API]        │
│                                     │
│ ──── OR MANUAL ENTRY ────          │
│                                     │
│ P1: [Verstappen ▼]                 │
│ P2: [Leclerc ▼]                    │
│ ...                                 │
│                                     │
│ [💾 Save Results]                  │
│ [🧮 Calculate Points]              │
└─────────────────────────────────────┘
```

---

## SHARED COMPONENTS

### RaceCountdown Component

**File:** `components/shared/RaceCountdown.tsx`

**Purpose:** Display countdown to next race deadline

**Props:**

```typescript
interface RaceCountdownProps {
  deadline: Date;
}
```

**Display:**

```
⏱️ Predictions lock in: 4d 23h 15m
```

**Update every second using setInterval**

---

### PredictionSummary Component

**File:** `components/shared/PredictionSummary.tsx`

**Purpose:** Show potential points and submission buttons

**Layout:**

```
┌─────────────────────────────────────┐
│ POTENTIAL POINTS                    │
│                                     │
│ • Top 10: 152 pts                  │
│ • Constructors: 70 pts             │
│ • Bonuses: 41 pts                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ TOTAL: 263 points                  │
│                                     │
│ Last saved: 2 minutes ago           │
│                                     │
│ [Save Draft] [Submit Prediction]    │
└─────────────────────────────────────┘
```

---

## FORM VALIDATION

### Zod Schemas

**Race Prediction:**

```typescript
import { z } from "zod";

const racePredictionSchema = z.object({
  race_id: z.number(),
  // Top 10 drivers
  drivers: z
    .array(z.string())
    .length(10)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "No duplicate drivers allowed",
    }),
  // Top 5 constructors
  constructors: z
    .array(z.string())
    .length(5)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "No duplicate constructors allowed",
    }),
  // Bonuses
  pole_position: z.string().min(1),
  fastest_lap: z.string().min(1),
  first_retirement: z.string().min(1),
  safety_car: z.boolean(),
  red_flag: z.boolean(),
});
```

**Season Prediction:**

```typescript
const seasonPredictionSchema = z.object({
  season: z.number(),
  drivers: z
    .array(z.string())
    .length(20)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "All 20 drivers must be unique",
    }),
  constructors: z
    .array(z.string())
    .length(10)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "All 10 constructors must be unique",
    }),
  most_poles: z.string().min(1),
  most_fastest_laps: z.string().min(1),
});
```

---

## RESPONSIVE DESIGN

**Breakpoints (Tailwind):**

- Mobile: default (< 640px)
- Tablet: sm (640px+)
- Desktop: md (768px+)
- Large: lg (1024px+)

**Key Responsive Patterns:**

**Drag & Drop:**

- Desktop: Side-by-side (selected | pool)
- Mobile: Stack vertically

**Leaderboard:**

- Desktop: Full table
- Mobile: Cards (each user = card)

**Profile:**

- Desktop: Split (constructor | driver)
- Mobile: Stack vertically

**Charts:**

- Desktop: Full width with legend
- Mobile: Reduce legend, smaller chart

---

## LOADING & ERROR STATES

**Loading Skeletons:**

```typescript
// Use shadcn/ui Skeleton component
<Skeleton className="h-12 w-full" />
```

**Error Boundaries:**

```typescript
// Wrap components in error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <PredictionForm />
</ErrorBoundary>
```

**Toast Notifications:**

```typescript
// Use shadcn/ui Toast
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

toast({
  title: "Prediction saved!",
  description: "Your draft has been saved successfully.",
});
```

---

## ACCESSIBILITY

**Requirements:**

- All interactive elements keyboard accessible
- ARIA labels on drag handles
- Focus indicators visible
- Color contrast meets WCAG AA
- Screen reader friendly

**Example:**

```typescript
<button
  aria-label="Drag driver to position 1"
  {...attributes}
  {...listeners}
>
  ≡ {driver.name}
</button>
```

---

## Use this for:

1. Building React components
2. Implementing drag & drop
3. Creating forms with validation
4. Designing responsive layouts
5. Adding loading states
6. Implementing accessibility
7. Using shadcn/ui components
8. Structuring component props
