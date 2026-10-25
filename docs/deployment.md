# Deploy Exo-Plain to GitHub Pages

Repository: https://github.com/kx11z/NASA-Space-App-2025---reupload
Expected site: https://kx11z.github.io/NASA-Space-App-2025---reupload/

## Enable hosting

1. Open the repository Settings, then Pages.
2. Under Build and deployment, set Source to **GitHub Actions**.
3. Open Actions and run **Deploy GitHub Pages**, or push a change to main.

The workflow installs dependencies with Node.js 22, builds apps/web, and publishes out. It gets the base path from GitHub Pages metadata, so internal navigation and assets work under the repository path. Routes export as directories (for example new/index.html) so direct links and refreshes work. The .nojekyll file permits _next assets.

## AI and FITS analysis

GitHub Pages hosts static files only. With no API configured, the site runs in clearly labeled demonstration mode. FITS analysis is unavailable and planet classification/confidence are simulated. Existing planet examples also use simulated analysis.

For live analysis, host the API separately. The existing Cloudflare Pages Functions are retained as an optional backend. Add GEMINI_API_KEY as a secret on that backend and FITS_API_URL as the HTTPS /api/extract URL of a separately hosted Python inference service. Set FRONTEND_ORIGIN to https://kx11z.github.io (or your custom domain origin) on the backend to permit browser requests.

In GitHub Settings > Secrets and variables > Actions > Variables, add NEXT_PUBLIC_API_BASE_URL with the backend origin, such as https://your-api.example.com (without /api). Re-run the workflow after changing it. This public URL is embedded at build time. Never place GEMINI_API_KEY in a NEXT_PUBLIC variable or GitHub Pages output.

The workflow does not deploy a backend. For the optional Cloudflare backend: use root apps/web, build npm run build:pages, output out, and set its runtime secrets. Build it with NEXT_PUBLIC_BASE_PATH unset.

## Local verification

From apps/web run npm ci, then:

NEXT_PUBLIC_BASE_PATH=/NASA-Space-App-2025---reupload NEXT_PUBLIC_GITHUB_PAGES=true npm run build

To preview under the real repository path, serve a parent folder containing the out directory mounted as NASA-Space-App-2025---reupload. A frontend-only next dev session uses paths without the repository prefix.

## Limitations

Production builds check TypeScript; run npm run typecheck for a standalone check. ESLint is not configured. Planet illustrations rely on an external image service. LLM assessments and simulated confidence are not validated scientific predictions. Legacy Docker/Render scripts target the former server deployment.
