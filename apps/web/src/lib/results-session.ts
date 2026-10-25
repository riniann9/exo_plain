import type { AnalysisResult } from "@/types/analysis"
import { siteUrl } from "@/lib/deployment"

const STORAGE_KEY = "exo-plain-results-v1"

export type ResultsSessionPayload = {
  planetData: unknown
  analysisResult: AnalysisResult
  source: string
  geminiPrompt?: string
  error?: string
}

export function saveResultsSession(payload: ResultsSessionPayload): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function loadResultsSession(): ResultsSessionPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ResultsSessionPayload
  } catch {
    return null
  }
}

export function navigateToResults(payload: ResultsSessionPayload): void {
  saveResultsSession(payload)
  window.location.href = siteUrl("/results/")
}
