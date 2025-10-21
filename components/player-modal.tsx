"use client"

import type { Player } from "@/lib/types"
import { GAMEMODE_COLORS, GAMEMODE_LABELS, TIER_COLORS } from "@/lib/types"
import { X } from "lucide-react"
import Image from "next/image"

interface PlayerModalProps {
  player: Player | null
  onClose: () => void
}

export function PlayerModal({ player, onClose }: PlayerModalProps) {
  if (!player) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-card to-background border-2 border-accent/30 rounded-lg max-w-md w-full p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-accent/20 rounded transition-colors">
          <X className="w-5 h-5 text-accent" />
        </button>

        <div className="flex flex-col items-center gap-4">
          {/* Minecraft Head Avatar */}
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-accent shadow-lg">
            <Image
              src={`https://mc-heads.net/avatar/${player.username}/96`}
              alt={player.username}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = "/minecraft-head.jpg"
              }}
            />
          </div>

          {/* Player Name */}
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              {player.username}
            </h2>
            <p className="text-sm text-accent mt-1">{player.region}</p>
          </div>

          {/* Overall Points */}
          <div className="text-center w-full bg-gradient-to-r from-orange-900/40 to-amber-900/40 rounded-lg p-3 border border-orange-700/50">
            <p className="text-xs text-muted-foreground mb-1">Overall Points</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              {player.overallPoints.toLocaleString()}
            </p>
          </div>

          {/* Gamemode Stats */}
          <div className="w-full space-y-3 mt-4">
            <p className="text-sm font-semibold text-foreground">Gamemode Stats</p>
            {Object.entries(player.gamemodes).map(([gamemode, stats]) => {
              const tierColor = TIER_COLORS[stats.tier] || TIER_COLORS["N/A"]
              return (
                <div
                  key={gamemode}
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-950/30 border border-orange-800/40 hover:border-orange-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${GAMEMODE_COLORS[gamemode as keyof typeof GAMEMODE_COLORS]}`}
                    />
                    <span className="text-sm font-medium">
                      {GAMEMODE_LABELS[gamemode as keyof typeof GAMEMODE_LABELS]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${tierColor.bg} shadow-lg`}>
                      {stats.tier}
                    </span>
                    <span className="text-sm text-accent font-semibold">{stats.points.toLocaleString()} pts</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
