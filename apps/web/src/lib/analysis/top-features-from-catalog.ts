export type CatalogFeatureRow = {
  name: string
  impact: number
  value: string
  reasoning: string
}

function parseNum(value: unknown): number | null {
  const n = Number.parseFloat(String(value ?? ""))
  return Number.isFinite(n) ? n : null
}

function radiusClass(r: number): { label: string; reasoning: string } {
  if (r < 0.8) return { label: "sub-Earth", reasoning: "Radius below Earth scale often indicates a small rocky or irradiated body." }
  if (r <= 1.5) return { label: "Earth-like rocky scale", reasoning: "Radius near 1 R⊕ is consistent with a terrestrial or super-Earth regime." }
  if (r <= 2.5) return { label: "super-Earth / mini-Neptune transition", reasoning: "Radius in this range may be rocky with a thick atmosphere or a volatile-rich mini-Neptune." }
  if (r <= 4) return { label: "Neptune-like", reasoning: "Several Earth radii typically indicates a gas-rich ice giant or mini-Neptune, not a rocky world." }
  return { label: "gas-giant scale", reasoning: "Large radius strongly favors a hydrogen/helium-dominated giant rather than a rocky planet." }
}

function tempClass(k: number): string {
  if (k < 200) return "Cold surface equilibrium; ice-dominated conditions."
  if (k < 280) return "Temperate equilibrium temperature relative to Earth-like climates."
  if (k < 400) return "Warm equilibrium; closer to desert or hot-sub-Neptune conditions."
  if (k < 800) return "High equilibrium temperature; unlikely for surface liquid water."
  return "Extreme equilibrium heat; atmosphere may be highly inflated or stripped."
}

/** Demo feature list derived from catalog / form fields (not ML importances). */
export function buildTopFeaturesFromCatalog(
  features: Record<string, unknown>,
  planetName?: string,
): CatalogFeatureRow[] {
  const label = planetName ?? "This target"
  const radius = parseNum(features.planet_radius) ?? parseNum(features.planetary_radius)
  const period = parseNum(features.orbital_period)
  const eqTemp = parseNum(features.equilibrium_temperature)
  const insolation = parseNum(features.insolation_flux)
  const habitability = parseNum(features.habitability_score)
  const detection = String(features.detection_method ?? "Transit")
  const atmosphere = String(features.atmospheric_composition ?? "").trim()
  const semiMajor = parseNum(features.semi_major_axis)

  const rows: Array<CatalogFeatureRow & { weight: number }> = []

  if (radius != null) {
    const rc = radiusClass(radius)
    rows.push({
      name: "Planetary radius",
      value: `${radius} R⊕`,
      reasoning: `${rc.reasoning} Class: ${rc.label}.`,
      impact: 0,
      weight: radius > 2 ? 28 : 22,
    })
  }

  rows.push({
    name: "Detection method",
    value: detection,
    reasoning:
      detection.toLowerCase() === "transit"
        ? "Periodic dimming of the host star supports a transiting companion interpretation when other false-positive checks pass."
        : `${detection} provides the primary discovery channel; consistency with other parameters affects confidence.`,
    impact: 0,
    weight: 26,
  })

  if (period != null) {
    rows.push({
      name: "Orbital period",
      value: `${period} days`,
      reasoning:
        period < 100
          ? "Short-period orbit yields repeated transits and tighter constraints on planet–star geometry."
          : "Longer period reduces transit cadence but can still support confirmation with sufficient observations.",
      impact: 0,
      weight: 18,
    })
  }

  if (eqTemp != null) {
    rows.push({
      name: "Equilibrium temperature",
      value: `${eqTemp} K`,
      reasoning: tempClass(eqTemp),
      impact: 0,
      weight: 16,
    })
  }

  if (insolation != null) {
    rows.push({
      name: "Insolation flux",
      value: `${insolation}× Earth`,
      reasoning:
        insolation > 2
          ? "High stellar flux increases equilibrium temperature and can drive atmospheric escape or inflation."
          : insolation < 0.5
            ? "Low insolation favors colder equilibrium states and frost-line chemistry."
            : "Insolation near Earth-like levels allows temperate equilibrium scenarios.",
      impact: 0,
      weight: 12,
    })
  }

  if (habitability != null) {
    rows.push({
      name: "Habitability index (catalog)",
      value: habitability.toFixed(2),
      reasoning:
        habitability >= 0.6
          ? `${label} scores relatively high on this demo habitability index (not a NASA disposition).`
          : habitability >= 0.3
            ? "Moderate demo habitability; surface conditions may still be challenging."
            : "Low demo habitability — often driven by temperature, insolation, or composition flags in the catalog.",
      impact: 0,
      weight: 10,
    })
  }

  if (atmosphere) {
    const binaryHint = /binary|false positive|blend/i.test(atmosphere)
    rows.push({
      name: "Composition / atmosphere (catalog)",
      value: atmosphere.length > 48 ? `${atmosphere.slice(0, 45)}…` : atmosphere,
      reasoning: binaryHint
        ? "Catalog notes suggest checking for blended or eclipsing-binary false positives before treating transits as planetary."
        : "Reported composition/context from the showcase catalog informs interpretation of radius and temperature.",
      impact: 0,
      weight: binaryHint ? 24 : 8,
    })
  }

  if (semiMajor != null) {
    rows.push({
      name: "Semi-major axis",
      value: `${semiMajor} AU`,
      reasoning: "Orbital distance sets expected insolation and equilibrium temperature for the system.",
      impact: 0,
      weight: 8,
    })
  }

  const top = rows.sort((a, b) => b.weight - a.weight).slice(0, 5)
  const totalWeight = top.reduce((s, r) => s + r.weight, 0) || 1
  return top.map((r) => ({
    name: r.name,
    value: r.value,
    reasoning: r.reasoning,
    impact: Math.max(5, Math.round((r.weight / totalWeight) * 100)),
  }))
}
