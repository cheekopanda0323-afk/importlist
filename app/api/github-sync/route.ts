import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { players } = await request.json()

    console.log("[v0] GitHub sync started with", players?.length || 0, "players")

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO
    const githubBranch = process.env.GITHUB_BRANCH || "main"

    console.log("[v0] GitHub config - Token exists:", !!githubToken, "Repo:", githubRepo, "Branch:", githubBranch)

    if (!githubToken || !githubRepo) {
      console.log("[v0] Missing GitHub credentials")
      return NextResponse.json(
        { error: "GitHub credentials not configured. Please set GITHUB_TOKEN and GITHUB_REPO environment variables." },
        { status: 400 },
      )
    }

    // Prepare the data
    const content = JSON.stringify(players, null, 2)
    const encodedContent = Buffer.from(content).toString("base64")

    // Get current file SHA (if exists)
    const [owner, repo] = githubRepo.split("/")
    const filePath = "players-data.json"

    console.log("[v0] GitHub repo owner:", owner, "repo:", repo)

    let sha: string | undefined

    try {
      const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (getResponse.ok) {
        const data = await getResponse.json()
        sha = data.sha
        console.log("[v0] Found existing file with SHA:", sha)
      } else {
        console.log("[v0] File does not exist yet (status:", getResponse.status, ")")
      }
    } catch (error) {
      console.log("[v0] Error checking file:", error)
    }

    // Commit to GitHub
    console.log("[v0] Attempting to commit to GitHub...")
    const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update player data - ${new Date().toISOString()}`,
        content: encodedContent,
        branch: githubBranch,
        ...(sha && { sha }),
      }),
    })

    if (!commitResponse.ok) {
      const error = await commitResponse.json()
      console.log("[v0] GitHub commit failed:", error)
      return NextResponse.json(
        {
          error: "Failed to commit to GitHub",
          details: error,
          message: error.message || "Check your GitHub token and repository permissions",
        },
        { status: 400 },
      )
    }

    console.log("[v0] GitHub sync successful!")
    return NextResponse.json({ success: true, message: "Data synced to GitHub" })
  } catch (error) {
    console.error("[v0] GitHub sync error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
