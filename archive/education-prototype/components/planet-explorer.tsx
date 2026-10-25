"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Thermometer, Ruler, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Disposition = "confirmed" | "candidate" | "false-positive"

interface Planet {
  id: string
  name: string
  disposition: Disposition
  starName: string
  radius: number // Earth radii
  orbitalPeriod?: number // days
  temperature?: number // Kelvin
  color: string
  description: string
  gemini_prompt: string
}

const samplePlanets: Planet[] = [
  {
    id: "1",
    name: "Kepler-442b",
    disposition: "confirmed",
    starName: "Kepler-442",
    radius: 1.34,
    orbitalPeriod: 112.3,
    temperature: 233,
    color: "#4a90e2",
    description: "A potentially habitable super-Earth in the habitable zone of its star.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 1.00005 - std: 0.000581622 - min: 0.99853 - max: 1.00656 - median: 0.999987 - q10: 0.999358 - q25: 0.99962 - q75: 1.00046 - q90: 1.00081 - dips_1sigma: 321 - dips_2sigma: 16 - dips_3sigma: 0 - peaks_1sigma: 351 - peaks_2sigma: 36 - transit_depth_1sigma: 0.000691365 - transit_depth_2sigma: 0.000429008 - transit_depth_min: 0.0015194 - variance: 3.38284e-07 - rmse: 0.000581622 - skewness: 1.01713 - kurtosis: 10.6376 - dominant_freq: 0.000976562 - dominant_power: 0.454082 - spectral_centroid: 0.184661 - low_freq_power: 6.03937 - mid_freq_power: 4.19434 - high_freq_power: 4.79541 - rolling_mean_mean: 1.00005 - rolling_mean_std: 0.000461452 - rolling_mean_min: 0.999293 - rolling_mean_max: 1.001 - trend_slope: 5.85673e-08 - r_squared: 0.00354411 - autocorr_lag1: 2.95639e+06 - autocorr_lag5: 2.9564e+06 - autocorr_lag10: 2.95639e+06 - periodicity_strength: 6.05468e+09",
  },
  {
    id: "2",
    name: "Kepler-660b",
    disposition: "confirmed",
    starName: "Kepler-660",
    radius: 1.67,
    orbitalPeriod: 11.1,
    temperature: 326,
    color: "#5ba3d0",
    description: "An ocean world candidate with a thick water layer.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 0.999985 - std: 0.000505673 - min: 0.998047 - max: 1.00174 - median: 1 - q10: 0.999323 - q25: 0.999639 - q75: 1.00034 - q90: 1.00063 - dips_1sigma: 329 - dips_2sigma: 43 - dips_3sigma: 7 - peaks_1sigma: 324 - peaks_2sigma: 39 - transit_depth_1sigma: 0.000662359 - transit_depth_2sigma: 0.000346737 - transit_depth_min: 0.00193807 - variance: 2.55705e-07 - rmse: 0.000505673 - skewness: -0.145867 - kurtosis: 3.05632 - dominant_freq: 0.000976562 - dominant_power: 0.434151 - spectral_centroid: 0.178797 - low_freq_power: 6.31078 - mid_freq_power: 3.77863 - high_freq_power: 4.46777 - rolling_mean_mean: 0.999995 - rolling_mean_std: 0.000366151 - rolling_mean_min: 0.999241 - rolling_mean_max: 1.00075 - trend_slope: -6.90474e-09 - r_squared: 6.51679e-05 - autocorr_lag1: 3.91064e+06 - autocorr_lag5: 3.91065e+06 - autocorr_lag10: 3.91065e+06 - periodicity_strength: 8.009e+09",
  },
  {
    id: "3",
    name: "Kepler-227b",
    disposition: "candidate",
    starName: "Kepler-227",
    radius: 2.1,
    temperature: 415,
    color: "#f4a261",
    description: "A Neptune-sized candidate awaiting confirmation through additional observations.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 1.00014 - std: 0.00116202 - min: 0.997449 - max: 1.00387 - median: 0.999978 - q10: 0.998725 - q25: 0.999397 - q75: 1.00076 - q90: 1.00175 - dips_1sigma: 284 - dips_2sigma: 15 - dips_3sigma: 0 - peaks_1sigma: 354 - peaks_2sigma: 93 - transit_depth_1sigma: 0.00141728 - transit_depth_2sigma: 0.000744931 - transit_depth_min: 0.00269336 - variance: 1.35029e-06 - rmse: 0.00116202 - skewness: 0.512616 - kurtosis: 3.15558 - dominant_freq: 0.000488281 - dominant_power: 0.979019 - spectral_centroid: 0.146335 - low_freq_power: 10.7394 - mid_freq_power: 4.35787 - high_freq_power: 5.02915 - rolling_mean_mean: 1.00015 - rolling_mean_std: 0.00108019 - rolling_mean_min: 0.998174 - rolling_mean_max: 1.00282 - trend_slope: -5.61284e-08 - r_squared: 0.000815485 - autocorr_lag1: 740791 - autocorr_lag5: 740787 - autocorr_lag10: 740785 - periodicity_strength: 1.51714e+09",
  },
  {
    id: "4",
    name: "Kepler-664b",
    disposition: "candidate",
    starName: "Kepler-664",
    radius: 0.89,
    temperature: 278,
    color: "#e76f51",
    description: "An Earth-sized candidate in the habitable zone requiring further validation.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 0.999855 - std: 0.00138774 - min: 0.995327 - max: 1.01925 - median: 1.00004 - q10: 0.998063 - q25: 0.99897 - q75: 1.00083 - q90: 1.00142 - dips_1sigma: 314 - dips_2sigma: 58 - dips_3sigma: 8 - peaks_1sigma: 287 - peaks_2sigma: 2 - transit_depth_1sigma: 0.00179267 - transit_depth_2sigma: 0.000885354 - transit_depth_min: 0.00452849 - variance: 1.92581e-06 - rmse: 0.00138774 - skewness: 0.815795 - kurtosis: 21.1899 - dominant_freq: 0.00244141 - dominant_power: 1.1072 - spectral_centroid: 0.198874 - low_freq_power: 12.902 - mid_freq_power: 6.34177 - high_freq_power: 12.5489 - rolling_mean_mean: 0.99985 - rolling_mean_std: 0.0011814 - rolling_mean_min: 0.996283 - rolling_mean_max: 1.00189 - trend_slope: 1.24286e-07 - r_squared: 0.00280354 - autocorr_lag1: 519111 - autocorr_lag5: 519111 - autocorr_lag10: 519111 - periodicity_strength: 1.06314e+09",
  },
  {
    id: "5",
    name: "Kepler-228b",
    disposition: "false-positive",
    starName: "Kepler-228",
    radius: 3.2,
    color: "#c44536",
    description: "Identified as an eclipsing binary star system, not a planetary transit.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 1.00005 - std: 0.0010514 - min: 0.996665 - max: 1.03695 - median: 1.00002 - q10: 0.999341 - q25: 0.999647 - q75: 1.00037 - q90: 1.00075 - dips_1sigma: 69 - dips_2sigma: 8 - dips_3sigma: 1 - peaks_1sigma: 86 - peaks_2sigma: 7 - transit_depth_1sigma: 0.000711879 - transit_depth_2sigma: 0.000405553 - transit_depth_min: 0.00338758 - variance: 1.10545e-06 - rmse: 0.0010514 - skewness: 21.7348 - kurtosis: 746.607 - dominant_freq: 0.00195312 - dominant_power: 0.220756 - spectral_centroid: 0.240927 - low_freq_power: 12.6685 - mid_freq_power: 10.4941 - high_freq_power: 21.3783 - rolling_mean_mean: 1.00006 - rolling_mean_std: 0.000293893 - rolling_mean_min: 0.999092 - rolling_mean_max: 1.00191 - trend_slope: 1.84027e-08 - r_squared: 0.000107078 - autocorr_lag1: 904705 - autocorr_lag5: 904706 - autocorr_lag10: 904706 - periodicity_strength: 1.85284e+09",
  },
  {
    id: "6",
    name: "Kepler-229b",
    disposition: "confirmed",
    starName: "Kepler-229",
    radius: 0.92,
    orbitalPeriod: 6.1,
    temperature: 251,
    color: "#2a9d8f",
    description: "One of seven Earth-sized planets orbiting an ultra-cool dwarf star.",
    gemini_prompt: "Analyze the following light-curve feature summary and determine if it suggests an exoplanet transit. Provide a concise, human-readable explanation of the exoplanet with: a one-line assessment, a confidence (Low/Medium/High), and 3–5 bullet points highlighting notable features. Detected columns: time=TIME, flux=PDCSAP_FLUX Resampled length: 2048 Features (labeled): - mean: 1.00004 - std: 0.00122607 - min: 0.993651 - max: 1.00401 - median: 0.999997 - q10: 0.998636 - q25: 0.999256 - q75: 1.00074 - q90: 1.00148 - dips_1sigma: 281 - dips_2sigma: 24 - dips_3sigma: 15 - peaks_1sigma: 270 - peaks_2sigma: 82 - transit_depth_1sigma: 0.00140444 - transit_depth_2sigma: 0.000784089 - transit_depth_min: 0.00638902 - variance: 1.50324e-06 - rmse: 0.00122607 - skewness: -0.110464 - kurtosis: 5.39968 - dominant_freq: 0.000976562 - dominant_power: 1.1545 - spectral_centroid: 0.152251 - low_freq_power: 14.3452 - mid_freq_power: 5.94242 - high_freq_power: 6.81259 - rolling_mean_mean: 1.00004 - rolling_mean_std: 0.00106078 - rolling_mean_min: 0.997911 - rolling_mean_max: 1.0034 - trend_slope: -9.77599e-08 - r_squared: 0.00222215 - autocorr_lag1: 665285 - autocorr_lag5: 665283 - autocorr_lag10: 665278 - periodicity_strength: 1.3625e+09",
  },
]

