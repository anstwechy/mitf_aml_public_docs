# Wallet channel — ML and analytics roadmap

**Owned by [Masarat](./masarat.md)** as product direction; not a commercial or regulatory commitment until delivered and contracted.

This document tracks **forward-looking** work for wallet (`Channel = WALLET`) monitoring. Implemented behaviour (rule defaults, validation, drift snapshots, UI surfaces) lives in code and in [ML_DETECTION_ENHANCEMENTS.md](./ML_DETECTION_ENHANCEMENTS.md).

## Current focus — model quality (Phase 3)

| Item | Intent |
|------|--------|
| Label pipeline | Training labels derived from case outcomes; confirmed fraud excluded from PCA “normal” subspace training. |
| Channel evaluation | Precision/recall/FPR split **wallet** vs **non_wallet** over a rolling window. |
| Calibration hints | Suggested `MLWeight` / `RuleWeight` nudges when segments diverge; **suggestions only** until approved workflow exists. |

**Open engineering items:** clearer dismissed-vs-true-positive taxonomy; persist suggestions; supervised or weighted training beyond PCA exclusion; efficient label queries at scale.

## Next horizon — wallet-native features (Phase 4)

| Theme | Examples |
|-------|----------|
| Graph and concentration | Beneficiary concentration, growth velocity, circular / round-trip patterns. |
| Device and session | Churn, geo/device mismatch, shared-device clusters (requires upstream signals). |
| Cash-in / cash-out timing | Rapid cash-out after funding patterns. |

## Configuration keys (wallet rule sensitivity)

Optional Analyzer rule keys (defaults apply if omitted):

- `ReportingThreshold.Wallet`
- `StructuringLowerBoundPercentage.Wallet` / `StructuringUpperBoundPercentage.Wallet`
- `Velocity.RequiredCountMultiplier.Wallet` / `Velocity.TimeWindowMultiplier.Wallet`
