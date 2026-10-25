"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

const STAR_COUNT = 150

function unit(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function starStyle(index: number): CSSProperties {
  const a = unit(index + 1)
  const b = unit(index + 101)
  const c = unit(index + 202)
  const d = unit(index + 303)
  const e = unit(index + 404)
  return {
    width: `${(a * 3).toFixed(3)}px`,
    height: `${(b * 3).toFixed(3)}px`,
    top: `${(c * 100).toFixed(3)}%`,
    left: `${(d * 100).toFixed(3)}%`,
    opacity: Number((b * 0.7 + 0.3).toFixed(4)),
    animationName: "twinkle",
    animationDuration: `${(e * 3 + 2).toFixed(3)}s`,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDelay: `${(a * 2).toFixed(3)}s`,
  }
}

/** Decorative stars — client-only so SSR never serializes inline styles differently. */
export function HomeStarfield() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="stars-container" aria-hidden>
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={starStyle(i)} />
      ))}
    </div>
  )
}
