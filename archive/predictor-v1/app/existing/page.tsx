"use client"

import { useState } from "react"
import { GalaxyMap } from "@/components/galaxy-map"
import { PlanetInfoPanel } from "@/components/planet-info-panel"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export type PlanetData = {
  id: string
  name: string
  position: [number, number, number]
  color: string
  size: number
  features: {
    orbital_period: number
    planet_radius: number
    planet_mass: number
    semi_major_axis: number
    eccentricity: number
    inclination: number
    stellar_mass: number
    stellar_radius: number
    stellar_temperature: number
    stellar_luminosity: number
    distance_from_earth: number
    discovery_year: number
    detection_method: string
    equilibrium_temperature: number
    insolation_flux: number
    density: number
    surface_gravity: number
    escape_velocity: number
    albedo: number
    atmospheric_composition: string
    magnetic_field_strength: number
    rotation_period: number
    axial_tilt: number
    number_of_moons: number
    ring_system: boolean
    habitability_score: number
  }
}


export default function ExistingPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async (planet: PlanetData) => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Navigate to results with planet data
    const params = new URLSearchParams({
      planetData: JSON.stringify(planet),
      source: "existing",
    })
    window.location.href = `/results?${params.toString()}`
  }

  if (isAnalyzing) {
    return <LoadingScreen />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Space background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1f] via-[#1a0a2e] to-[#0f0520]" />

      {/* Back button with better visibility */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-black/60 backdrop-blur-md border-cyan-500/50 text-cyan-100 hover:bg-black/80 hover:border-cyan-400 hover:text-white transition-all shadow-lg shadow-cyan-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Title with better visibility */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">Galaxy Explorer</h1>
        <p className="text-sm text-cyan-200 mt-1 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
          Zoom in and click on planets to explore
        </p>
      </div>

      {/* Full screen Galaxy Map */}
      <div className="absolute inset-0">
        <GalaxyMap onPlanetSelect={setSelectedPlanet} selectedPlanet={selectedPlanet} />
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <PlanetInfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} onAnalyze={handleAnalyze} />
      )}
    </div>
  )
}
