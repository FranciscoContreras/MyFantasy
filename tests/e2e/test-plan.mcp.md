# Playwright MCP Comprehensive Test Suite

```mcp
# Unit Test Coverage (Jest)
- run "npm run test -- --runInBand" // ensures deterministic output in CI
- verify "tests/analysis" suite for algorithm accuracy
- verify "tests/league-importers" suite for data normalization
- verify "tests/api" suite for API route behaviour

# End-to-End Flows
- call "Test complete user registration flow"
- call "Test lineup optimization workflow"
- call "Test drag-and-drop roster management"
- call "Test league import from ESPN"
- call "Verify glass morphism UI across browsers"
- call "Test mobile responsive design"
- call "Capture screenshots of all major flows"

# Visual Regression
- call "Screenshot all pages in light/dark mode"
- call "Compare UI changes across deployments"
- call "Test glass morphism effects in different browsers"

# Performance Benchmarks *(see also `tests/e2e/performance-bench.mcp.md`)*
- call "Measure page load times"
- call "Test with 1000+ player datasets"
- call "Stress test real-time updates"

# Reporting
- aggregate junit from jest output
- collect MCP artifacts (screens, traces)
- update tests/coverage.md with notable gaps
```
