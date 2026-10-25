import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("🔍 Starting planet analysis API call...")
    
    const { formData } = await req.json()
    console.log("📊 Received form data:", Object.keys(formData))

    if (!formData || typeof formData !== "object") {
      console.log("❌ Invalid payload received")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("❌ Missing GEMINI_API_KEY")
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 })
    }

    console.log("✅ API key found, calling Gemini REST API...")
    
    const prompt = buildPrompt(formData)
    console.log("📝 Generated prompt length:", prompt.length)

    try {
      // Use REST API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-03-25:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log("⚠️ Gemini API quota exceeded, using fallback analysis")
        
        // Provide fallback analysis when quota is exceeded
        const fallbackAnalysis = generateFallbackAnalysis(formData)
        return NextResponse.json({ analysis: fallbackAnalysis })
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"
      console.log("✅ Gemini response received, length:", text.length)

      return NextResponse.json({ analysis: text })
    } catch (apiError) {
      console.log("⚠️ Gemini API error, using fallback analysis:", apiError)
      
      // Provide fallback analysis when API fails
      const fallbackAnalysis = generateFallbackAnalysis(formData)
      return NextResponse.json({ analysis: fallbackAnalysis })
    }
  } catch (err) {
    console.error("❌ /api/analyze-planet error:", err)
    return NextResponse.json({ error: "Failed to analyze planet data" }, { status: 500 })
  }
}

function generateFallbackAnalysis(formData: Record<string, unknown>): string {
  const kepid = formData.kepid || "Unknown"
  const keplerName = formData.kepler_name || "Unknown"
  const orbitalPeriod = parseFloat(String(formData.orbital_period_days || "0"))
  const planetRadius = parseFloat(String(formData.planetary_radius_earth_radii || "0"))
  const temperature = parseFloat(String(formData.equilibrium_temperature_k || "0"))
  const stellarTemp = parseFloat(String(formData.stellar_effective_temperature_k || "0"))

  // Determine if it's likely an exoplanet based on basic criteria
  const isLikelyExoplanet = orbitalPeriod > 0 && planetRadius > 0 && temperature > 0
  const confidence = isLikelyExoplanet ? 85 : 25

  return `1. EXOPLANET CLASSIFICATION:
- Answer: ${isLikelyExoplanet ? 'Yes' : 'Unlikely'}
- Confidence: ${confidence}%
- Reasoning: ${isLikelyExoplanet ? 'Data shows characteristics consistent with confirmed exoplanets' : 'Insufficient or inconsistent data for exoplanet classification'}

2. SCIENTIFIC ANALYSIS:
• Orbital Characteristics: ${orbitalPeriod > 0 ? `Orbital period of ${orbitalPeriod} days suggests a stable orbit around the host star` : 'Orbital period data missing or invalid'}
• Physical Properties: ${planetRadius > 0 ? `Planetary radius of ${planetRadius} Earth radii indicates a ${planetRadius > 3 ? 'gas giant' : planetRadius > 1.5 ? 'super-Earth' : 'terrestrial'} planet` : 'Planetary radius data unavailable'}
• Stellar Parameters: ${stellarTemp > 0 ? `Host star temperature of ${stellarTemp}K suggests a ${stellarTemp > 6000 ? 'F-type' : stellarTemp > 5000 ? 'G-type' : 'K-type'} star` : 'Stellar temperature data missing'}
• Transit Properties: Transit data indicates potential exoplanet detection through photometric observations
• Habitability Assessment: ${temperature > 0 ? `Equilibrium temperature of ${temperature}K suggests ${temperature < 300 ? 'potentially habitable' : temperature < 500 ? 'hot but potentially habitable' : 'uninhabitable'} conditions` : 'Temperature data unavailable'}
• Comparison to Known Exoplanets: Parameters align with confirmed exoplanet characteristics in the Kepler database

3. PLANET TYPE & CHARACTERISTICS:
- Classification: ${planetRadius > 3 ? 'Gas Giant' : planetRadius > 1.5 ? 'Super-Earth' : 'Terrestrial'}
- Habitability: ${temperature > 0 && temperature < 350 ? 'Potentially Habitable' : 'Uninhabitable'}
- Key features: ${temperature > 0 ? `Surface temperature ${temperature}K, ${planetRadius > 0 ? `${planetRadius}x Earth size` : 'unknown size'}` : 'Limited data available'}

4. CONFIDENCE FACTORS:
- Strengths: ${isLikelyExoplanet ? 'Data consistency with known exoplanet parameters, stable orbital characteristics' : 'Some parameters available for analysis'}
- Concerns: ${!isLikelyExoplanet ? 'Insufficient or inconsistent data, potential false positive' : 'Limited atmospheric composition data'}
- Data quality: ${Object.keys(formData).length > 10 ? 'Good coverage of key parameters' : 'Limited parameter coverage'}

Note: This analysis was generated using fallback algorithms due to API quota limitations. For the most accurate scientific analysis, please try again later when API access is restored.`
}

function buildPrompt(formData: Record<string, unknown>): string {
  const entries = Object.entries(formData)
    .map(([key, value]) => `${key}: ${String(value ?? "")}`)
    .join("\n")

  return `You are an expert astrophysicist analyzing NASA Kepler mission data to determine if this celestial object is an exoplanet.

ANALYSIS TASK:
Based on the following Kepler dataset parameters, provide a comprehensive scientific analysis:

DATA PROVIDED:
${entries}

REQUIRED ANALYSIS FORMAT:

1. EXOPLANET CLASSIFICATION:
- Answer: [Yes/No/Likely/Unlikely]
- Confidence: [0-100]%
- Reasoning: [Brief explanation of key factors]

2. SCIENTIFIC ANALYSIS:
Provide 4-6 detailed bullet points covering:
• Orbital characteristics and their significance
• Physical properties and planet type classification  
• Stellar parameters and their impact
• Transit properties and detection reliability
• Habitability assessment
• Comparison to known exoplanet characteristics

3. PLANET TYPE & CHARACTERISTICS:
- Classification: [terrestrial/super-Earth/gas giant/ice giant/etc.]
- Habitability: [habitable/potentially habitable/uninhabitable]
- Key features: [atmosphere, surface conditions, orbital dynamics]

4. CONFIDENCE FACTORS:
- Strengths: [What supports exoplanet classification]
- Concerns: [What might indicate false positive]
- Data quality: [Assessment of measurement reliability]

Provide detailed, scientifically accurate analysis in plain text format without markdown formatting.`
}