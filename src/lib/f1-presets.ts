export interface ColorPair {
  primary: string
  secondary: string
}

/* ═══════════════════════════════════════════════════════════════════
   F1 Team & Driver color presets.
   Swap teamKey / driverKey in the page to instantly re-skin.
   ═══════════════════════════════════════════════════════════════════ */

export interface TeamPreset {
  name: string
  colors: ColorPair
}

export interface DriverPreset {
  name: string
  team: string
  number: number
  colors: ColorPair
}

// ── Teams ─────────────────────────────────────────────────────────
export const TEAMS: Record<string, TeamPreset> = {
  redbull: {
    name: "Red Bull Racing",
    colors: { primary: "#DC143C", secondary: "#1E3A5F" },
  },
  ferrari: {
    name: "Scuderia Ferrari",
    colors: { primary: "#A6051A", secondary: "#FFCC00" },
  },
  mercedes: {
    name: "Mercedes-AMG",
    colors: { primary: "#00D2BE", secondary: "#000000" },
  },
  mclaren: {
    name: "McLaren",
    colors: { primary: "#FF8700", secondary: "#47C7FC" },
  },
  astonmartin: {
    name: "Aston Martin",
    colors: { primary: "#006F62", secondary: "#CEDC00" },
  },
  alpine: {
    name: "Alpine",
    colors: { primary: "#0090FF", secondary: "#F363B7" },
  },
  williams: {
    name: "Williams",
    colors: { primary: "#005AFF", secondary: "#00A3E0" },
  },
  haas: {
    name: "Haas F1 Team",
    colors: { primary: "#B6BABD", secondary: "#E10600" },
  },
  sauber: {
    name: "Kick Sauber",
    colors: { primary: "#52E252", secondary: "#000000" },
  },
  rb: {
    name: "Racing Bulls",
    colors: { primary: "#6692FF", secondary: "#FFFFFF" },
  },
}

// ── Drivers ───────────────────────────────────────────────────────
export const DRIVERS: Record<string, DriverPreset> = {
  verstappen: {
    name: "Max Verstappen",
    team: "redbull",
    number: 1,
    colors: { primary: "#FF8C00", secondary: "#1E3A5F" },
  },
  perez: {
    name: "Sergio Perez",
    team: "redbull",
    number: 11,
    colors: { primary: "#DC143C", secondary: "#1E3A5F" },
  },
  leclerc: {
    name: "Charles Leclerc",
    team: "ferrari",
    number: 16,
    colors: { primary: "#A6051A", secondary: "#FFCC00" },
  },
  sainz: {
    name: "Carlos Sainz",
    team: "ferrari",
    number: 55,
    colors: { primary: "#A6051A", secondary: "#FF6600" },
  },
  hamilton: {
    name: "Lewis Hamilton",
    team: "ferrari",
    number: 44,
    colors: { primary: "#A6051A", secondary: "#9B59B6" },
  },
  russell: {
    name: "George Russell",
    team: "mercedes",
    number: 63,
    colors: { primary: "#00D2BE", secondary: "#FFFFFF" },
  },
  norris: {
    name: "Lando Norris",
    team: "mclaren",
    number: 4,
    colors: { primary: "#FF8700", secondary: "#47C7FC" },
  },
  piastri: {
    name: "Oscar Piastri",
    team: "mclaren",
    number: 81,
    colors: { primary: "#47C7FC", secondary: "#FF8700" },
  },
  alonso: {
    name: "Fernando Alonso",
    team: "astonmartin",
    number: 14,
    colors: { primary: "#006F62", secondary: "#0080FF" },
  },
  stroll: {
    name: "Lance Stroll",
    team: "astonmartin",
    number: 18,
    colors: { primary: "#006F62", secondary: "#CEDC00" },
  },
}
