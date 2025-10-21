"use client"

import type { Player } from "@/lib/types"
import { GAMEMODE_COLORS, GAMEMODE_LABELS } from "@/lib/types"
import Image from "next/image"

interface PlayerCardProps {
  player: Player
  rank: number
  onClick: () => void
  isTopFive?: boolean
  isLarge?: boolean
}

export function PlayerCard({ player, rank, onClick, isTopFive = false, isLarge = false }: PlayerCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg border border-red-900/30 overflow-hidden transition-all hover:border-red-700/50 hover:shadow-lg ${
        isTopFive ? "shimmer-effect" : ""
      } ${isLarge ? "md:col-span-2" : ""}`}
    >
      <div className="bg-red-950/40 p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Rank Badge - Top Left */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-lg">
            {rank}
          </div>

          {/* OVERALL Label - Top Right */}
          <div className="absolute top-4 right-4 text-xs font-bold text-orange-500">OVERALL</div>

          {/* Minecraft Head Avatar */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-red-700/50 mt-8">
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

          {/* Player Info */}
          <div className="text-center">
            <h3 className="font-bold text-lg text-white">{player.username}</h3>
            <p className="text-sm text-red-300">{player.region}</p>
          </div>

          {/* Overall Points */}
          <div className="text-center">
            <p className="text-xs text-red-400">Overall Points</p>
            <p className="text-2xl font-bold text-orange-500">{player.overallPoints.toLocaleString()}</p>
          </div>

          {/* Gamemode Tiers - Hidden on large cards */}
          {!isLarge && (
            <div className="grid grid-cols-5 gap-2 w-full">
              {Object.entries(player.gamemodes).map(([gamemode, stats]) => (
                <div key={gamemode} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full px-2 py-1 rounded text-xs font-bold text-white text-center ${GAMEMODE_COLORS[gamemode as keyof typeof GAMEMODE_COLORS]}`}
                  >
                    {stats.tier}
                  </div>
                  <p className="text-xs text-red-400">{GAMEMODE_LABELS[gamemode as keyof typeof GAMEMODE_LABELS]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
