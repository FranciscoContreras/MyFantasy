# Lineup Optimization Engine

Task 3.4 adds a lineup optimizer capable of generating multiple roster builds while respecting DFS-style constraints.

## Inputs

```ts
const result = await lineupOptimizer.optimize({
  players: projections, // PlayerProjection[]
  constraints: {
    slots: [
      { id: "QB", allowedPositions: ["QB"] },
      { id: "RB1", allowedPositions: ["RB"] },
      { id: "RB2", allowedPositions: ["RB"] },
      { id: "WR1", allowedPositions: ["WR"] },
      { id: "WR2", allowedPositions: ["WR"] },
      { id: "WR3", allowedPositions: ["WR"] },
      { id: "TE", allowedPositions: ["TE"] },
      { id: "FLEX", allowedPositions: ["RB", "WR", "TE"], flex: true },
      { id: "DST", allowedPositions: ["DST"] },
    ],
    salaryCap: 60000,
    maxPerTeam: 4,
    stackConstraints: [{ teamId: "KC", minPlayers: 2 }],
  },
  options: {
    maxLineups: 5,
    riskTolerance: 0.45,
  },
})
```

Each `PlayerProjection` bundles mean/floor/ceiling points, confidence, and optional analysis metadata produced earlier in Phase 3.

## Features

- **Projection maximization**: default scoring favors mean projection with configurable risk weighting to emphasize floor or ceiling.
- **Roster constraints**: salary cap, team limits, minimum teams, and stacking rules for correlations.
- **Multiple outputs**: returns top `maxLineups` lineups ranked by composite score with per-lineup notes (e.g., high floor/upside).
- **Pruning & heuristics**: candidates per slot are sorted by mean projection and bounded by `maxCandidatesPerSlot` to keep search tractable.

## Extending

- Plug real probabilistic models (e.g., from `PredictionEngine`) into the projections pipeline.
- Persist generated lineups to compare against user-defined exposures.
- Add showdown/Superflex templates by modifying `LineupConstraints.slots`.

## Next Steps

- Connect matchup analysis outputs to adjust risk weighting dynamically.
- Allow exposure controls (global and per-player) once users build multiple slates.
- Integrate optimizer results into dashboard UI with scenario comparison tools.
