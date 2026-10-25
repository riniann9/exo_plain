import { parseFeatureText } from "@/lib/parse-feature-text"

export function relevanceScore(relevance: string): number {
  const r = relevance.toLowerCase()
  if (r.includes("very high") || r.includes("critical")) return 92
  if (r.includes("high")) return 82
  if (r.includes("medium") || r.includes("moderate")) return 68
  if (r.includes("low")) return 45
  return 55
}

/** Pull a numeric measurement from "Feature name (3.2 R⊕): explanation" */
export function extractMeasuredValue(rawName: string): string | undefined {
  const paren = rawName.match(/\(([^)]+)\)\s*:?\s*$/) || rawName.match(/\(([^)]+)\)/)
  if (paren?.[1]) return paren[1].trim()
  return undefined
}

export function geminiFeatureToRow(feature: Record<string, string>, index: number) {
  const nameKey = Object.keys(feature).find((key) => key !== "Relevance")
  const raw =
    (nameKey ? feature[nameKey] : "") ||
    (Object.values(feature).find((v) => typeof v === "string" && v !== feature.Relevance) as string) ||
    ""
  const { name, description } = parseFeatureText(String(raw))
  const relevanceLabel = String(feature.Relevance ?? "").trim()
  const measured = extractMeasuredValue(String(raw)) ?? extractMeasuredValue(name)

  return {
    name: name.replace(/\([^)]+\)\s*:?\s*$/, "").trim() || `Indicator ${index + 1}`,
    impact: relevanceScore(relevanceLabel),
    value: measured ?? "",
    reasoning: description || String(raw),
    relevanceLabel: relevanceLabel || undefined,
  }
}
