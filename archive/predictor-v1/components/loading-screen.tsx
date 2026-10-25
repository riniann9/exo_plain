"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin"
              style={{
                animationDuration: `${2 + i}s`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div
                className="absolute w-3 h-3 bg-primary rounded-full"
                style={{
                  top: "50%",
                  left: "100%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          ))}

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">Analyzing Planet Data</h2>
          <p className="text-muted-foreground">AI model is processing exoplanet features{dots}</p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
