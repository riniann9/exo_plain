# Standalone copy (not the team GitHub repo)

This folder is your **local fork** of Exo-Plain with the fixes applied. It is **not** connected to `kx11z/NASA-Space-App-2025---reupload` unless you add a remote yourself.

## Do you need a Gemini API key?

**No — for normal use of this copy.**

- Explore Existing Data, 3D planets, tutorial, demonstration analysis, and Pollinations planet images all work **without** any API key.
- A key is **optional** and only needed if you later host the Cloudflare API and want **live** Gemini on “Predict New Data” (not required for the NASA demo site behavior we fixed).

**Do not give your API key to Cursor or paste it in chat.** Put it only in:

- `apps/web/.env.local` → `GEMINI_API_KEY=...` (local backend testing), or
- Cloudflare Pages secrets (if you deploy the API yourself).

Never use `NEXT_PUBLIC_*` for the key.

## Run the site locally

```sh
cd apps/web
npm ci
npm run dev
```

Open **http://localhost:3000**

## Optional: your own GitHub (unrelated repo)

If you want a **public** link under your account (not the team org):

1. Create a **new empty repo** on your GitHub (any name).
2. From this folder:

```sh
git add -A
git commit -m "Exo-Plain standalone with site fixes"
git remote add origin https://github.com/YOUR_USER/YOUR_NEW_REPO.git
git push -u origin fix/site-improvements
```

3. Enable GitHub Pages → Source: **GitHub Actions** (same as team repo docs).

Your URL would be `https://YOUR_USER.github.io/YOUR_NEW_REPO/` (not the team link).

We did **not** push anything to the original team repository.
