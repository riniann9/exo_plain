"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, Home } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

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

interface UnifiedResultsProps {
  result: AnalysisResult
  imageUrl: string | null
  onImageLoad: (url: string) => void
}

export function UnifiedResults({ result, imageUrl, onImageLoad }: UnifiedResultsProps) {
  // Compute the planet image prompt only when result is available
  const planetImageQuery = useMemo(() => {
    if (!result) return null
    const normalized = normalizePlanetData(result.planetData)
    return generatePlanetImageQuery(normalized)
  }, [result])

  // Load image when query is available
  useEffect(() => {
    let isMounted = true
    async function loadImage() {
      if (!planetImageQuery) return
      // try {
      //   const res = await fetch('/api/generate-planet-image', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ prompt: planetImageQuery })
      //   })
      //   if (!res.ok) throw new Error('image api failed')
      //   const data = await res.json()
      //   if (isMounted && data.imageUrl) onImageLoad(data.imageUrl)
      // } catch {
        // fall back to public AI image generator
        if (isMounted) onImageLoad(`https://image.pollinations.ai/prompt/${encodeURIComponent(planetImageQuery)}?width=400&height=400`)
      // }
    }
    loadImage()
    return () => { isMounted = false }
  }, [planetImageQuery, onImageLoad])

  return (
    <div className="min-h-screen bg-background relative">
      {/* Cosmic background effects - reduced opacity and size to prevent overlapping */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 right-1/4 w-64 h-64 ${result.isExoplanet ? "bg-primary/5" : "bg-destructive/5"} rounded-full blur-[100px] animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 left-1/4 w-64 h-64 ${result.isExoplanet ? "bg-accent/5" : "bg-muted/5"} rounded-full blur-[100px] animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </Link>

          <Badge variant="outline" className="text-xs sm:text-sm">
            Source: {result.source === "existing" ? "Existing Data" : "New Prediction"}
          </Badge>
        </div>

        {/* Main Result Card */}
        <Card
          className={`p-4 sm:p-6 mb-4 sm:mb-6 border-2 ${result.isExoplanet ? "border-primary bg-primary/5" : "border-destructive bg-destructive/5"}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            {/* Result Icon */}
            <div className="flex-shrink-0">
              {result.isExoplanet ? (
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary animate-pulse" />
              ) : (
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-destructive animate-pulse" />
              )}
            </div>

            {/* Result Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 text-balance">
                {result.isExoplanet ? (
                  <span className="text-primary">Exoplanet Detected!</span>
                ) : (
                  <span className="text-destructive">Not an Exoplanet</span>
                )}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-2 sm:mb-3">
                Confidence Level: <span className="font-bold text-foreground">{result.confidence}%</span>
              </p>
              <Progress value={result.confidence} className="h-2" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* AI Explanation */}
          <Card className="p-4 sm:p-5 bg-card/50 backdrop-blur border border-border">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              {result.aiAnalysis ? 'Gemini AI Analysis' : 'AI Analysis'}
            </h2>
            {result.aiAnalysis ? (
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold text-primary mb-1 sm:mb-2 text-xs sm:text-sm">Detailed Scientific Analysis:</h3>
                  <div className="text-foreground leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                    {result.aiAnalysis}
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-muted/50 border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">Summary:</h3>
                  <p className="text-foreground leading-relaxed text-xs sm:text-sm">{result.explanation}</p>
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed text-xs sm:text-sm">{result.explanation}</p>
            )}
          </Card>

          {/* Planet Visualization */}
          <Card className="p-4 sm:p-5 bg-card/50 backdrop-blur border border-border">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary">Planet Visualization</h2>
            <div className="aspect-square rounded-lg overflow-hidden bg-background/50 border border-border">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="AI Generated Planet"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs sm:text-sm">Generating image…</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI-generated visualization based on features
            </p>
          </Card>
        </div>

        {/* Feature Impact Analysis */}
        <Card className="p-4 sm:p-5 bg-card/50 backdrop-blur border border-border mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary">Key Features Impact</h2>
          <div className="space-y-3 sm:space-y-4">
            {result.topFeatures.map((feature, index) => (
              <div key={index} className="space-y-1 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs sm:text-sm px-1 sm:px-2 py-0.5 sm:py-1">
                      #{index + 1}
                    </Badge>
                    <span className="font-semibold text-foreground text-xs sm:text-sm">{feature.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Value: <span className="font-bold text-foreground">{feature.value}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Progress value={feature.impact} className="flex-1 h-1.5 sm:h-2" />
                  <span className="text-xs font-bold text-foreground w-8 sm:w-10">{feature.impact}%</span>
                </div>

                <p className="text-xs text-muted-foreground pl-8 sm:pl-12">{feature.reasoning}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-6">
          <Link href="/existing">
            <Button size="lg" variant="outline" className="gap-2 min-w-[160px] sm:min-w-[180px] bg-transparent text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Explore Existing Planets</span>
              <span className="sm:hidden">Explore Planets</span>
            </Button>
          </Link>
          <Link href="/new">
            <Button size="lg" className="gap-2 min-w-[160px] sm:min-w-[180px] bg-primary hover:bg-primary/90 text-sm sm:text-base">
              <span className="hidden sm:inline">Create New Prediction</span>
              <span className="sm:hidden">New Prediction</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
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

// Generate descriptive query for planet image
export function generatePlanetImageQuery(planetData: any): string {
  const features = planetData.features || planetData
  const temp = Number.parseFloat(features.equilibrium_temperature) || 250
  const radius = Number.parseFloat(features.planet_radius) || 1
  const hasRings = features.ring_system === true || features.ring_system === "true"

  let description = "exoplanet in space"

  // Temperature-based appearance
  if (temp < 200) {
    description += " frozen ice planet blue white"
  } else if (temp < 300) {
    description += " earth-like planet blue green"
  } else if (temp < 500) {
    description += " hot desert planet orange red"
  } else {
    description += " lava planet glowing red orange"
  }

  // Size-based
  if (radius > 3) {
    description += " gas giant"
  } else if (radius > 1.5) {
    description += " super earth"
  }

  // Rings
  if (hasRings) {
    description += " with ring system"
  }

  description += " realistic space background stars"

  return description
}
