# Test Coverage Notes

- Added Jest suites covering analytics utilities, matchup engine scoring, lineup optimizer search, importer normalization, and integration API fallbacks.
- Remaining gaps:
  - Deep integration of `StartSitRecommendationEngine` once the TensorFlow model is fully wired for production data.
  - Live importer runs (runUniversalImport) still rely on Playwright automation and require credentialed CI secrets.
  - UI component tests will be added after React Testing Library harness is configured.

> Run `npm install` followed by `npm run test -- --runInBand` once network access is available to execute the new suites locally.
