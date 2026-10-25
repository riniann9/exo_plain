import { POST, type AnalyzePlanetEnv } from '../../src/lib/server/analyze-planet'
export const onRequestPost = ({ request, env }: { request: Request; env: AnalyzePlanetEnv }) => POST(request, env)
