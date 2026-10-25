function hashSeed(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function buildPollinationsUrlFromPlanetData(planetData: Record<string, unknown>): string {
  const temp = Number.parseFloat(String(planetData.equilibrium_temperature ?? "")) || 250
  const radius =
    Number.parseFloat(String(planetData.planetary_radius ?? planetData.planet_radius ?? "")) || 1
  const hasRings = planetData.ring_system === true || planetData.ring_system === "true"

  let description = "scientific illustration of exoplanet,"
  if (temp < 200) description += " frozen ice world,"
  else if (temp < 300) description += " earth-like blue green,"
  else if (temp < 500) description += " desert orange,"
  else description += " lava red glow,"
  if (radius > 3) description += " gas giant,"
  else if (radius > 1.5) description += " super earth,"
  if (hasRings) description += " ring system,"
  description += " space stars photorealistic no text"

  const seed = hashSeed(`${description}-${radius}-${temp}`)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(description)}?width=512&height=512&seed=${seed}`
}
