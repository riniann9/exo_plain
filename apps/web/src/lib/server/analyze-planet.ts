
import { geminiFeatureToRow } from "@/lib/analysis/format-gemini-feature"

export type AnalyzePlanetEnv = {
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
}

const DEFAULT_GEMINI_MODEL = "gemini-flash-lite-latest"
const GEMINI_MODEL_FALLBACKS = ["gemini-3-flash-preview", "gemini-flash-latest"] as const

class GeminiApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
    readonly model: string,
    message?: string,
  ) {
    super(message ?? `Gemini API error: ${status} (model: ${model})`)
    this.name = "GeminiApiError"
  }
}

function getGeminiModelChain(primary?: string): string[] {
  const first = primary?.trim() || DEFAULT_GEMINI_MODEL
  const fallbacks = GEMINI_MODEL_FALLBACKS.filter((m) => m !== first)
  return [first, ...fallbacks]
}

export async function POST(request: Request, env: AnalyzePlanetEnv) {
  try {
    const body = await request.json()
    const { planetData, catalogFeatures, planetName } = body
    if (!planetData || typeof planetData !== "object" || Array.isArray(planetData)) return Response.json({ error: "planetData must be an object" }, { status: 400 })

    // Format the data for Gemini analysis
    const formattedData = formatPlanetDataForGemini(planetData, catalogFeatures, planetName)
    
    // Create the prompt for Gemini
    const prompt = createGeminiPrompt(formattedData)
    
    // Call Gemini API
    const geminiResponse = await callGeminiAPI(prompt, env)
    
    // Parse and format the response
    const analysisResult = parseGeminiResponse(geminiResponse)
    
    return Response.json(analysisResult)
  } catch (error) {
    if (error instanceof GeminiApiError) {
      console.error("Gemini API failed:", {
        status: error.status,
        model: error.model,
        body: error.body.slice(0, 2000),
      })
    } else if (error instanceof Error) {
      console.error("Error analyzing planet:", error.message)
    } else {
      console.error("Error analyzing planet:", error)
    }
    return Response.json(
      { error: 'Failed to analyze planet data' },
      { status: 500 }
    )
  }
}

function formatPlanetDataForGemini(planetData: any, catalogFeatures?: Record<string, unknown>, planetName?: string) {
  const catalog = catalogFeatures ?? {}
  // Format Kepler dataset fields for Gemini analysis
  return {
    "Target Name": planetName || "Unknown",
    "Orbital Period [days]": planetData.orbital_period || catalog.orbital_period || "Unknown",
    "Transit Epoch [BKJD]": planetData.transit_epoch || "Unknown",
    "Impact Parameter": planetData.impact_parameter || "Unknown",
    "Transit Duration [hrs]": planetData.transit_duration || "Unknown",
    "Transit Depth [ppm]": planetData.transit_depth || "Unknown",
    "Planetary Radius [Earth radii]": planetData.planetary_radius || catalog.planet_radius || "Unknown",
    "Equilibrium Temperature [K]": planetData.equilibrium_temperature || catalog.equilibrium_temperature || "Unknown",
    "Insolation Flux [Earth flux]": planetData.insolation_flux || catalog.insolation_flux || "Unknown",
    "Habitability index (catalog demo)": catalog.habitability_score ?? "Unknown",
    "Atmospheric / composition note (catalog)": catalog.atmospheric_composition ?? "Unknown",
    "Detection method (catalog)": catalog.detection_method ?? "Unknown",
    "Transit Signal-to-Noise": planetData.transit_snr || "Unknown",
    "TCE Planet Number": planetData.tce_planet_number || "Unknown",
    "Stellar Effective Temperature [K]": planetData.stellar_effective_temperature || "Unknown",
    "Stellar Surface Gravity [log10(cm/s**2)]": planetData.stellar_surface_gravity || "Unknown",
    "Stellar Radius [Solar radii]": planetData.stellar_radius || "Unknown",
    "RA [decimal degrees]": planetData.ra || "Unknown",
    "Dec [decimal degrees]": planetData.dec || "Unknown",
    "Kepler-band [mag]": planetData.kepler_band_mag || "Unknown"
  }
}

function calculateTransitDuration(planetData: any): string {
  if (!planetData.orbital_period || !planetData.stellar_radius) return "Unknown"
  
  const period = parseFloat(planetData.orbital_period)
  const stellarRadius = parseFloat(planetData.stellar_radius)
  
  // Simplified transit duration calculation
  const duration = (period * stellarRadius * 24) / (Math.PI * 2)
  return duration.toFixed(2)
}

function calculateTransitDepth(planetData: any): string {
  if (!planetData.planet_radius || !planetData.stellar_radius) return "Unknown"
  
  const planetRadius = parseFloat(planetData.planet_radius)
  const stellarRadius = parseFloat(planetData.stellar_radius)
  
  // Transit depth in ppm: (Rp/Rs)^2 * 1e6
  const depth = Math.pow(planetRadius / stellarRadius, 2) * 1e6
  return depth.toFixed(2)
}

