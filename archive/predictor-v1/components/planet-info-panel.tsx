"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Sparkles } from "lucide-react"
import type { PlanetData } from "@/app/existing/page"
import { Planet3DViewer } from "./planet-3d-viewer"
import { ScrollArea } from "@/components/ui/scroll-area"

type PlanetInfoPanelProps = {
  planet: PlanetData
  onClose: () => void
  onAnalyze: (planet: PlanetData) => void
}

export function PlanetInfoPanel({ planet, onClose, onAnalyze }: PlanetInfoPanelProps) {
  const features = Object.entries(planet.features).map(([key, value]) => ({
    label: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value: typeof value === "boolean" ? (value ? "Yes" : "No") : value,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <Card className="w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/30 bg-black/20">
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {planet.name}
              </h2>
              <p className="text-sm text-cyan-200 mt-1">Exoplanet ID: {planet.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-cyan-100 hover:text-white hover:bg-cyan-500/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6 h-full">
              {/* Left: 3D Planet Viewer */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 bg-black/40 rounded-lg border border-cyan-500/30 overflow-hidden shadow-inner shadow-cyan-500/10">
                  <Planet3DViewer color={planet.color} size={planet.size} />
                </div>
                <Button
                  onClick={() => onAnalyze(planet)}
                  className="w-full gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze with AI
                </Button>
              </div>

              {/* Right: Features List */}
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-white">Planet Features</h3>
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-black/40 transition-all"
                      >
                        <span className="text-sm font-medium text-cyan-200">{feature.label}</span>
                        <span className="text-sm font-semibold text-white">{feature.value}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
