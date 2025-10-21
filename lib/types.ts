export interface GamemodeStats {
  tier: string
  points: number
}

export interface Player {
  id: string
  username: string
  overallPoints: number
  region: string
  gamemodes: {
    tank: GamemodeStats
    smp: GamemodeStats
    uhc: GamemodeStats
    nethpot: GamemodeStats
    crystal: GamemodeStats
  }
}

export type GamemodeKey = "tank" | "smp" | "uhc" | "nethpot" | "crystal"

export const GAMEMODE_COLORS: Record<GamemodeKey, string> = {
  tank: "bg-blue-600",
  smp: "bg-green-600",
  uhc: "bg-orange-600",
  nethpot: "bg-red-600",
  crystal: "bg-purple-600",
}

export const GAMEMODE_LABELS: Record<GamemodeKey, string> = {
  tank: "Tank",
  smp: "SMP",
  uhc: "UHC",
  nethpot: "Nethpot",
  crystal: "Crystal",
}

export const TIER_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  HT1: { bg: "bg-red-600/80", text: "text-red-300", gradient: "from-red-600 to-red-700" },
  LT1: { bg: "bg-orange-600/80", text: "text-orange-300", gradient: "from-orange-600 to-orange-700" },
  HT2: { bg: "bg-yellow-600/80", text: "text-yellow-300", gradient: "from-yellow-600 to-yellow-700" },
  LT2: { bg: "bg-lime-600/80", text: "text-lime-300", gradient: "from-lime-600 to-lime-700" },
  HT3: { bg: "bg-green-600/80", text: "text-green-300", gradient: "from-green-600 to-green-700" },
  LT3: { bg: "bg-cyan-600/80", text: "text-cyan-300", gradient: "from-cyan-600 to-cyan-700" },
  HT4: { bg: "bg-blue-600/80", text: "text-blue-300", gradient: "from-blue-600 to-blue-700" },
  LT4: { bg: "bg-indigo-600/80", text: "text-indigo-300", gradient: "from-indigo-600 to-indigo-700" },
  HT5: { bg: "bg-purple-600/80", text: "text-purple-300", gradient: "from-purple-600 to-purple-700" },
  LT5: { bg: "bg-pink-600/80", text: "text-pink-300", gradient: "from-pink-600 to-pink-700" },
  "N/A": { bg: "bg-gray-600/80", text: "text-gray-300", gradient: "from-gray-600 to-gray-700" },
}

export const TIER_ORDER = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5", "N/A"]
