# Put this project on **your** GitHub (for teammates)

Your Gemini key stays in `apps/web/.dev.vars` on your computer only — **never** commit it.

## 1. Create an empty repo on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Name it (example): `exo-plain` or `nasa-exo-plain`
3. Choose **Public** (easiest free GitHub Pages for teammates)
4. **Do not** add README, .gitignore, or license (this folder already has them)
5. Click **Create repository**

## 2. Push this folder (one time)

In Terminal, replace `YOUR_USER` and `YOUR_REPO`:

```sh
cd "/Users/riniann/Downloads/NASA-Space-App-Challenge---A-World-Away-main/exo-plain"

git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub asks you to sign in, use the browser or a personal access token.

### Push rejected: `workflow` scope

If you see:

```text
refusing to allow an OAuth App to create or update workflow `.github/workflows/pages.yml` without `workflow` scope
```

Git received the upload but **refused to update `main`** because your login token cannot create GitHub Actions workflow files. Fix auth, then push again (same command):

**Option A — GitHub CLI (recommended)**

```sh
gh auth login -h github.com -s repo -s workflow
git push -u origin main
```

**Option B — Classic personal access token**

1. [Create a classic token](https://github.com/settings/tokens/new) with scopes **`repo`** and **`workflow`**.
2. When `git push` asks for a password, paste the token (not your GitHub password).

**Option C — Push without the workflow file first**

If you cannot get `workflow` scope right now, remove the workflow from git, push, then add it in the GitHub web UI (**Add file** → paste `.github/workflows/pages.yml`):

```sh
git rm --cached .github/workflows/pages.yml
git commit -m "Temporarily omit workflow for initial push"
git push -u origin main
```

Then re-add the file on github.com (browser login can edit workflows) or restore the file locally and push after Option A/B.

## 3. Turn on GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Open the **Actions** tab — the “Deploy GitHub Pages” workflow should run after the push
4. When it finishes (green check), your site is live at:

```text
https://YOUR_USER.github.io/YOUR_REPO/
```

Share **that link** with teammates.

## What teammates get

| Link | What it is |
|------|------------|
| `https://YOUR_USER.github.io/YOUR_REPO/` | Website (demo AI on Pages unless you add a backend) |
| `https://github.com/YOUR_USER/YOUR_REPO` | Source code |

GitHub Pages is **demo mode** (no Gemini on the server) unless you later host Cloudflare + set `NEXT_PUBLIC_API_BASE_URL` in repo **Settings → Secrets and variables → Actions → Variables**.

## Fix GitHub CLI (optional)

If you use `gh`:

```sh
gh auth login -h github.com
gh repo create YOUR_REPO --public --source=. --remote=origin --push
```
