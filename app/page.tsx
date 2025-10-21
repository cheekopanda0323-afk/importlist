"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PlayerCard } from "@/components/player-card"
import { PlayerModal } from "@/components/player-modal"
import { SearchBar } from "@/components/search-bar"
import type { Player } from "@/lib/types"
import Link from "next/link"

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

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

  const topFivePlayers = players.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative overflow-hidden bg-gradient-to-b from-red-950 to-background">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 md:w-[500px] md:h-[500px] rounded-full bg-red-900/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-red-500 mb-4">AliveSMP Rankings</h1>
          <p className="text-base text-red-200 mb-2">
            Compete across 5 epic gamemodes: Tank, SMP, UHC, Nethpot, and Crystal. Climb the leaderboard and prove your
            skills.
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-red-900/20">
        <div className="container mx-auto px-4">
          <SearchBar players={players} />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Top 5 Players</h2>
          <p className="text-center text-red-300 mb-12">Overall Rankings</p>

          {loading ? (
            <div className="text-center text-red-300">Loading players...</div>
          ) : (
            <>
              {topFivePlayers.length > 0 && (
                <div className="mb-8">
                  <PlayerCard
                    player={topFivePlayers[0]}
                    rank={1}
                    onClick={() => setSelectedPlayer(topFivePlayers[0])}
                    isTopFive={true}
                    isLarge={true}
                  />
                </div>
              )}

              {topFivePlayers.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {topFivePlayers.slice(1, 5).map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      rank={index + 2}
                      onClick={() => setSelectedPlayer(player)}
                      isTopFive={true}
                    />
                  ))}
                </div>
              )}

              <div className="text-center">
                <Link
                  href="/leaderboard"
                  className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View Full Leaderboard
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="py-8 border-t border-red-900/20 text-center text-red-400 text-sm">Built with ❤️</footer>

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  )
}
