"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, Home } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { buildPollinationsPlanetImageUrl } from "@/components/planet-image-utils"

import type { AnalysisResult } from "@/types/analysis"
import { analyzePlanetData } from "@/lib/analysis/demo"
import { geminiFeatureToRow } from "@/lib/analysis/format-gemini-feature"

function normalizeAnalysisResult(analysis: AnalysisResult): AnalysisResult {
  if (analysis.topFeatures?.length && !analysis.geminiAnalysis?.most_important_features?.length) {
    return analysis
  }
  if (!analysis.geminiAnalysis?.most_important_features?.length) {
    return analysis
  }

  const topFeatures = analysis.geminiAnalysis.most_important_features.map((feature, index) =>
    geminiFeatureToRow(feature as Record<string, string>, index),
  )

  return { ...analysis, topFeatures }
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [planetImage, setPlanetImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [geminiPrompt, setGeminiPrompt] = useState<string | null>(null)

  useEffect(() => {
    const planetDataStr = searchParams.get("planetData")
    const analysisResultStr = searchParams.get("analysisResult")
    const source = searchParams.get("source")
    const error = searchParams.get("error")
    const geminiPromptParam = searchParams.get("geminiPrompt")

    if (geminiPromptParam) {
      setGeminiPrompt(geminiPromptParam)
    }

    if (planetDataStr) {
      const planetData = JSON.parse(planetDataStr)
      
      if (analysisResultStr) {
        // Use real Gemini analysis
        const analysisResult = normalizeAnalysisResult(JSON.parse(analysisResultStr) as AnalysisResult)
        setResult({
          ...analysisResult,
          planetData,
          source: source || "unknown",
        })
      } else {
        // Fallback to mock analysis
        const mockAnalysis = analyzePlanetData(planetData, source || "unknown")
        if (error) {
          mockAnalysis.explanation += ` (${error})`
        }
        setResult(mockAnalysis)
      }
    }
  }, [searchParams])

  // Auto-generate planet image when result is loaded
  useEffect(() => {
    if (result?.planetData && !planetImage && !isGeneratingImage) {
      generatePlanetImage()
    }
  }, [result, planetImage, isGeneratingImage])

  const generatePlanetImage = async () => {
    if (!result?.planetData) return

    setIsGeneratingImage(true)
    try {
      const image_url = buildPollinationsPlanetImageUrl(result.planetData as Record<string, unknown>)

      if (image_url) {
        setPlanetImage(image_url)
      } else {
        console.error('Failed to generate planet image')
      }
    } catch (error) {
      console.error('Error generating planet image:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 right-1/4 w-96 h-96 ${result.isExoplanet ? "bg-primary/10" : "bg-destructive/10"} rounded-full blur-[120px] animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 left-1/4 w-96 h-96 ${result.isExoplanet ? "bg-accent/10" : "bg-muted/10"} rounded-full blur-[120px] animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {!result.geminiAnalysis && (
          <p role="status" className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Demonstration results — feature impacts are derived from catalog parameters, not live Gemini or FITS model outputs.
          </p>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <Badge variant="outline" className="text-sm">
            Source: {result.source === "existing" ? "Existing Data" : "New Prediction"}
          </Badge>
        </div>

        {/* Main Result Card */}
        <Card
          className={`p-8 mb-8 border-4 ${result.isExoplanet ? "border-primary bg-primary/5" : "border-destructive bg-destructive/5"}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Result Icon */}
            <div className="flex-shrink-0">
              {result.isExoplanet ? (
                <CheckCircle2 className="w-32 h-32 text-primary animate-pulse" />
              ) : (
                <XCircle className="w-32 h-32 text-destructive animate-pulse" />
              )}
            </div>

            {/* Result Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl font-bold text-balance">
                  {result.isExoplanet ? (
                    <span className="text-primary">Exoplanet Detected!</span>
                  ) : (
                    <span className="text-destructive">Not an Exoplanet</span>
                  )}
                </h1>
                {/* Real Disposition for Kepler-442b */}
                {result.planetData?.orbital_period === "112.303136" && (
                  <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2">
                    <span className="text-green-400 font-semibold text-lg">Real Disposition: Confirmed</span>
                  </div>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-4">
                Confidence Level: <span className="font-bold text-foreground">{result.confidence}%</span>
              </p>
              <Progress value={result.confidence} className="h-3" />
            </div>
          </div>
        </Card>

        {/* AI Analysis and Image Generation */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Explanation */}
          <Card className="p-6 bg-card/50 backdrop-blur border-2 border-border">
            <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              AI Analysis
            </h2>
            <p className="text-foreground leading-relaxed">{result.explanation}</p>
            
            {/* Gemini Prompt Display */}
            {geminiPrompt && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Gemini Analysis Prompt
                </h3>
                <div className="text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto bg-black/20 p-3 rounded border border-gray-600/30">
                  {geminiPrompt}
                </div>
              </div>
            )}
          </Card>

          {/* AI Generated Exoplanet Image */}
          <Card className="p-6 bg-card/50 backdrop-blur border-2 border-border">
            <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
              <span className="text-2xl">🪐</span>
              AI Generated Exoplanet
            </h2>
            <div className="space-y-4">
              {planetImage ? (
                <div className="relative">
                  <img
                    src={planetImage}
                    alt="AI Generated Exoplanet Visualization"
                    className="w-full h-64 object-cover rounded-lg border border-border/50"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    AI Generated
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={generatePlanetImage}
                      disabled={isGeneratingImage}
                      size="sm"
                      variant="outline"
                      className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          🔄 Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center bg-background/30">
                  <div className="text-center">
                    {isGeneratingImage ? (
                      <>
                        <div className="text-4xl mb-4 animate-pulse">🪐</div>
                        <p className="text-muted-foreground mb-4">Generating AI visualization...</p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-muted-foreground">This may take a moment</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl mb-4">🪐</div>
                        <p className="text-muted-foreground mb-4">AI-generated visualization based on your data</p>
                        <Button
                          onClick={generatePlanetImage}
                          disabled={isGeneratingImage}
                          className="gap-2"
                        >
                          {isGeneratingImage ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              Generate Planet Image
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">
                AI-generated visualization based on Kepler dataset parameters
              </p>
            </div>
          </Card>
        </div>

        {/* Feature Impact Analysis */}
        <Card className="p-4 sm:p-5 bg-card/50 backdrop-blur border border-border mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary">Key Features Impact</h2>
          <div className="space-y-4 sm:space-y-6">
            {result.topFeatures.map((feature, index) => {
              const relevanceText =
                feature.relevanceLabel ?? `${feature.impact}% impact on classification`
              const relevanceLower = relevanceText.toLowerCase()
              const relevanceColor =
                relevanceLower.includes("very high") || relevanceLower.includes("critical")
                  ? "text-red-400"
                  : relevanceLower.includes("high")
                    ? "text-orange-400"
                    : relevanceLower.includes("medium") || relevanceLower.includes("moderate")
                      ? "text-yellow-400"
                      : "text-green-400"

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1 mt-1">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-foreground mb-1">{feature.name}</h3>
                      {feature.value !== undefined && feature.value !== "" && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium text-foreground/80">Value:</span> {feature.value}
                        </p>
                      )}
                      <p className="text-sm text-foreground leading-relaxed mb-2">{feature.reasoning}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Progress value={feature.impact} className="h-2 flex-1 min-w-[120px]" />
                        <p className={`font-medium ${relevanceColor}`}>
                          <span className="font-semibold">{feature.relevanceLabel ? "Relevance:" : "Demo weight:"}</span>{" "}
                          {relevanceText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/existing">
            <Button size="lg" variant="outline" className="gap-2 min-w-[200px] bg-transparent">
              <ArrowLeft className="w-5 h-5" />
              Explore Existing Planets
            </Button>
          </Link>
          <Link href="/new">
            <Button size="lg" className="gap-2 min-w-[200px] bg-primary hover:bg-primary/90">
              Create New Prediction
            </Button>
          </Link>
        </div>
      </div>
    </div>
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
