import type { Player } from "./types"

const FIRST_NAMES = [
  "Shadow",
  "Phoenix",
  "Dragon",
  "Titan",
  "Nexus",
  "Vortex",
  "Blaze",
  "Storm",
  "Apex",
  "Void",
  "Echo",
  "Cipher",
  "Rogue",
  "Specter",
  "Inferno",
  "Zenith",
  "Prism",
  "Quantum",
  "Velocity",
  "Obsidian",
  "Crimson",
  "Ethereal",
  "Phantom",
  "Sentinel",
  "Valor",
  "Nexus",
  "Abyss",
  "Tempest",
  "Radiant",
  "Nocturne",
]

const LAST_NAMES = [
  "Pro",
  "King",
  "Master",
  "Elite",
  "Slayer",
  "Hunter",
  "Warrior",
  "Knight",
  "Sage",
  "Mystic",
  "Raven",
  "Wolf",
  "Tiger",
  "Eagle",
  "Viper",
  "Reaper",
]

const REGIONS = ["NA", "EU", "ASIA", "SA", "AU"]
const TIERS = ["HT1", "HT2", "HT3", "HT4", "HT5", "LT1", "LT2", "LT3", "LT4", "LT5"]

function generateRandomPlayer(id: number): Player {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  const username = `${firstName}${lastName}${Math.floor(Math.random() * 100)}`

  const tankPoints = Math.floor(Math.random() * 1000) + 100
  const smpPoints = Math.floor(Math.random() * 1000) + 100
  const uhcPoints = Math.floor(Math.random() * 1000) + 100
  const nethpotPoints = Math.floor(Math.random() * 1000) + 100
  const crystalPoints = Math.floor(Math.random() * 1000) + 100

  return {
    id: `player-${id}`,
    username,
    overallPoints: tankPoints + smpPoints + uhcPoints + nethpotPoints + crystalPoints,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    gamemodes: {
      tank: { tier: TIERS[Math.floor(Math.random() * TIERS.length)], points: tankPoints },
      smp: { tier: TIERS[Math.floor(Math.random() * TIERS.length)], points: smpPoints },
      uhc: { tier: TIERS[Math.floor(Math.random() * TIERS.length)], points: uhcPoints },
      nethpot: { tier: TIERS[Math.floor(Math.random() * TIERS.length)], points: nethpotPoints },
      crystal: { tier: TIERS[Math.floor(Math.random() * TIERS.length)], points: crystalPoints },
    },
  }
}

export function generateInitialPlayers(): Player[] {
  const players: Player[] = []
  for (let i = 0; i < 30; i++) {
    players.push(generateRandomPlayer(i))
  }
  return players.sort((a, b) => b.overallPoints - a.overallPoints)
}
