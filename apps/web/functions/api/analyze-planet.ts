import { POST } from '../../src/lib/server/analyze-planet'
export const onRequestPost = ({ request, env }: { request: Request; env: { GEMINI_API_KEY?: string } }) => POST(request, env)
