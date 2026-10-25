// Public build configuration only. Never put API keys in NEXT_PUBLIC_ variables.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')
export const isStaticDemo = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' && !apiBaseUrl
export const siteUrl = (route: string) => basePath + route
export function apiUrl(route: string) {
  if (isStaticDemo) throw new Error('Live analysis requires a separately hosted API.')
  return apiBaseUrl + route
}
