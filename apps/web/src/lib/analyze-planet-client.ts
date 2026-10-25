import { apiUrl, isStaticDemo } from "@/lib/deployment"
import type { AnalysisResult } from "@/types/analysis"

const ANALYZE_TIMEOUT_MS = 120_000

export async function fetchPlanetAnalysis(body: {
  planetData: unknown
  catalogFeatures?: Record<string, unknown>
  planetName?: string
}): Promise<AnalysisResult> {
  if (isStaticDemo) {
    throw new Error("Live Gemini is not configured on this deployment.")
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS)

  try {
    const response = await fetch(apiUrl("/api/analyze-planet"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const msg = typeof data.error === "string" ? data.error : `Analysis failed (${response.status})`
      throw new Error(msg)
    }

    if (data.error) {
      throw new Error(String(data.error))
    }

    return data as AnalysisResult
  } finally {
    clearTimeout(timer)
  }
}
