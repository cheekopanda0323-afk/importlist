"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { type Player, GAMEMODE_LABELS, TIER_ORDER, TIER_COLORS } from "@/lib/types"
import { Trash2, Plus, Download, Upload } from "lucide-react"
import { savePlayersToStorage } from "@/lib/player-data"

export default function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [redeploying, setRedeploying] = useState(false)
  const [selectedGamemode, setSelectedGamemode] = useState<"tank" | "smp" | "uhc" | "nethpot" | "crystal">("tank")
  const [formData, setFormData] = useState({
    username: "",
    overallPoints: 0,
    region: "NA",
    tank_tier: "HT1",
    tank_points: 0,
    smp_tier: "HT1",
    smp_points: 0,
    uhc_tier: "HT1",
    uhc_points: 0,
    nethpot_tier: "HT1",
    nethpot_points: 0,
    crystal_tier: "HT1",
    crystal_points: 0,
  })

  useEffect(() => {
    if (players.length > 0) {
      savePlayersToStorage(players)
    }
  }, [players])

  useEffect(() => {
    const autoSaveInterval = setInterval(
      () => {
        if (players.length > 0) {
          savePlayersToStorage(players)
        }
      },
      2 * 60 * 1000,
    )

    return () => clearInterval(autoSaveInterval)
  }, [players])

  useEffect(() => {
    fetchPlayers()
  }, [])

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

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      username: formData.username,
      overallPoints: formData.overallPoints,
      region: formData.region,
      gamemodes: {
        tank: { tier: formData.tank_tier, points: formData.tank_points },
        smp: { tier: formData.smp_tier, points: formData.smp_points },
        uhc: { tier: formData.uhc_tier, points: formData.uhc_points },
        nethpot: { tier: formData.nethpot_tier, points: formData.nethpot_points },
        crystal: { tier: formData.crystal_tier, points: formData.crystal_points },
      },
    }

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlayer),
      })

      if (res.ok) {
        fetchPlayers()
        setShowAddForm(false)
        setFormData({
          username: "",
          overallPoints: 0,
          region: "NA",
          tank_tier: "HT1",
          tank_points: 0,
          smp_tier: "HT1",
          smp_points: 0,
          uhc_tier: "HT1",
          uhc_points: 0,
          nethpot_tier: "HT1",
          nethpot_points: 0,
          crystal_tier: "HT1",
          crystal_points: 0,
        })
        setMessage({ type: "success", text: "Player added successfully!" })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error("Failed to add player:", error)
      setMessage({ type: "error", text: "Failed to add player" })
    }
  }

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this player?")) return

    try {
      const res = await fetch(`/api/players?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchPlayers()
        setMessage({ type: "success", text: "Player deleted successfully!" })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error("Failed to delete player:", error)
      setMessage({ type: "error", text: "Failed to delete player" })
    }
  }

  const handleExport = () => {
    const tierPointsMap = {
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

    const playersCode = players
      .map(
        (p) => `  {
    id: "${p.id}",
    username: "${p.username}",
    region: "${p.region}",
    overallPoints: ${p.overallPoints},
    gamemodes: {
      tank: { tier: "${p.gamemodes.tank.tier}", points: ${p.gamemodes.tank.points} },
      smp: { tier: "${p.gamemodes.smp.tier}", points: ${p.gamemodes.smp.points} },
      uhc: { tier: "${p.gamemodes.uhc.tier}", points: ${p.gamemodes.uhc.points} },
      nethpot: { tier: "${p.gamemodes.nethpot.tier}", points: ${p.gamemodes.nethpot.points} },
      crystal: { tier: "${p.gamemodes.crystal.tier}", points: ${p.gamemodes.crystal.points} },
    },
  }`,
      )
      .join(",\n")

    const fileContent = `import type { Player } from "./types"

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
${playersCode}
]

export function generateInitialPlayers(): Player[] {
  return PLAYERS.sort((a, b) => b.overallPoints - a.overallPoints)
}`

    const dataBlob = new Blob([fileContent], { type: "text/typescript" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "player-data.ts"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setMessage({ type: "success", text: "player-data.ts exported successfully!" })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedPlayers = JSON.parse(text)

      if (!Array.isArray(importedPlayers)) {
        throw new Error("Invalid file format")
      }

      const res = await fetch("/api/players", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importedPlayers),
      })

      if (res.ok) {
        fetchPlayers()
        savePlayersToStorage(importedPlayers)
        setMessage({ type: "success", text: "Players imported successfully! All previous players replaced." })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error("Import failed")
      }
    } catch (error) {
      console.error("Failed to import players:", error)
      setMessage({ type: "error", text: "Failed to import players" })
      setTimeout(() => setMessage(null), 3000)
    }

    e.target.value = ""
  }

  const filteredPlayers = players.filter((p) => p.username.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-8">
            Admin Panel
          </h1>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border-2 ${
                message.type === "success"
                  ? "bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-600/50 text-green-400"
                  : "bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-600/50 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Player
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {/* Add Player Form */}
          {showAddForm && (
            <div className="mb-8 p-6 bg-gradient-to-br from-card to-background border-2 border-accent/30 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-6">
                Add New Player
              </h2>
              <form onSubmit={handleAddPlayer} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Enter player username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 bg-background border-2 border-accent/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Overall Points</label>
                    <input
                      type="number"
                      placeholder="Total points"
                      value={formData.overallPoints}
                      onChange={(e) => setFormData({ ...formData, overallPoints: Number.parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border-2 border-accent/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2 bg-background border-2 border-accent/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option>NA</option>
                      <option>EU</option>
                      <option>ASIA</option>
                      <option>SA</option>
                      <option>AU</option>
                    </select>
                  </div>
                </div>

                {/* Gamemode Selection Tabs */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Select Gamemode</label>
                  <div className="flex flex-wrap gap-2">
                    {(["tank", "smp", "uhc", "nethpot", "crystal"] as const).map((gamemode) => (
                      <button
                        key={gamemode}
                        type="button"
                        onClick={() => setSelectedGamemode(gamemode)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedGamemode === gamemode
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                            : "bg-background border-2 border-accent/30 text-foreground hover:border-accent"
                        }`}
                      >
                        {GAMEMODE_LABELS[gamemode]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier Selection for Selected Gamemode */}
                <div className="bg-background/50 p-4 rounded-lg border-2 border-accent/20">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    {GAMEMODE_LABELS[selectedGamemode]} - Select Tier
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    {TIER_ORDER.map((tier) => {
                      const tierColor = TIER_COLORS[tier]
                      const isSelected = formData[`${selectedGamemode}_tier` as keyof typeof formData] === tier
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              [`${selectedGamemode}_tier`]: tier,
                            })
                          }
                          className={`px-3 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                            isSelected
                              ? `${tierColor.bg} text-white border-white shadow-lg scale-105`
                              : `${tierColor.bg} text-white border-transparent opacity-60 hover:opacity-100`
                          }`}
                        >
                          {tier}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Points Input for Selected Gamemode */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {GAMEMODE_LABELS[selectedGamemode]} - Points
                  </label>
                  <input
                    type="number"
                    placeholder="Points for this gamemode"
                    value={formData[`${selectedGamemode}_points` as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${selectedGamemode}_points`]: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-background border-2 border-accent/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg"
                >
                  Add Player
                </button>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-card border-2 border-accent/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Players Table */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading players...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border-2 border-accent/30 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-accent/30 bg-gradient-to-r from-red-600/20 to-yellow-600/20">
                    <th className="px-4 py-3 text-left text-sm font-bold text-accent">Player</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-accent hidden md:table-cell">Region</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-accent">Points</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-accent">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-accent/20 hover:bg-gradient-to-r hover:from-red-600/10 hover:to-yellow-600/10 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{player.username}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{player.region}</td>
                      <td className="px-4 py-3 text-sm font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent text-right">
                        {player.overallPoints.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-red-600/30 to-red-700/30 hover:from-red-600/50 hover:to-red-700/50 text-red-400 rounded transition-all border border-red-600/50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
