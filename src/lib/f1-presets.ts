export interface ColorPair {
  primary: string
  secondary: string
}
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
    colors: { primary: "#0C1080", secondary: "#DC0808" },
  },
  ferrari: {
    name: "Scuderia Ferrari",
    colors: { primary: "#E8002D", secondary: "#FFF200" },
  },
  mercedes: {
    name: "Mercedes-AMG",
    colors: { primary: "#C0C0C0", secondary: "#00A19C" },
  },
  mclaren: {
    name: "McLaren",
    colors: { primary: "#FF8700", secondary: "#383838" },
  },
  astonmartin: {
    name: "Aston Martin",
    colors: { primary: "#00665F", secondary: "#C0FF00" },
  },
  alpine: {
    name: "Alpine",
    colors: { primary: "#0090FF", secondary: "#FF6984" },
  },
  williams: {
    name: "Williams",
    colors: { primary: "#041E42", secondary: "#00A0DE" },
  },
  haas: {
    name: "Haas F1 Team",
    colors: { primary: "#E60028", secondary: "#FFFFFF" },
  },
  audi: {
    name: "Audi",
    colors: { primary: "#E31E24", secondary: "#A8A9AD" },
  },
  rb: {
    name: "Racing Bulls",
    colors: { primary: "#1E41FF", secondary: "#FFFFFF" },
  },
  cadillac: {
    name: "Cadillac",
    colors: { primary: "#C41E3A", secondary: "#C8A052" },
  },
}

// ── Drivers ───────────────────────────────────────────────────────
export const DRIVERS: Record<string, DriverPreset> = {
  // Red Bull Racing
  verstappen: {
    name: "Max Verstappen",
    team: "redbull",
    number: 3,
    colors: { primary: "#FF6800", secondary: "#1E41FF" },
  },
  hadjar: {
    name: "Isack Hadjar",
    team: "redbull",
    number: 6,
    colors: { primary: "#0055A2", secondary: "#E14135" },
  },
  // Ferrari
  leclerc: {
    name: "Charles Leclerc",
    team: "ferrari",
    number: 16,
    colors: { primary: "#FF0000", secondary: "#FFFFFF" },
  },
  hamilton: {
    name: "Lewis Hamilton",
    team: "ferrari",
    number: 44,
    colors: { primary: "#E2FD5C", secondary: "#8E0089" },
  },
  // McLaren
  norris: {
    name: "Lando Norris",
    team: "mclaren",
    number: 1,
    colors: { primary: "#FFD700", secondary: "#FF4F00" },
  },
  piastri: {
    name: "Oscar Piastri",
    team: "mclaren",
    number: 81,
    colors: { primary: "#FFD700", secondary: "#FF8700" },
  },
  // Mercedes
  russell: {
    name: "George Russell",
    team: "mercedes",
    number: 63,
    colors: { primary: "#00E399", secondary: "#FFFFFF" },
  },
  antonelli: {
    name: "Andrea Kimi Antonelli",
    team: "mercedes",
    number: 12,
    colors: { primary: "#00FFF7", secondary: "#0077B6" },
  },
  // Aston Martin
  alonso: {
    name: "Fernando Alonso",
    team: "astonmartin",
    number: 14,
    colors: { primary: "#A0988F", secondary: "#FFFF00" },
  },
  stroll: {
    name: "Lance Stroll",
    team: "astonmartin",
    number: 18,
    colors: { primary: "#F0F0F0", secondary: "#FF0000" },
  },
  // Alpine
  gasly: {
    name: "Pierre Gasly",
    team: "alpine",
    number: 10,
    colors: { primary: "#FFFFFF", secondary: "#04AFF7" },
  },
  colapinto: {
    name: "Franco Colapinto",
    team: "alpine",
    number: 43,
    colors: { primary: "#041E42", secondary: "#FF0000" },
  },
  // Williams
  albon: {
    name: "Alexander Albon",
    team: "williams",
    number: 23,
    colors: { primary: "#00BFFF", secondary: "#00L8FF" },
  },
  sainz: {
    name: "Carlos Sainz",
    team: "williams",
    number: 55,
    colors: { primary: "#DA0000", secondary: "#FFD700" },
  },
  // Racing Bulls
  lawson: {
    name: "Liam Lawson",
    team: "rb",
    number: 30,
    colors: { primary: "#000000", secondary: "#C0C0C0" },
  },
  lindblad: {
    name: "Arvid Lindblad",
    team: "rb",
    number: 41,
    colors: { primary: "#FFD700", secondary: "#0066AA" },
  },
  // Audi
  hulkenberg: {
    name: "Nico Hülkenberg",
    team: "audi",
    number: 27,
    colors: { primary: "#00FF00", secondary: "#000000" },
  },
  bortoleto: {
    name: "Gabriel Bortoleto",
    team: "audi",
    number: 5,
    colors: { primary: "#FFD700", secondary: "#009C3B" },
  },
  // Haas
  ocon: {
    name: "Esteban Ocon",
    team: "haas",
    number: 31,
    colors: { primary: "#8B0000", secondary: "#404040" },
  },
  bearman: {
    name: "Oliver Bearman",
    team: "haas",
    number: 87,
    colors: { primary: "#002F87", secondary: "#CF142B" },
  },
  // Cadillac
  perez: {
    name: "Sergio Pérez",
    team: "cadillac",
    number: 11,
    colors: { primary: "#006847", secondary: "#FFFFFF" },
  },
  bottas: {
    name: "Valtteri Bottas",
    team: "cadillac",
    number: 77,
    colors: { primary: "#003DA5", secondary: "#FFFFFF" },
  },
}
// ── Races ─────────────────────────────────────────────────────────
export interface RaceEvent {
  id: string
  name: string
  round: number
  date: string // ISO date string
  time: string // Local time or UTC
  circuit: string
  country: string
  flag: string
  countryCode: string
  colors: ColorPair
  trackImage: string
  laps: number
}

