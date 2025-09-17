# AI-Powered Predictions

Task 3.2 introduces a dual-layer prediction stack combining TensorFlow.js point forecasts with OpenAI narrative insights.

## Components

- `PredictionEngine` (`lib/analysis/prediction.ts`) orchestrates the workflow: it feeds factor scores into a lightweight TensorFlow.js model, derives confidence & probability buckets, and requests natural-language context from the insight service.
- `TensorflowPredictionModel` builds a simple linear model (perceptron-like) with a closed-form calibration helper. It defaults to heuristically tuned weights but can be recalibrated from sample data.
- `OpenAIInsightService` calls the Chat Completions API (or falls back to a local summary when no API key is present) to produce concise start/sit commentary.

## Usage Example

```ts
import { predictionEngine } from "@/lib/analysis"

const output = await predictionEngine.predict({
  playerId: "player_123",
  season: 2024,
  week: 6,
  baselineProjection: 14.3,
  position: "WR",
  factors: {
    historicalPerformance: 0.62,
    matchupDifficulty: 0.7,
    defensiveSchemeImpact: 0.55,
    coordinatorTendencies: 0.48,
    recentForm: 0.66,
    injuryImpact: 0.8,
    weatherImpact: 0.72,
  },
})

console.log(output.mean, output.confidence, output.insights)
```

## Configuration

Set `OPENAI_API_KEY` to enable live insight generation. Without a key, the service emits deterministic summaries so downstream flows continue working during local development.

TensorFlow.js runs entirely in-process; no native bindings are required. The model can be improved later by:

1. Feeding historical training samples via `TensorflowPredictionModel.calibrateFromSamples`.
2. Persisting learned weights (JSON) and rehydrating on startup.

Probability buckets represent quick heuristics (`bust`, `solid`, `boom`) while the confidence output maps to a 0–100 scale derived from factor reliability.

## Next Steps

- Replace heuristic probability buckets with true distribution sampling once variance data is available.
- Persist predictions per week and link them to the optimizer for scenario planning.
- Add automated evaluation tests comparing predictions to historical outcomes.
- Integrate outputs from the matchup analysis engine (Task 3.3) to refine game script expectations.
