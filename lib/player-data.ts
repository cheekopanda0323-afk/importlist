import type { Player } from "./types"

const TIER_POINTS: Record<string, number> = {
  LT5: 10,
  HT5: 20,
  LT4: 30,
  HT4: 40,
  LT3: 50,
  HT3: 60,
  LT2: 70,
  HT2: 80,
  LT1: 90,
  HT1: 100,
}

export const PLAYERS: Player[] = [
  {
    id: "player-1",
    username: "Xerxermot",
    region: "AS",
    overallPoints: TIER_POINTS["HT3"],
    gamemodes: {
      tank: { tier: "N/A", points: 0 },
      smp: { tier: "HT3", points: TIER_POINTS["HT3"] },
      uhc: { tier: "N/A", points: 0 },
      nethpot: { tier: "N/A", points: 0 },
      crystal: { tier: "N/A", points: 0 },
    },
  },
  {
    id: "player-2",
    username: "Whistlin",
    region: "AS",
    overallPoints: TIER_POINTS["HT3"] + TIER_POINTS["LT2"], // 60 + 70 = 130
    gamemodes: {
      tank: { tier: "N/A", points: 0 },
      smp: { tier: "HT3", points: TIER_POINTS["HT3"] },
      uhc: { tier: "N/A", points: 0 },
      nethpot: { tier: "LT2", points: TIER_POINTS["LT2"] },
      crystal: { tier: "N/A", points: 0 },
    },
  },
]

export function generateInitialPlayers(): Player[] {
  return PLAYERS.sort((a, b) => b.overallPoints - a.overallPoints)
}
