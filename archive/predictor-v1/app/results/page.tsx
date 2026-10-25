"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { UnifiedResults } from "@/components/unified-results"

type AnalysisResult = {
  isExoplanet: boolean
  confidence: number
  explanation: string
  aiAnalysis?: string
  topFeatures: Array<{
    name: string
    impact: number
    value: string | number
    reasoning: string
  }>
  planetData: any
  source: string
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const planetDataStr = searchParams.get("planetData")
    const aiAnalysisStr = searchParams.get("aiAnalysis")
    const source = searchParams.get("source")
    const error = searchParams.get("error")

    if (planetDataStr) {
      const planetData = JSON.parse(planetDataStr)
      const aiAnalysis = aiAnalysisStr ? JSON.parse(aiAnalysisStr) : null

      // Use AI analysis if available, otherwise fallback to mock analysis
      const analysis = aiAnalysis 
        ? analyzePlanetDataWithAI(planetData, aiAnalysis, source || "unknown")
        : analyzePlanetData(planetData, source || "unknown")
      
      setResult(analysis)
    }
  }, [searchParams])

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    )
  }

  return (
    <UnifiedResults 
      result={result} 
      imageUrl={imageUrl} 
      onImageLoad={setImageUrl} 
    />
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}

// AI analysis function that processes Gemini response
function analyzePlanetDataWithAI(planetData: any, aiAnalysis: string, source: string): AnalysisResult {
  // Extract key information from Gemini response
  const isExoplanet = aiAnalysis.toLowerCase().includes('exoplanet') && 
    (aiAnalysis.toLowerCase().includes('yes') || aiAnalysis.toLowerCase().includes('likely'))
  
  // Extract confidence from the response or calculate based on content
  const confidenceMatch = aiAnalysis.match(/(\d+)%/i)
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 85

  // Extract planet type if mentioned
  const planetTypeMatch = aiAnalysis.match(/(super-earth|gas giant|terrestrial|rocky|ice giant)/i)
  const planetType = planetTypeMatch ? planetTypeMatch[1] : 'Unknown'

  // Create a summary explanation
  const explanation = `Based on Gemini AI analysis, this celestial body ${isExoplanet ? 'is classified as an exoplanet' : 'does not meet exoplanet criteria'}. The AI has provided detailed scientific insights about the planetary characteristics, habitability potential, and scientific significance.`

  // Extract top features from the analysis
  const topFeatures = [
    {
      name: "AI Classification",
      impact: 95,
      value: isExoplanet ? "Exoplanet" : "Not Exoplanet",
      reasoning: "Primary determination from Gemini AI analysis",
    },
    {
      name: "Planet Type",
      impact: 88,
      value: planetType,
      reasoning: "Classification based on physical and orbital characteristics",
    },
    {
      name: "Habitability Assessment",
      impact: 82,
      value: planetData.habitability_score || "Unknown",
      reasoning: "Potential for supporting life based on environmental conditions",
    },
    {
      name: "Orbital Characteristics",
      impact: 76,
      value: `${planetData.orbital_period} days`,
      reasoning: "Orbital period and distance from host star",
    },
    {
      name: "Physical Properties",
      impact: 71,
      value: `${planetData.planet_radius} Earth radii`,
      reasoning: "Size and mass characteristics compared to Earth",
    },
  ]

  return {
    isExoplanet,
    confidence,
    explanation,
    aiAnalysis,
    topFeatures,
    planetData,
    source,
  }
}

// Placeholder AI analysis function
function analyzePlanetData(planetData: any, source: string): AnalysisResult {
  // Extract features for analysis
  const raw = source === "existing" ? planetData.features : planetData
  const features = normalizePlanetData(raw)

  // Simple heuristic: check habitability score or other key metrics
  const habitabilityScore = Number.parseFloat(features.habitability_score) || 0
  const planetRadius = Number.parseFloat(features.planet_radius) || 0
  const orbitalPeriod = Number.parseFloat(features.orbital_period) || 0
  const equilibriumTemp = Number.parseFloat(features.equilibrium_temperature) || 0

  // Determine if it's an exoplanet (placeholder logic)
  const isExoplanet = habitabilityScore > 0.5 || (planetRadius > 0.5 && planetRadius < 10 && orbitalPeriod > 0)

  // Calculate confidence
  const confidence = Math.min(95, Math.max(65, Math.round(habitabilityScore * 100 + Math.random() * 10)))

  // Generate explanation
  const explanation = isExoplanet
    ? `Based on the analysis of ${Object.keys(features).length} planetary features, our AI model has determined this is likely an exoplanet. The combination of orbital characteristics, physical properties, and stellar parameters align with known exoplanet signatures. Key indicators include the planet's radius (${planetRadius} Earth radii), orbital period (${orbitalPeriod} days), and habitability score (${habitabilityScore}). These values fall within the expected range for confirmed exoplanets in our database.`
    : `After analyzing ${Object.keys(features).length} features, our AI model suggests this celestial body does not match typical exoplanet characteristics. The data shows anomalies in key parameters such as orbital mechanics, physical properties, or stellar relationships that deviate from confirmed exoplanet patterns. This could indicate a different type of celestial object, measurement errors, or insufficient data quality.`

  // Determine top impactful features
  const topFeatures = [
    {
      name: "Habitability Score",
      impact: 95,
      value: habitabilityScore.toFixed(2),
      reasoning: "Primary indicator of exoplanet potential based on conditions suitable for life",
    },
    {
      name: "Planet Radius",
      impact: 88,
      value: `${planetRadius} Earth radii`,
      reasoning: "Size comparison to Earth helps classify planet type and formation history",
    },
    {
      name: "Orbital Period",
      impact: 82,
      value: `${orbitalPeriod} days`,
      reasoning: "Determines the planet's year length and distance from its host star",
    },
    {
      name: "Equilibrium Temperature",
      impact: 76,
      value: `${equilibriumTemp} K`,
      reasoning: "Critical for determining potential atmospheric conditions and habitability",
    },
    {
      name: "Semi-Major Axis",
      impact: 71,
      value: `${features.semi_major_axis} AU`,
      reasoning: "Defines orbital distance and influences temperature and stellar radiation received",
    },
  ]

  return {
    isExoplanet,
    confidence,
    explanation,
    topFeatures,
    planetData,
    source,
  }
}

// Normalize new Kepler/KOI field names to previous keys used in analysis
function normalizePlanetData(data: any) {
  if (!data) return {}
  const out: any = { ...data }
  // Map new names -> legacy keys consumed by analysis and image prompt
  if (data.planetary_radius_earth_radii) out.planet_radius = String(data.planetary_radius_earth_radii)
  if (data.orbital_period_days) out.orbital_period = String(data.orbital_period_days)
  if (data.equilibrium_temperature_k) out.equilibrium_temperature = String(data.equilibrium_temperature_k)
  if (data.insolation_flux_earth_flux) out.insolation_flux = String(data.insolation_flux_earth_flux)
  if (data.stellar_effective_temperature_k) out.stellar_temperature = String(data.stellar_effective_temperature_k)
  if (data.stellar_radius_solar_radii) out.stellar_radius = String(data.stellar_radius_solar_radii)
  // Rings not present; default to false
  if (out.ring_system === undefined) out.ring_system = "false"
  return out
}