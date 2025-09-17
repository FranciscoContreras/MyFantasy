# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router pages, including `(auth)/` flows, the dashboard, and API route handlers under `app/api/`.
- `app/components/` stores shared React components; prefer generating variants through the shadcn MCP to keep styles consistent.
- `lib/` contains feature logic: `lib/nfl-data/` for integrations, `lib/analysis/` for ML + optimization code, and `lib/db/` for Prisma helpers.
- `prisma/schema.prisma` defines the PostgreSQL models; migrations live in `prisma/migrations/`.
- `tests/` groups Jest unit tests and React Testing Library specs; Playwright MCP scenarios should be checked into `tests/e2e/`.
- `public/` hosts static assets (logos, screenshots).

## Build, Test, and Development Commands
- `npm run dev` launches the Next.js dev server with hot reload.
- `npm run build` performs a production build; run before opening a PR.
- `npm run lint` executes ESLint + Prettier formatting checks.
- `npm run test` triggers the Jest suite; add `--watch` during feature work.
- `npx prisma migrate dev` updates the local database schema after model changes.
- `npx playwright test` (via Playwright MCP) runs E2E suite.

## Coding Style & Naming Conventions
- Use TypeScript everywhere; favor explicit types for public functions and API responses.
- Follow 2-space indentation, camelCase for variables/functions, PascalCase for React components and Prisma models.
- Keep Tailwind classes ordered from layout → color → effects; extract shared glass styles into utilities like `glass-card`.
- Run `npm run lint -- --fix` before committing to enforce ESLint/Prettier rules.

## Testing Guidelines
- Co-locate unit specs next to modules (`*.test.ts` or `*.test.tsx`) and mirror file names.
- Maintain ≥80% coverage; update `tests/coverage.md` with notable gaps.
- Use React Testing Library for UI behavior, Jest mocks for data services, and Playwright MCP for cross-browser flows and screenshots.
- Store MCP fixtures under `tests/fixtures/` to stabilize automated runs.

## Commit & Pull Request Guidelines
- Write Conventional Commits (`feat:`, `fix:`, `chore:`) with imperative subjects.
- PRs must describe scope, list test commands run, and attach Playwright screenshots for UI-impacting work.
- Reference tracking issues in both commits and PR descriptions using `Closes #ID`.
- Request review once `npm run build`, `npm run test`, and relevant MCP jobs succeed locally.

## MCP Agent Usage
- Prefer shadcn MCP commands (e.g., "Create GlassCard component") before hand-coding UI; check generated files into version control.
- Use Playwright MCP workflows for league imports, scraping, and automated testing; document custom scripts inside `tests/e2e/README.md`.
