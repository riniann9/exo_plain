"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Search, Telescope } from "lucide-react"
import type { PlanetData } from "@/types/planet"
import { isStaticDemo } from "@/lib/deployment"
import { analyzePlanetData } from "@/lib/analysis/demo"
import { catalogPlanetToFormData } from "@/lib/planet-to-form"
import { fetchPlanetAnalysis } from "@/lib/analyze-planet-client"
import { navigateToResults } from "@/lib/results-session"

type PlanetInfoPanelProps = {
  planet: PlanetData
  onClose: () => void
}

export function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  const [isDetecting, setIsDetecting] = useState(false)

  useEffect(() => {
    setIsDetecting(false)
  }, [planet.id])

  const handleDetect = async () => {
    setIsDetecting(true)

    const planetFormData = catalogPlanetToFormData(planet)

    try {
      if (!isStaticDemo) {
        const analysisResult = await fetchPlanetAnalysis({
          planetData: planetFormData,
          catalogFeatures: planet.features,
          planetName: planet.name,
        })
        navigateToResults({
          planetData: planetFormData,
          analysisResult,
          source: "existing",
          geminiPrompt: planet.gemini_prompt,
        })
        return
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI analysis failed"
      if (!isStaticDemo) {
        alert(
          `Gemini analysis could not complete.\n\n${message}\n\nWait a minute and try again. If this keeps happening, check your API key on Cloudflare.`,
        )
        setIsDetecting(false)
        return
      }
    }

    const analysisResult = analyzePlanetData(planet, "existing", planet.name)
    analysisResult.planetData = planetFormData
    navigateToResults({
      planetData: planetFormData,
      analysisResult,
      source: "existing",
      geminiPrompt: planet.gemini_prompt,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <Card
        className="w-full max-w-lg bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 overflow-hidden"
        data-tour="planet-panel"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/30 bg-black/20">
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {planet.name}
              </h2>
              <p className="text-sm text-cyan-200 mt-1">Exoplanet ID: {planet.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isDetecting}
              className="text-cyan-100 hover:text-white hover:bg-cyan-500/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center p-10 text-center min-h-[320px]">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500/40">
              <Telescope className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Detection Required</h3>
            <p className="text-cyan-200 max-w-sm text-sm mb-8">
              Run a Gemini-powered scan on this planet. Results open on the same page as Predict New Data.
            </p>

            <Button
              onClick={handleDetect}
              disabled={isDetecting}
              className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-6 py-3 text-base shadow-lg shadow-cyan-500/30"
              size="lg"
            >
              {isDetecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI Detecting...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  AI Detection
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
