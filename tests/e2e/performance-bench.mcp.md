# Performance Benchmark Workflow

```mcp
- call "Measure page load times" --devices="Desktop Chrome, Desktop Firefox, Mobile Safari"
- call "Test with 1000+ player datasets"
- call "Stress test real-time updates"
- capture artifacts to `reports/mcp/performance`
- compare results with previous run to confirm regression budget (<200ms FCP delta)
```

> Trigger this workflow from CI or locally after major optimisations to ensure improvements are quantifiable.
