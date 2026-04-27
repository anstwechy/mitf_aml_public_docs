# ML anomaly detection — implemented behaviour and tuning

**Product ownership:** **Masarat** owns the **ML feature pipeline** and model training UX in FlowGuard; tenant teams tune weights and retrain **within** the product. Roadmap: [ML_WALLET_ROADMAP.md](./ML_WALLET_ROADMAP.md).

Randomized PCA over engineered features is the primary unsupervised model. Rule scores and ML scores are combined using tenant-configurable weights. Wallet-specific roadmap items (labels, segment evaluation) live in [ML_WALLET_ROADMAP.md](./ML_WALLET_ROADMAP.md).

## Implemented pipeline changes

| Change | Behaviour | Primary code areas |
|--------|-----------|-------------------|
| Amount-to-monthly-average ratio | Feature `AmountToMonthlyAverageRatio` = amount / (customer monthly average + 1), clamped to [0.01, 100]. | `TransactionInput`, `MLFeatureColumnNames`, `FeatureEngineeringService`, minimal feature vector builder |
| Min–max normalization | `NormalizeMinMax` on the concatenated vector before `RandomizedPca` so large-magnitude columns do not dominate. | `MLTrainingService` training pipeline |
| Amount-to-historical-max ratio | Feature `AmountToHistoricalMaxRatio` = amount / (historical max + 1), clamped. | Same feature engineering path as above |
| Reason explainability | Anomaly `Reason` may append a human-readable **Factors:** line when feature data is present. | `AnalyzerAnomalyDetectionService` |

## Retraining requirement

After any feature or normalisation change, **train and activate a new model version** from ML Configuration (or equivalent API). Existing on-disk models do not pick up new columns or transforms until retrained.

## Tuning options (not automated)

| Area | Examples |
|------|----------|
| PCA hyperparameters | Rank, oversampling; trade variance explained vs noise. |
| Segmentation | Different `AnomalyThreshold` or weights by segment (e.g. retail vs corporate) if product supports it. |
| Rules vs ML | `MLWeight` / `RuleWeight` per tenant; adjust from evaluation metrics or investigator feedback. |
| Data features | PEP/sanctions binary feature, rolling windows, beneficiary concentration — require data availability and engineering. |

## Operational monitoring

Track, at minimum: alert rate, case conversion, score distribution by channel, and training job failures. Sudden distribution shifts often indicate upstream data or configuration drift.
