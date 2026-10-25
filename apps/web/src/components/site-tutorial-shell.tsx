"use client"

import { Suspense } from "react"
import { SiteTutorialButton } from "./site-tutorial"

export function SiteTutorialShell() {
  return (
    <Suspense fallback={null}>
      <SiteTutorialButton />
    </Suspense>
  )
}
