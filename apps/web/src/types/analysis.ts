export type AnalysisResult = {
  isExoplanet: boolean
  confidence: number
  explanation: string
  topFeatures: Array<{
    name: string
    impact: number
    value: string | number
    reasoning: string
    relevanceLabel?: string
  }>
  geminiAnalysis?: {
    answer: boolean
    most_important_features: Array<{
      [key: string]: string
      Relevance: string
    }>
  }
  planetData: any
  source: string
}
