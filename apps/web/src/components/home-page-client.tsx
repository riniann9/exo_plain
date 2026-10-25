"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Database } from "lucide-react"
import { HomeStarfield } from "./home-starfield"

export function HomePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1f] via-[#1a0a2e] to-[#0f0520]" />

      <div className="absolute inset-0 overflow-hidden">
        <HomeStarfield />

        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4 animate-float" data-tour="home-title">
            <h1 className="text-6xl md:text-8xl font-bold text-balance text-white drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
              Exo-Plain
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 text-balance drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
              Discover and analyze exoplanets using advanced AI prediction models
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link href="/existing" data-tour="explore-existing">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-6 text-lg h-auto min-w-[280px] shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all border border-cyan-400/30"
              >
                <div className="flex flex-col items-center gap-2">
                  <Database className="w-8 h-8" />
                  <span className="font-semibold">Explore Existing Data</span>
                  <span className="text-sm opacity-90">Analyze known exoplanets</span>
                </div>
              </Button>
            </Link>

            <Link href="/new" data-tour="predict-new">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 text-lg h-auto min-w-[280px] shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all border border-purple-400/30"
              >
                <div className="flex flex-col items-center gap-2">
                  <Rocket className="w-8 h-8" />
                  <span className="font-semibold">Predict New Data</span>
                  <span className="text-sm opacity-90">Input custom planet features</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