export function PlanetExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "size" | "orbit" | "temperature">("overview")

  const getDispositionColor = (disposition: Disposition) => {
    switch (disposition) {
      case "confirmed":
        return "bg-success text-success-foreground"
      case "candidate":
        return "bg-warning text-warning-foreground"
      case "false-positive":
        return "bg-destructive text-destructive-foreground"
    }
  }

  const getDispositionLabel = (disposition: Disposition) => {
    switch (disposition) {
      case "confirmed":
        return "Confirmed"
      case "candidate":
        return "Candidate"
      case "false-positive":
        return "False Positive"
    }
  }

  const handleShare = (planet: Planet) => {
    alert(`Shared discovery: ${planet.name} - ${getDispositionLabel(planet.disposition)} exoplanet!`)
  }

  if (selectedPlanet && viewMode !== "overview") {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="bg-card/50 backdrop-blur border-border overflow-hidden">
          <div className="relative h-[500px] bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center">
            <Button
              onClick={() => setViewMode("overview")}
              variant="outline"
              size="sm"
              className="absolute top-4 left-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {viewMode === "size" && (
              <div className="text-center">
                <div
                  className="mx-auto rounded-full mb-8 relative"
                  style={{
                    width: `${Math.min(selectedPlanet.radius * 100, 300)}px`,
                    height: `${Math.min(selectedPlanet.radius * 100, 300)}px`,
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 60px ${selectedPlanet.color}80`,
                  }}
                >
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full">
                    <div className="h-1 bg-primary relative">
                      <div className="absolute -left-2 -top-2 w-1 h-5 bg-primary" />
                      <div className="absolute -right-2 -top-2 w-1 h-5 bg-primary" />
                    </div>
                  </div>
                </div>
                <div className="mt-16">
                  <p className="text-2xl font-bold text-foreground mb-2">
                    {selectedPlanet.radius.toFixed(2)} Earth Radii
                  </p>
                  <p className="text-muted-foreground">Diameter: {(selectedPlanet.radius * 2 * 6371).toFixed(0)} km</p>
                </div>
              </div>
            )}

            {viewMode === "orbit" && (
              <div className="text-center">
                <div className="relative w-[400px] h-[400px] mx-auto mb-8">
                  {/* Star */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-yellow-400 animate-pulse" />

                  {/* Orbit path */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-dashed border-primary/30 rounded-full" />

                  {/* Planet */}
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full animate-spin"
                    style={{
                      width: `${Math.min(selectedPlanet.radius * 20, 40)}px`,
                      height: `${Math.min(selectedPlanet.radius * 20, 40)}px`,
                      backgroundColor: selectedPlanet.color,
                      marginLeft: "150px",
                      marginTop: `-${Math.min(selectedPlanet.radius * 10, 20)}px`,
                      animationDuration: `${Math.min(selectedPlanet.orbitalPeriod! / 10, 8)}s`,
                    }}
                  />
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">
                  Orbital Period: {selectedPlanet.orbitalPeriod?.toFixed(1)} days
                </p>
                <p className="text-muted-foreground">One complete orbit around {selectedPlanet.starName}</p>
              </div>
            )}

            {viewMode === "temperature" && (
              <div className="text-center">
                <div
                  className="w-64 h-64 rounded-full mx-auto mb-8 relative flex items-center justify-center"
                  style={{
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 80px ${selectedPlanet.color}80`,
                  }}
                >
                  {/* Temperature arrows animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-4">
                      <div className="flex gap-4 animate-pulse">
                        <div className="w-12 h-1 bg-red-500 rounded" />
                        <div className="w-12 h-1 bg-blue-500 rounded" />
                      </div>
                      <div className="flex gap-4 animate-pulse" style={{ animationDelay: "0.5s" }}>
                        <div className="w-12 h-1 bg-red-500 rounded" />
                        <div className="w-12 h-1 bg-blue-500 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {selectedPlanet.temperature}K ({(selectedPlanet.temperature! - 273).toFixed(0)}°C)
                </p>
                <p className="text-muted-foreground">Equilibrium temperature at the surface</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  if (selectedPlanet) {
    return (
      <div className="max-w-6xl mx-auto">
        <Button onClick={() => setSelectedPlanet(null)} variant="outline" size="sm" className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to All Planets
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Planet Visualization */}
          <Card className="bg-card/50 backdrop-blur border-border overflow-hidden">
            <div className="relative h-[400px] bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center">
              <div
                className="w-48 h-48 rounded-full animate-pulse"
                style={{
                  backgroundColor: selectedPlanet.color,
                  boxShadow: `0 0 100px ${selectedPlanet.color}80`,
                }}
              />
            </div>
          </Card>

          {/* Planet Details */}
          <div className="space-y-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-card-foreground mb-2">{selectedPlanet.name}</h2>
                  <p className="text-muted-foreground">Orbiting {selectedPlanet.starName}</p>
                </div>
                <Badge className={cn("text-sm", getDispositionColor(selectedPlanet.disposition))}>
                  {getDispositionLabel(selectedPlanet.disposition)}
                </Badge>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{selectedPlanet.description}</p>

              <Button onClick={() => handleShare(selectedPlanet)} variant="outline" className="w-full gap-2">
                <Share2 className="w-4 h-4" />
                Share Discovery
              </Button>
            </Card>

            {/* Property Cards */}
            <div className="space-y-3">
              <Card
                className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setViewMode("size")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-semibold text-card-foreground">{selectedPlanet.radius.toFixed(2)} Earth Radii</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                </div>
              </Card>

              {selectedPlanet.orbitalPeriod && (
                <Card
                  className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setViewMode("orbit")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Orbital Period</p>
                      <p className="font-semibold text-card-foreground">
                        {selectedPlanet.orbitalPeriod.toFixed(1)} days
                      </p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Card>
              )}

              {selectedPlanet.temperature && (
                <Card
                  className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setViewMode("temperature")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Equilibrium Temperature</p>
                      <p className="font-semibold text-card-foreground">
                        {selectedPlanet.temperature}K ({(selectedPlanet.temperature - 273).toFixed(0)}°C)
                      </p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {samplePlanets.map((planet) => (
          <Card
            key={planet.id}
            className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
            onClick={() => setSelectedPlanet(planet)}
          >
            <div className="relative h-48 bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center overflow-hidden">
              <div
                className="w-24 h-24 rounded-full group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: `0 0 40px ${planet.color}60`,
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-card-foreground">{planet.name}</h3>
                <Badge className={cn("text-xs", getDispositionColor(planet.disposition))}>
                  {getDispositionLabel(planet.disposition)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{planet.starName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Ruler className="w-3 h-3" />
                <span>{planet.radius.toFixed(2)} R⊕</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
