# Deployment

This is a **Next.js app with API routes + server rendering** — it needs a **Node.js runtime**, not static/PHP hosting. It will NOT run on GitHub Pages or plain shared/static hosting.

## Hostinger (Node.js plan / VPS / "Setup Node.js App")

Because it runs as a **persistent Node process**, the `.data/` analytics store and battle/daily persistence **work here** (unlike serverless).

### One-time setup
1. **hPanel → Node.js app** (Advanced → Node.js, or "Setup Node.js App"):
   - **Node version:** 20 LTS or newer.
   - **Application root:** the folder your GitHub repo deploys into.
   - **Application startup file:** `server.js`  *(provided in this repo)*.
2. **Pull the code** from GitHub into the app root (Hostinger Git integration, or `git clone`).
3. **Set Environment Variables** (in the Node app's env config — NOT committed):
   | Variable | Value |
   |---|---|
   | `GEMINI_API_KEY` | your Gemini key (from aistudio.google.com) |
   | `GEMINI_MODEL` | `gemini-2.5-flash` |
   | `ADMIN_PASSWORD` | a strong password for `/admin` |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
   | `NODE_ENV` | `production` |
4. **In the app's terminal / SSH (in the app root):**
   ```bash
   npm install        # installs ALL deps (build needs devDependencies)
   npm run build      # next build  (set env vars BEFORE this — see gotcha)
   ```
5. **Restart** the Node app in hPanel. Done.

### Updating after a `git push`
```bash
git pull
npm install
npm run build
# then restart the Node app in hPanel
```

### Gotchas (important)
- **`NEXT_PUBLIC_SITE_URL` is baked in at build time.** Set it *before* `npm run build`, or share-card/OG links will point at the wrong domain. Rebuild if you change it.
- **Don't run `npm install --production` before building** — `next build` needs the devDependencies (TypeScript, Tailwind, Next). Install everything, build, then run.
- **Startup file vs `npm start`:** Hostinger/Passenger wants an explicit startup file → use `server.js`. If your panel instead runs `npm start`, that also works (`next start`, reads `PORT`).
- **Memory:** `next build` may need ~1 GB. If the build is killed/OOMs on a small plan, build locally (`npm run build`) and upload the `.next` folder alongside the code, then just start the app.
- **Port:** the app listens on `process.env.PORT` (Hostinger provides it). `server.js` already honors this.

## Vercel (simplest alternative)
Import the GitHub repo → add the same env vars in Project Settings → deploy. Zero server config; auto-redeploys on push. Caveat: serverless has an **ephemeral filesystem**, so the `.data/` analytics store resets — production analytics there need the Postgres backend (docs/04, Phase 3).
