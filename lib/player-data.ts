import type { Player } from "./types"

const FIRST_NAMES = [
  "Shadow", "Phoenix", "Dragon", "Titan", "Nexus", "Vortex", "Blaze", "Storm",
  "Apex", "Void", "Echo", "Cipher", "Rogue", "Specter", "Inferno", "Zenith",
  "Prism", "Quantum", "Velocity", "Obsidian", "Crimson", "Ethereal", "Phantom",
  "Sentinel", "Valor", "Abyss", "Tempest", "Radiant", "Nocturne",
]

const LAST_NAMES = [
  "Pro", "King", "Master", "Elite", "Slayer", "Hunter", "Warrior", "Knight",
  "Sage", "Mystic", "Raven", "Wolf", "Tiger", "Eagle", "Viper", "Reaper",
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

// 🏆 Official MCTiers Players
const OFFICIAL_PLAYERS: Player[] = [
  {
    id: "player-official-1",
    username: "Marlowww",
    overallPoints: 5800,
    region: "ASIA",
    gamemodes: {
      tank: { tier: "HT1", points: 1200 },
      smp: { tier: "HT1", points: 1150 },
      uhc: { tier: "HT1", points: 1175 },
      nethpot: { tier: "HT1", points: 1125 },
      crystal: { tier: "HT1", points: 1150 },
    },
  },
  {
    id: "player-official-2",
    username: "ItzRealMe",
    overallPoints: 5300,
    region: "EU",
    gamemodes: {
      tank: { tier: "HT1", points: 1100 },
      smp: { tier: "HT1", points: 1050 },
      uhc: { tier: "HT2", points: 1000 },
      nethpot: { tier: "HT1", points: 1050 },
      crystal: { tier: "HT2", points: 1100 },
    },
  },
  {
    id: "player-official-3",
    username: "Swight",
    overallPoints: 4900,
    region: "NA",
    gamemodes: {
      tank: { tier: "HT2", points: 1000 },
      smp: { tier: "HT2", points: 980 },
      uhc: { tier: "HT2", points: 960 },
      nethpot: { tier: "HT2", points: 1000 },
      crystal: { tier: "HT2", points: 960 },
    },
  },
  {
    id: "player-official-4",
    username: "Vogels",
    overallPoints: 4400,
    region: "SA",
    gamemodes: {
      tank: { tier: "HT3", points: 900 },
      smp: { tier: "HT3", points: 880 },
      uhc: { tier: "HT3", points: 870 },
      nethpot: { tier: "HT3", points: 900 },
      crystal: { tier: "HT3", points: 850 },
    },
  },
  {
    id: "player-official-5",
    username: "Prusso",
    overallPoints: 4000,
    region: "AU",
    gamemodes: {
      tank: { tier: "HT4", points: 800 },
      smp: { tier: "HT4", points: 780 },
      uhc: { tier: "HT4", points: 760 },
      nethpot: { tier: "HT4", points: 800 },
      crystal: { tier: "HT4", points: 780 },
    },
  },
]

export function generateInitialPlayers(): Player[] {
  const players: Player[] = [...OFFICIAL_PLAYERS]
  for (let i = 0; i < 25; i++) {
    players.push(generateRandomPlayer(i))
  }
  return players.sort((a, b) => b.overallPoints - a.overallPoints)
}
