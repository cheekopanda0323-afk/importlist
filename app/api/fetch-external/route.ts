import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from URL" }, { status: 400 })
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format - must be an array" }, { status: 400 })
    }

    return NextResponse.json({ success: true, players: data })
  } catch (error) {
    console.error("Error fetching external data:", error)
    return NextResponse.json({ error: "Failed to fetch external data" }, { status: 500 })
  }
}
