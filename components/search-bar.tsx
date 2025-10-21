"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { PlayerCard } from "./player-card"
import { PlayerModal } from "./player-modal"
import type { Player } from "@/lib/types"

interface SearchBarProps {
  players: Player[]
  onClose?: () => void
}

export function SearchBar({ players, onClose }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([])
      setIsOpen(false)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = players.filter(
      (player) => player.username.toLowerCase().includes(term) || player.region.toLowerCase().includes(term),
    )

    setResults(filtered)
    setIsOpen(true)
  }, [searchTerm, players])

  const handleClose = () => {
    setSearchTerm("")
    setResults([])
    setIsOpen(false)
    onClose?.()
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search players by name or region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {results.map((player, index) => (
              <div
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player)
                  setIsOpen(false)
                }}
                className="cursor-pointer"
              >
                <PlayerCard player={player} rank={index + 1} onClick={() => setSelectedPlayer(player)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && results.length === 0 && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg p-4 text-center text-muted-foreground">
          No players found matching "{searchTerm}"
        </div>
      )}

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  )
}
