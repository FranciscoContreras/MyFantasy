# Deploying to Vercel

This project was built with the Next.js App Router, so Vercel can deploy it straight from the GitHub repository.

## 1. Connect the Repository
1. Log into [vercel.com](https://vercel.com) and import the GitHub repo.
2. Pick the team/project scope and keep the default build command (`next build`).
3. Vercel will auto-detect the framework as Next.js and set `npm install`, `npm run build`, and `npm run start` for previews.

## 2. Environment Variables
Create the following environment variables in the Vercel dashboard (`Settings → Environment Variables`). The same values should exist for **Production**, **Preview**, and **Development** unless otherwise noted.

| Name | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, RDS, etc.). |
| `NEXTAUTH_SECRET` | 32-byte secret used by NextAuth. |
| `NEXTAUTH_URL` | e.g. `https://<your-production-domain>`. Vercel injects `VERCEL_URL` during previews but you may still supply a fallback. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (optional). If blank, the app falls back to `https://<VERCEL_URL>`. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | (Optional) Google OAuth creds if you enable Google login. |
| `OPENAI_API_KEY` | (Optional) Enables insight generation in `PredictionEngine`. |
| `REDIS_URL` / `REDIS_TLS_URL` | (Optional) Enables Redis-backed caching. |

> After updating secrets, trigger “Redeploy” from the Vercel dashboard so the new values are available.

## 3. Prisma & Database
- The repo’s `postinstall` script runs `prisma generate`, so no extra hook is required.
- Ensure your database is reachable from Vercel. Managed providers (Neon, Supabase, PlanetScale) usually work out of the box.
- Run migrations locally or through your CI/CD before deploying.

## 4. Image Domains
`next.config.ts` already allows `sleepercdn.com` (used by sample avatars). Add any additional domains you rely on later by updating `next.config.ts`.

## 5. Testing Gates (Optional)
- CI (`.github/workflows/pipeline.yml`) runs lint, Jest, Playwright MCP, visual regression, and accessibility checks. Consider gating Vercel previews on the GitHub Checks.
- For performance tracking, run the MCP workflow in `tests/e2e/performance-bench.mcp.md` and attach the report to the corresponding PR.

## 6. Production Domain
Once everything looks good in Preview:
1. Add your custom domain in Vercel → “Domains”.
2. Update DNS (CNAME/A record as instructed by Vercel).
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production domain and redeploy.

That’s it—future pushes to the default branch will rebuild automatically, and PRs will receive preview deployments with their own URLs.
