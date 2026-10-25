/** Split Gemini-style feature strings: "Transit Depth (615 ppm): explanation..." */
export function parseFeatureText(raw: string): { name: string; description: string } {
  let cleaned = raw.trim()
  cleaned = cleaned.replace(/^Feature\s+\d+:\s*/i, "")

  const colonIdx = cleaned.indexOf(":")
  if (colonIdx > 0 && colonIdx < 120) {
    return {
      name: cleaned.slice(0, colonIdx).trim(),
      description: cleaned.slice(colonIdx + 1).trim(),
    }
  }

  const parenMatch = cleaned.match(/^(.+?\([^)]+\))\s+([\s\S]+)$/)
  if (parenMatch) {
    return { name: parenMatch[1].trim(), description: parenMatch[2].trim() }
  }

  return {
    name: cleaned.length > 60 ? `${cleaned.slice(0, 57)}…` : cleaned || "Key indicator",
    description: cleaned,
  }
}
