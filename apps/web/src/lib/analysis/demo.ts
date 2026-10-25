import type { AnalysisResult } from "@/types/analysis"
import { buildTopFeaturesFromCatalog } from "@/lib/analysis/top-features-from-catalog"

function parseNum(value: unknown, fallback = 0): number {
  const n = Number.parseFloat(String(value ?? ""))
  return Number.isFinite(n) ? n : fallback
}

function featureBag(planetData: unknown, source: string): Record<string, unknown> {
  if (source === "existing" && planetData && typeof planetData === "object" && "features" in planetData) {
    return (planetData as { features: Record<string, unknown> }).features
  }
  return (planetData ?? {}) as Record<string, unknown>
}

function deterministicJitter(seed: string, min: number, max: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  const t = Math.abs(h) % 1000
  return min + (t / 1000) * (max - min)
}

export function analyzePlanetData(planetData: unknown, source: string, planetName?: string): AnalysisResult {
  const features = featureBag(planetData, source)
  const label =
    planetName ||
    (typeof planetData === "object" && planetData && "name" in planetData
      ? String((planetData as { name: string }).name)
      : "this body")

  const habitabilityScore = parseNum(features.habitability_score)
  const planetRadius = parseNum(features.planet_radius) || parseNum(features.planetary_radius)
  const orbitalPeriod = parseNum(features.orbital_period)
  const equilibriumTemp = parseNum(features.equilibrium_temperature)
  const insolation = parseNum(features.insolation_flux)
  const semiMajor = parseNum(features.semi_major_axis)
  const detectionMethod = String(features.detection_method ?? "Transit")
  const atmosphere = String(features.atmospheric_composition ?? "unknown atmosphere")
  const hasRings = features.ring_system === true || features.ring_system === "true"

  const transitLike = planetRadius > 0.4 && planetRadius < 12 && orbitalPeriod > 0 && orbitalPeriod < 500

  const isExoplanet = habitabilityScore >= 0.35 || transitLike

  const seed = `${label}-${orbitalPeriod}-${planetRadius}-${equilibriumTemp}`
  const confidence = Math.round(
    Math.min(94, Math.max(58, habitabilityScore * 70 + (transitLike ? 18 : 8) + deterministicJitter(seed, 0, 8))),
  )

  const tempClass =
    equilibriumTemp < 200
      ? "a cold, ice-dominated world"
      : equilibriumTemp < 300
        ? "a temperate zone candidate"
        : equilibriumTemp < 500
          ? "a warm or desert-like world"
          : "a high-temperature lava-class body"

  const sizeClass =
    planetRadius > 3 ? "gas-giant scale" : planetRadius > 1.5 ? "super-Earth scale" : "rocky, Earth-like scale"

  const explanation = isExoplanet
    ? `${label} shows a coherent exoplanet-like profile: ${sizeClass}, ${tempClass}, and ${orbitalPeriod.toFixed(1)}-day orbit. ${atmosphere !== "unknown atmosphere" ? `Atmospheric context: ${atmosphere}.` : ""} Insolation ${insolation || "n/a"}× Earth flux and equilibrium temperature ${equilibriumTemp || "n/a"} K support a ${detectionMethod}-consistent interpretation${hasRings ? " with a ring system" : ""}. Habitability score ${habitabilityScore.toFixed(2)} is a demonstration ranking, not a NASA disposition.`
    : `${label} deviates from typical confirmed exoplanet patterns in this demonstration model (radius ${planetRadius || "n/a"} R⊕, period ${orbitalPeriod || "n/a"} days, habitability ${habitabilityScore.toFixed(2)}). Treat as inconclusive until live model and FITS analysis are connected.`

  const topFeatures = buildTopFeaturesFromCatalog(
    { ...features, detection_method: detectionMethod, atmospheric_composition: atmosphere },
    label,
  )

  return {
    isExoplanet,
    confidence,
    explanation,
    topFeatures,
    planetData,
    source,
  }
}
