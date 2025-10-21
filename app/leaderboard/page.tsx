"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PlayerModal } from "@/components/player-modal"
import { SearchBar } from "@/components/search-bar"
import { type Player, type GamemodeKey, GAMEMODE_LABELS } from "@/lib/types"
import Image from "next/image"

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGamemode, setSelectedGamemode] = useState<GamemodeKey | "all">("all")
  const [sortBy, setSortBy] = useState<"points" | "name" | "region">("points")

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players")
        const data = await res.json()
        setPlayers(data)
      } catch (error) {
        console.error("Failed to fetch players:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  const gamemodes: (GamemodeKey | "all")[] = ["all", "tank", "smp", "uhc", "nethpot", "crystal"]

  const filteredAndSortedPlayers = players
    .filter((player) => {
      if (selectedGamemode === "all") return true
      return player.gamemodes[selectedGamemode]
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.overallPoints - a.overallPoints
      if (sortBy === "name") return a.username.localeCompare(b.username)
      if (sortBy === "region") return a.region.localeCompare(b.region)
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-8">Leaderboard</h1>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar players={players} />
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Gamemode</p>
              <div className="flex flex-wrap gap-2">
                {gamemodes.map((gamemode) => (
                  <button
                    key={gamemode}
                    onClick={() => setSelectedGamemode(gamemode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedGamemode === gamemode
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-accent"
                    }`}
                  >
                    {gamemode === "all" ? "All" : GAMEMODE_LABELS[gamemode]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Sort By</p>
              <div className="flex gap-2">
                {(["points", "name", "region"] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === sort
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-accent"
                    }`}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading players...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Player</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                      Region
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className="border-b border-border hover:bg-card/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-accent">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded overflow-hidden border border-border">
                            <Image
                              src={`https://mc-heads.net/avatar/${player.username}/32`}
                              alt={player.username}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement
                                img.src = "/minecraft-head.jpg"
                              }}
                            />
                          </div>
                          <span className="font-medium text-foreground">{player.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{player.region}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-accent text-right">
                        {player.overallPoints.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  )
}