export const RACES: RaceEvent[] = [
  {
    id: "bahrain",
    name: "Bahrain Grand Prix",
    round: 1,
    date: "2026-03-02",
    time: "16:00 GMT+1",
    circuit: "Bahrain International Circuit",
    country: "Bahrain",
    flag: "🇧🇭",
    countryCode: "BH",
    colors: { primary: "#E31E24", secondary: "#FFFFFF" },
    trackImage: "bahrain.avif",
    laps: 57,
  },
  {
    id: "jeddah",
    name: "Saudi Arabian Grand Prix",
    round: 2,
    date: "2026-03-09",
    time: "18:00 GMT+1",
    circuit: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    countryCode: "SA",
    colors: { primary: "#006C35", secondary: "#C8A052" }, // Green + Gold
    trackImage: "jeddah.avif",
    laps: 50,
  },
  {
    id: "melbourne",
    name: "Australian Grand Prix",
    round: 3,
    date: "2026-03-23",
    time: "05:00 GMT+1",
    circuit: "Albert Park Circuit",
    country: "Australia",
    flag: "🇦🇺",
    countryCode: "AU",
    colors: { primary: "#00008B", secondary: "#E31E24" }, // Navy + Red
    trackImage: "melbourne.avif",
    laps: 58,
  },
  {
    id: "suzuka",
    name: "Japanese Grand Prix",
    round: 4,
    date: "2026-04-06",
    time: "06:00 GMT+1",
    circuit: "Suzuka International Racing Course",
    country: "Japan",
    flag: "🇯🇵",
    countryCode: "JP",
    colors: { primary: "#BC002D", secondary: "#FFFFFF" },
    trackImage: "suzuka.avif",
    laps: 53,
  },
  {
    id: "shanghai",
    name: "Chinese Grand Prix",
    round: 5,
    date: "2026-04-20",
    time: "08:00 GMT+1",
    circuit: "Shanghai International Circuit",
    country: "China",
    flag: "🇨🇳",
    countryCode: "CN",
    colors: { primary: "#DE2910", secondary: "#FFDE00" },
    trackImage: "shanghai.avif",
    laps: 56,
  },
  {
    id: "miami",
    name: "Miami Grand Prix",
    round: 6,
    date: "2026-05-04",
    time: "21:00 GMT+1",
    circuit: "Miami International Autodrome",
    country: "USA",
    flag: "🇺🇸",
    countryCode: "US",
    colors: { primary: "#00A3E0", secondary: "#F47920" }, // Dolphins Aqua + Orange
    trackImage: "miami.avif",
    laps: 57,
  },
  {
    id: "imola", // Mapping to existing assets if possible, else generic
    name: "Emilia Romagna Grand Prix",
    round: 7,
    date: "2026-05-18",
    time: "14:00 GMT+1",
    circuit: "Autodromo Enzo e Dino Ferrari",
    country: "Italy",
    flag: "🇮🇹",
    countryCode: "IT",
    colors: { primary: "#009246", secondary: "#CE2B37" }, // Italian Flag
    trackImage: "monza.avif", // Fallback if Imola not separately designated or reuse Monza style
    laps: 63,
  },
  {
    id: "monaco",
    name: "Monaco Grand Prix",
    round: 8,
    date: "2026-05-25",
    time: "14:00 GMT+1",
    circuit: "Circuit de Monaco",
    country: "Monaco",
    flag: "🇲🇨",
    countryCode: "MC",
    colors: { primary: "#CE1126", secondary: "#FFFFFF" },
    trackImage: "monaco.avif",
    laps: 78,
  },
  {
    id: "montreal",
    name: "Canadian Grand Prix",
    round: 9,
    date: "2026-06-08",
    time: "19:00 GMT+1",
    circuit: "Circuit Gilles-Villeneuve",
    country: "Canada",
    flag: "🇨🇦",
    countryCode: "CA",
    colors: { primary: "#FF0000", secondary: "#FFFFFF" },
    trackImage: "montreal.avif",
    laps: 70,
  },
  {
    id: "barcelona",
    name: "Spanish Grand Prix",
    round: 10,
    date: "2026-06-22",
    time: "14:00 GMT+1",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    flag: "🇪🇸",
    countryCode: "ES",
    colors: { primary: "#AA151B", secondary: "#F1BF00" },
    trackImage: "barcelona.avif",
    laps: 66,
  },
  {
    id: "spielberg",
    name: "Austrian Grand Prix",
    round: 11,
    date: "2026-07-06",
    time: "14:00 GMT+1",
    circuit: "Red Bull Ring",
    country: "Austria",
    flag: "🇦🇹",
    countryCode: "AT",
    colors: { primary: "#EF3340", secondary: "#FFFFFF" },
    trackImage: "spielberg.avif",
    laps: 71,
  },
  {
    id: "silverstone",
    name: "British Grand Prix",
    round: 12,
    date: "2026-07-20",
    time: "15:00 GMT+1",
    circuit: "Silverstone Circuit",
    country: "UK",
    flag: "🇬🇧",
    countryCode: "GB",
    colors: { primary: "#012169", secondary: "#C8102E" },
    trackImage: "silverstone.avif",
    laps: 52,
  },
  {
    id: "hungaroring",
    name: "Hungarian Grand Prix",
    round: 13,
    date: "2026-08-03",
    time: "14:00 GMT+1",
    circuit: "Hungaroring",
    country: "Hungary",
    flag: "🇭🇺",
    countryCode: "HU",
    colors: { primary: "#436F4D", secondary: "#CD2A3E" },
    trackImage: "hungaroring.avif",
    laps: 70,
  },
  {
    id: "spa",
    name: "Belgian Grand Prix",
    round: 14,
    date: "2026-08-31",
    time: "14:00 GMT+1",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    flag: "🇧🇪",
    countryCode: "BE",
    colors: { primary: "#FFCD00", secondary: "#000000" }, // Black/Yellow/Red
    trackImage: "spa.avif",
    laps: 44,
  },
  {
    id: "zandvoort",
    name: "Dutch Grand Prix",
    round: 15,
    date: "2026-09-07",
    time: "14:00 GMT+1",
    circuit: "Circuit Zandvoort",
    country: "Netherlands",
    flag: "🇳🇱",
    countryCode: "NL",
    colors: { primary: "#AE1C28", secondary: "#21468B" },
    trackImage: "zandvoort.avif",
    laps: 72,
  },
  {
    id: "monza",
    name: "Italian Grand Prix",
    round: 16,
    date: "2026-09-21",
    time: "14:00 GMT+1",
    circuit: "Autodromo Nazionale Monza",
    country: "Italy",
    flag: "🇮🇹",
    countryCode: "IT",
    colors: { primary: "#009246", secondary: "#CE2B37" },
    trackImage: "monza.avif",
    laps: 53,
  },
  {
    id: "baku",
    name: "Azerbaijan Grand Prix",
    round: 17,
    date: "2026-10-05",
    time: "12:00 GMT+1",
    circuit: "Baku City Circuit",
    country: "Azerbaijan",
    flag: "🇦🇿",
    countryCode: "AZ",
    colors: { primary: "#00B5E2", secondary: "#509E2F" },
    trackImage: "baku.avif",
    laps: 51,
  },
  {
    id: "singapore",
    name: "Singapore Grand Prix",
    round: 18,
    date: "2026-10-19",
    time: "13:00 GMT+1",
    circuit: "Marina Bay Street Circuit",
    country: "Singapore",
    flag: "🇸🇬",
    countryCode: "SG",
    colors: { primary: "#EF3340", secondary: "#FFFFFF" },
    trackImage: "singapore.avif",
    laps: 62,
  },
  {
    id: "austin",
    name: "United States Grand Prix",
    round: 19,
    date: "2026-11-02",
    time: "20:00 GMT+1",
    circuit: "Circuit of the Americas",
    country: "USA",
    flag: "🇺🇸",
    countryCode: "US",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    trackImage: "austin.avif",
    laps: 56,
  },
  {
    id: "mexico",
    name: "Mexico City Grand Prix",
    round: 20,
    date: "2026-11-09",
    time: "21:00 GMT+1",
    circuit: "Autódromo Hermanos Rodríguez",
    country: "Mexico",
    flag: "🇲🇽",
    countryCode: "MX",
    colors: { primary: "#006847", secondary: "#CE1126" },
    trackImage: "mexico.avif",
    laps: 71,
  },
  {
    id: "interlagos",
    name: "São Paulo Grand Prix",
    round: 21,
    date: "2026-11-23",
    time: "18:00 GMT+1",
    circuit: "Autódromo de Interlagos",
    country: "Brazil",
    flag: "🇧🇷",
    countryCode: "BR",
    colors: { primary: "#009C3B", secondary: "#FFDF00" },
    trackImage: "interlagos.avif",
    laps: 71,
  },
  {
    id: "vegas",
    name: "Las Vegas Grand Prix",
    round: 22,
    date: "2026-11-30",
    time: "07:00 GMT+1",
    circuit: "Las Vegas Strip Circuit",
    country: "USA",
    flag: "🇺🇸",
    countryCode: "US",
    colors: { primary: "#C0C0C0", secondary: "#FFD700" }, // Silver & Gold for Vegas
    trackImage: "vegas.avif",
    laps: 50,
  },
  {
    id: "lusail",
    name: "Qatar Grand Prix",
    round: 23,
    date: "2026-12-07",
    time: "16:00 GMT+1",
    circuit: "Lusail International Circuit",
    country: "Qatar",
    flag: "🇶🇦",
    countryCode: "QA",
    colors: { primary: "#8D1B3D", secondary: "#FFFFFF" },
    trackImage: "lusail.avif",
    laps: 57,
  },
  {
    id: "abudhabi",
    name: "Abu Dhabi Grand Prix",
    round: 24,
    date: "2026-12-14",
    time: "14:00 GMT+1",
    circuit: "Yas Marina Circuit",
    country: "UAE",
    flag: "🇦🇪",
    countryCode: "AE",
    colors: { primary: "#00732F", secondary: "#FF0000" },
    trackImage: "abudhabi.avif",
    laps: 58,
  },
]

