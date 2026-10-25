import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use a public AI image generator as fallback
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&model=flux&nologo=true`
    
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("/api/generate-planet-image error", error)
    return NextResponse.json(
      { error: "Failed to generate planet image" },
      { status: 500 }
    )
  }
}