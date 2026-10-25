type Context = { request: Request; env: { FRONTEND_ORIGIN?: string }; next: () => Promise<Response> }
export async function onRequest({ request, env, next }: Context) {
  const origin = request.headers.get('Origin')
  const allowedOrigins = (env.FRONTEND_ORIGIN || 'https://riniann9.github.io,https://kx11z.github.io')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  const requestOrigin = new URL(request.url).origin
  if (
    origin &&
    !allowedOrigins.includes(origin) &&
    origin !== requestOrigin
  ) {
    return Response.json({ error: 'Origin is not allowed' }, { status: 403 })
  }
  const response = request.method === 'OPTIONS' ? new Response(null, { status: 204 }) : await next()
  const headers = new Headers(response.headers)
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    headers.append('Vary', 'Origin')
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