function calculateSNR(planetData: any): string {
  // Simplified SNR calculation based on transit depth and stellar properties
  if (!planetData.planet_radius || !planetData.stellar_radius) return "Unknown"
  
  const planetRadius = parseFloat(planetData.planet_radius)
  const stellarRadius = parseFloat(planetData.stellar_radius)
  const depth = Math.pow(planetRadius / stellarRadius, 2)
  
  // Rough SNR estimate
  const snr = Math.sqrt(depth * 1000) // Simplified calculation
  return snr.toFixed(2)
}

function calculateStellarSurfaceGravity(planetData: any): string {
  if (!planetData.stellar_mass || !planetData.stellar_radius) return "Unknown"
  
  const mass = parseFloat(planetData.stellar_mass)
  const radius = parseFloat(planetData.stellar_radius)
  
  // log10(g) = log10(G*M/R^2) in cgs units
  const g = 4.44 + Math.log10(mass) - 2 * Math.log10(radius)
  return g.toFixed(2)
}

function createGeminiPrompt(formattedData: any): string {
  const dataString = Object.entries(formattedData)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')

  return `You are an expert exoplanet scientist. Analyze this exoplanet data and determine if it represents a confirmed exoplanet. Respond with ONLY the JSON format below, no additional text. Keep each feature explanation to one short sentence.

Data: ${dataString}

Required JSON format (respond with exactly this structure):
{
  "answer": true,
  "most_important_features": [
    {
      "feature1": "Feature Name (with specific values): Detailed explanation of why this feature is important for exoplanet classification.",
      "Relevance": "Relevance level - High/Medium/Low with brief explanation of why this feature matters for exoplanet identification."
    },
    {
      "feature2": "Feature Name (with specific values): Detailed explanation of why this feature is important for exoplanet classification.",
      "Relevance": "Relevance level - High/Medium/Low with brief explanation of why this feature matters for exoplanet identification."
    },
    {
      "feature3": "Feature Name (with specific values): Detailed explanation of why this feature is important for exoplanet classification.",
      "Relevance": "Relevance level - High/Medium/Low with brief explanation of why this feature matters for exoplanet identification."
    },
    {
      "feature4": "Feature Name (with specific values): Detailed explanation of why this feature is important for exoplanet classification.",
      "Relevance": "Relevance level - High/Medium/Low with brief explanation of why this feature matters for exoplanet identification."
    },
    {
      "feature5": "Feature Name (with specific values): Detailed explanation of why this feature is important for exoplanet classification.",
      "Relevance": "Relevance level - High/Medium/Low with brief explanation of why this feature matters for exoplanet identification."
    }
  ]
}`
}

async function callGeminiAPI(prompt: string, env: AnalyzePlanetEnv): Promise<any> {
  const apiKey = env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }

  const models = getGeminiModelChain(env.GEMINI_MODEL)
  let lastFailure: GeminiApiError | null = null

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    if (response.ok) {
      console.log(`Gemini generateContent succeeded (model: ${model})`)
      return response.json()
    }

    const body = await response.text()
    const err = new GeminiApiError(response.status, body, model)

    if (response.status === 404 || response.status === 503) {
      console.warn(`Gemini model unavailable (${response.status}), trying fallback`, {
        model,
        body: body.slice(0, 500),
      })
      lastFailure = err
      continue
    }

    throw err
  }

  throw lastFailure ?? new GeminiApiError(503, "No models available", models[0] ?? DEFAULT_GEMINI_MODEL)
}

function parseGeminiResponse(geminiResponse: any): any {
  try {
    console.log('Gemini response received')
    
    // Extract the text content from Gemini response
    const parts = geminiResponse.candidates?.[0]?.content?.parts ?? []
    const textContent = parts
      .map((part: { text?: string }) => part.text)
      .filter(Boolean)
      .join("")
    
    if (!textContent) {
      console.log('No text content found. Full response structure:', JSON.stringify(geminiResponse, null, 2))
      throw new Error('No text content in Gemini response')
    }

    console.log('Text content from Gemini:', textContent)

    // Try to extract JSON from the response (handle both raw JSON and markdown code blocks)
    let jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // Try to extract from markdown code blocks
      const codeBlockMatch = textContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]]
      }
    }

    if (!jsonMatch) {
      console.log('No JSON found in response. Full text:', textContent)
      throw new Error('No JSON found in Gemini response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    console.log('Parsed analysis:', analysis)

    const features = analysis.most_important_features || []
    const featureSummaries = features
      .slice(0, 3)
      .map((feature: Record<string, string>) => {
        const key = Object.keys(feature).find((k) => k !== "Relevance")
        return key ? String(feature[key]).slice(0, 120) : ""
      })
      .filter(Boolean)

    return {
      isExoplanet: analysis.answer === true,
      confidence: analysis.answer ? 88 : 22,
      explanation: `Gemini classified this target as ${analysis.answer ? "an exoplanet candidate" : "unlikely to be an exoplanet"} using ${features.length || 0} highlighted features.${featureSummaries.length ? ` Key points: ${featureSummaries.join(" · ")}` : ""}`,
      topFeatures: features.map((feature: Record<string, string>, index: number) => geminiFeatureToRow(feature, index)),
      geminiAnalysis: analysis,
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error)
    throw new Error('Failed to parse Gemini response')
  }
}
