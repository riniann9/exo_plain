"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { siteUrl } from "@/lib/deployment"
import { usePathname, useSearchParams } from "next/navigation"

type TourStep = {
  route: string
  selector?: string
  title: string
  body: string
}

const TOUR_STEPS: TourStep[] = [
  {
    route: "/",
    selector: "[data-tour='home-title']",
    title: "Welcome to Exo-Plain",
    body: "This site lets you explore known Kepler-style exoplanets or enter your own parameters for a demonstration analysis.",
  },
  {
    route: "/",
    selector: "[data-tour='explore-existing']",
    title: "Explore Existing Data",
    body: "Open the 3D galaxy map, click a planet, and review catalog features before running analysis.",
  },
  {
    route: "/",
    selector: "[data-tour='predict-new']",
    title: "Predict New Data",
    body: "Fill in orbital and stellar fields (or use Prefill Example) to see how inputs change results.",
  },
  {
    route: "/existing",
    selector: "[data-tour='galaxy-hint']",
    title: "Galaxy Explorer",
    body: "Drag to orbit the scene, zoom, and click a planet. The info panel loads real catalog values and a 3D preview.",
  },
  {
    route: "/new",
    selector: "[data-tour='new-form']",
    title: "Custom prediction form",
    body: "Submit once to view results. On GitHub Pages this uses demonstration logic unless you connect a backend API.",
  },
]

function stepIndexFromParam(raw: string | null): number {
  if (!raw) return -1
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 && n < TOUR_STEPS.length ? n : -1
}

export function SiteTutorialButton() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const syncFromUrl = useCallback(() => {
    const idx = stepIndexFromParam(searchParams.get("tour"))
    if (idx >= 0) {
      setActive(true)
      setStepIndex(idx)
    }
  }, [searchParams])

  useEffect(() => {
    syncFromUrl()
  }, [syncFromUrl, pathname])

  const startTour = () => {
    window.location.href = siteUrl("/?tour=0")
  }

  const closeTour = () => {
    setActive(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("tour")
    window.history.replaceState({}, "", url.pathname + url.search)
  }

  const goStep = (next: number) => {
    const step = TOUR_STEPS[next]
    if (!step) {
      closeTour()
      return
    }
    window.location.href = siteUrl(`${step.route}?tour=${next}`)
  }

  if (!active) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={startTour}
        className="fixed bottom-4 right-4 z-50 bg-black/50 border-cyan-500/40 text-cyan-100 hover:bg-black/70 text-xs"
        data-tour="tutorial-button"
      >
        Tutorial
      </Button>
    )
  }

  const step = TOUR_STEPS[stepIndex]
  if (!step) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] max-w-sm rounded-lg border border-cyan-500/40 bg-slate-950/95 p-4 shadow-xl text-cyan-50">
      <p className="text-xs text-cyan-300 mb-1">
        Step {stepIndex + 1} of {TOUR_STEPS.length}
      </p>
      <h3 className="font-semibold text-white mb-2">{step.title}</h3>
      <p className="text-sm text-cyan-100/90 mb-4">{step.body}</p>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={closeTour}>
          Close
        </Button>
        {stepIndex > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={() => goStep(stepIndex - 1)}>
            Back
          </Button>
        )}
        <Button type="button" size="sm" onClick={() => goStep(stepIndex + 1)}>
          {stepIndex + 1 >= TOUR_STEPS.length ? "Done" : "Next"}
        </Button>
      </div>
    </div>
  )
}
