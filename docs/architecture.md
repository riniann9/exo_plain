# Code guide

## Active website: apps/web

- src/app: Next.js routes and the active global stylesheet.
- src/components: Reusable interface and 3D planet components. UI primitives stay under components/ui.
- src/data: Planet catalog and form field definitions.
- src/types: Shared planet, form, and analysis types. Components do not import types from page routes.
- src/lib/deployment.ts: Repository paths and external API configuration.
- src/lib/analysis/demo.ts: Simulated analysis used by the static demonstration.
- src/lib/server: Server-only Gemini handlers, called by the optional backend Functions.
- src/hooks: Shared React hooks.
- public: Assets copied into the static export.
- functions: Optional Cloudflare API endpoints and browser access middleware; these do not run on GitHub Pages.

The @/ import alias resolves to apps/web/src. Keep route files focused on composing the interface; put reusable data and behavior in the folders above.

## Research: research/python

Python modules, tests, trained weights, and sample data retain their relative layout because the existing standalone scripts load sibling files and model paths. Run these scripts with research/python as the current directory. This preserves model loading and Python imports without changing scientific behavior during the repository cleanup. The original research README documents the experiments.

## Supporting materials

Poster sources are in posters/source, published exports in posters/exports, and previews in posters/previews. tools/posters contains regeneration scripts. Existing poster content is preserved. The PowerPoint generator uses the original artifact-tool runtime; see tools/posters/README.md.

archive/predictor-v1, archive/education-prototype, and archive/static-prototype are historical projects. archive/web-styles is an unused earlier stylesheet. archive/deployment contains obsolete deployment setups. Their historical instructions are not the current deployment guide.

Build output, dependencies, operating system files, and credentials are ignored at the repository root. The active app has one authoritative npm lockfile.
