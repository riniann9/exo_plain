import { buildPollinationsUrlFromPlanetData } from "@/lib/planet-image-url"

export async function POST(req: Request, _env?: { GEMINI_API_KEY?: string }) {
  try {
    const { planetData } = await req.json()
    const imageUrl = buildPollinationsUrlFromPlanetData(planetData ?? {})
    return Response.json({ imageUrl })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate planet image"
    console.error("Error in generate-planet-image API:", error)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
