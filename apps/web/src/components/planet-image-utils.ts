function hashSeed(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

function featureBag(planetData: Record<string, unknown>): Record<string, unknown> {
  if (planetData.features && typeof planetData.features === "object") {
    return planetData.features as Record<string, unknown>
  }
  return planetData
}

export function generatePlanetImageQuery(planetData: Record<string, unknown>): string {
  const features = featureBag(planetData)
  const name =
    typeof planetData.name === "string"
      ? planetData.name
      : typeof planetData.id === "string"
        ? planetData.id
        : "exoplanet"

  const temp = Number.parseFloat(String(features.equilibrium_temperature ?? "")) || 250
  const radius =
    Number.parseFloat(String(features.planet_radius ?? features.planetary_radius ?? "")) || 1
  const hasRings = features.ring_system === true || features.ring_system === "true"
  const atmosphere = String(features.atmospheric_composition ?? "").trim()

  let description = `scientific illustration of exoplanet ${name},`

  if (temp < 200) {
    description += " frozen ice world, pale blue white clouds,"
  } else if (temp < 300) {
    description += " earth-like blue green oceans and continents,"
  } else if (temp < 500) {
    description += " arid orange desert storms,"
  } else {
    description += " molten lava glow, red orange surface,"
  }

  if (radius > 3) {
    description += " large gas giant bands,"
  } else if (radius > 1.5) {
    description += " super-earth rocky surface,"
  } else {
    description += " rocky terrestrial surface,"
  }

  if (hasRings) {
    description += " prominent Saturn-like ring system,"
  }

  if (atmosphere) {
    description += ` atmosphere hint ${atmosphere.slice(0, 60)},`
  }

  description += " deep space starfield, photorealistic, NASA art style, no text"

  return description
}

export function buildPollinationsPlanetImageUrl(planetData: Record<string, unknown>): string {
  const query = generatePlanetImageQuery(planetData)
  const seed = hashSeed(
    `${query}-${String(planetData.orbital_period ?? "")}-${String(planetData.planetary_radius ?? planetData.planet_radius ?? "")}`,
  )
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=512&height=512&seed=${seed}`
}
