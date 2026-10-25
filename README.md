# Exo-Plain

Interactive exoplanet explorer built for NASA Space Apps.

[Open the website](https://kx11z.github.io/NASA-Space-App-2025---reupload/) · [Deployment guide](docs/deployment.md) · [Code guide](docs/architecture.md)

## Where things live

| Folder | Contents |
| --- | --- |
| apps/web | Active Next.js website and optional Cloudflare API Functions |
| research/python | Python inference server, training scripts, model weights, and sample observations |
| posters | Poster HTML sources, exported PDF/PowerPoint files, previews, and artwork |
| tools/posters | Scripts for rebuilding poster exports |
| docs | Current deployment and architecture guides |
| archive | Earlier website versions, old deployment files, and build references |

## Run the website

Use Node.js 22. From the repository root:

```sh
cd apps/web
npm ci
npm run dev
```

Use npm for the active application; package-lock.json is the authoritative lockfile. The old pnpm lockfile is preserved under archive/package-managers.

## Publish

GitHub Actions builds apps/web and publishes it to GitHub Pages on pushes to main. The default site runs in labeled demonstration mode; live AI and FITS analysis require a separately hosted backend. See [deployment](docs/deployment.md).

## Research and historical projects

Run Python scripts from research/python so their existing relative model and data paths resolve. The research environment is separate from the website and is not installed by the GitHub Pages workflow. Older websites and deployment scripts in archive are retained for reference and are not used by the live website.
