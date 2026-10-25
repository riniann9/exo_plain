# Exo-Plain

An interactive Next.js / React exoplanet explorer, configured for GitHub Pages.

See [the deployment guide](../../docs/deployment.md) for setup, custom backend configuration, and limitations.

## Publish

In this repository's Settings > Pages, choose **GitHub Actions** as the source. The Deploy GitHub Pages workflow builds and publishes on pushes to main.

Expected address: https://kx11z.github.io/NASA-Space-App-2025---reupload/

## Analysis

The default GitHub Pages deployment is a clearly labeled demonstration. Live Gemini and FITS analysis require a separate backend. Set the GitHub Actions variable NEXT_PUBLIC_API_BASE_URL to its origin and rebuild. Keep GEMINI_API_KEY exclusively on that backend. Optional Cloudflare Functions remain in functions/.

## Local development

Use Node.js 22. From apps/web run npm ci and npm run dev for the frontend. npm run build creates a static export in out. For the optional local Functions backend, copy .dev.vars.example to .dev.vars and use npm run preview:pages.
