# Playwright MCP Test Plan

This directory documents Playwright MCP jobs that exercise the full product surface. Each `.mcp.md` file maps to a reusable workflow that can be triggered from the MCP catalog.

## Usage

1. Install browsers once via `npx playwright install` (outside the MCP sandbox if needed).
2. Launch the MCP runner, then execute the scenarios described in the `*.mcp.md` files.
3. Capture the generated screenshots and HAR files and attach them to PRs touching UI or integration flows.

See `test-plan.mcp.md` for the master checklist.
