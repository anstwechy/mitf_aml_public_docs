# Glossary

Definitions apply to the FlowGuard codebase and documentation unless stated otherwise.

| Term | Definition |
|------|------------|
| **Alert** | A persisted signal that a transaction (or group) exceeded risk or rule thresholds; analysts review alerts and may create **cases**. |
| **AML Portal** | Angular single-page application used by compliance and tenant administrators. |
| **Analyzer** | `FlowGuard.Analyzer` — service that scores transactions (rules, ML, watchlists) and notifies Management. Often deployed **one instance per bank code** with matching queue bindings. |
| **Bank code** | String identifier for routing (e.g. tenant’s institution). Must align between producer routing keys, message envelope, and Analyzer `TenantConfig:BankCode`. |
| **Case** | Investigation record in Management linking alerts, disposition, and audit trail; distinct from a raw alert. |
| **Channel** | High-level origin of a transaction in payload vocabulary (e.g. `WALLET`); affects validation and segmentation. |
| **Dead letter queue (DLQ)** | RabbitMQ queue receiving messages that failed processing after retry policy; name pattern `aml.transactions.dlq.{BankCode}`. |
| **FlowGuard.Management** | Central management API — auth, tenants, alerts, cases, subscriptions, ingestion credentials, reporting. |
| **Fraud review** | Separate operational path for fraud-scored traffic; review-only relative to AML case workflow (see product configuration). |
| **HTTP ingress (transactions)** | Optional Analyzer endpoint that accepts transactions with an API key and enqueues the same pipeline as RabbitMQ; see integration guide. |
| **Ingestion API key** | Per-tenant credential for transaction ingress (`fg_{id}.{secret}`); validated against Management DB; usage metered when enforcement is on. |
| **Management DB** | PostgreSQL schema used by Management; Analyzer may require read access for ingestion key resolution when using DB-backed keys. |
| **Masarat** | **Masarat Technology** — **product owner**, **operator** of the FlowGuard platform, and **author** of core **integration contracts** (queues, HTTP, wallet) in this repo. Holds **operating authority** in the default service model: runs infrastructure and releases, platform monitoring, incident response, and support **as contracted**. Does **not** assume the bank’s **regulatory** programme duties. See [masarat.md](../masarat.md) and [bank/governance-and-operations.md](../bank/governance-and-operations.md#2-operating-authority). |
| **MassTransit** | .NET messaging library used for RabbitMQ publish/consume with retries and instrumentation hooks. |
| **Monitoring event** | Signed or unsigned security / channel event ingested on Analyzer monitoring HTTP or optional queue. |
| **Subscription** | Tenant billing plan and optional monthly quota for metered ingress; enforced on Analyzer when configured. |
| **Tenant** | Logical organisation in Management (bank or institution) with users, credentials, and configuration. |
| **TransactionQueueMessage** | Canonical envelope for queue-based AML ingestion: metadata plus nested `TransactionAnalysisRequest`. |
| **Webhook** | HTTP callback from Analyzer to Management carrying alert or outcome payloads; secured with shared secret and anti-replay handling. |
