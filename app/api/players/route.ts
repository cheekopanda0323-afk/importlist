import { type NextRequest, NextResponse } from "next/server"
import type { Player } from "@/lib/types"
import { generateInitialPlayers } from "@/lib/player-data"

// In-memory storage
const players: Player[] = generateInitialPlayers()

export async function GET() {
  return NextResponse.json(players.sort((a, b) => b.overallPoints - a.overallPoints))
}

export async function POST(request: NextRequest) {
  const newPlayer = await request.json()
  const player: Player = {
    id: `player-${Date.now()}`,
    ...newPlayer,
  }
  players.push(player)
  players.sort((a, b) => b.overallPoints - a.overallPoints)
  return NextResponse.json(player, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const updatedPlayer = await request.json()
  const index = players.findIndex((p) => p.id === updatedPlayer.id)
  if (index === -1) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 })
  }
  players[index] = updatedPlayer
  players.sort((a, b) => b.overallPoints - a.overallPoints)
  return NextResponse.json(updatedPlayer)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  const index = players.findIndex((p) => p.id === id)
  if (index === -1) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 })
  }

  players.splice(index, 1)
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest) {
  const importedPlayers = await request.json()

  if (!Array.isArray(importedPlayers)) {
    return NextResponse.json({ error: "Invalid format - must be an array" }, { status: 400 })
  }

  // Clear all existing players
  players.length = 0

  // Add imported players with new IDs
  for (const player of importedPlayers) {
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      username: player.username,
      overallPoints: player.overallPoints,
      region: player.region,
      gamemodes: player.gamemodes,
    }
    players.push(newPlayer)
  }

  // Sort by overall points
  players.sort((a, b) => b.overallPoints - a.overallPoints)

  return NextResponse.json({ success: true, count: players.length })
}
