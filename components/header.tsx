"use client"

import { useState } from "react"
import Link from "next/link"

export function Header() {
  const [copied, setCopied] = useState(false)
  const serverIP = "play.alivesmp.fun"

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-red-900/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-lg">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AliveTierList</h1>
            <p className="text-xs text-red-300">Minecraft PvP Rankings</p>
          </div>
        </Link>

        {/* Right: Server IP */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-red-400">Server IP</p>
            <p className="text-sm font-semibold text-white">{serverIP}</p>
          </div>
          <button
            onClick={handleCopyIP}
            className="px-3 py-1 text-xs text-red-300 hover:text-red-200 transition-colors"
            title="Copy server IP"
          >
            {copied ? "Copied!" : "Click to Copy"}
          </button>
        </div>
      </div>
    </header>
  )
}
