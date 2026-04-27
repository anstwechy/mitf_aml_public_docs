# FlowGuard — architecture built for real AML workloads

This document is the **technical backbone** of the story: how FlowGuard turns **ingested transactions** into **screening outcomes**, **alerts**, **fraud review**, and **case workflows** in a **multi-tenant**, **message-driven** architecture with **clear security boundaries** and **first-class observability**. **Who owns the product and runs it in production** is in [masarat.md](./masarat.md) and [bank/governance-and-operations.md §2](./bank/governance-and-operations.md#2-operating-authority). For field-level contracts and HTTP/queue details, use [BACKEND-INTEGRATION-GUIDE.md](./BACKEND-INTEGRATION-GUIDE.md) and OpenAPI on a running Analyzer or Management host.

## 1. System context — who plugs in, who gets value

FlowGuard is designed so **producers** can be loud (cores, **wallet** bridges, adapters) and **analysts** get a **calm, unified** portal: all screening feeds **alerts** into a central **case-management** API; compliance and fraud work happens in the **AML Portal** without re-wiring the bank’s entire stack for every new channel.

- **Producers** publish `TransactionQueueMessage` to **RabbitMQ** (the **default, scalable** path) or use **HTTP** ingress where contractually agreed.
- **Channel monitoring** (mobile / web **security** events) lands on the Analyzer monitoring API, **signed** when that path is enabled.
- **Analysts & admins** use the **AML Portal** in the browser; everything behind it is the **Management** API and policy layer.

**Why this shape wins:** decouple **ingest volume** from **UI scale** — the Analyzer and broker absorb spikes; Management and the portal stay the **authoritative** place for users, cases, and audit narrative.

### 1.1 System context (actors and boundaries)

**External** systems publish transactions or use the **portal**; **FlowGuard** services and data stores are **inside** the product boundary. Security mechanisms (JWT, HMAC, keys) are summarised in [§4](#4-security-boundaries-defensible-by-design).

```mermaid
flowchart LR
  subgraph ext [Bank and channels]
    PR[Producers and bridges]
    AN[Analysts and admins]
  end
  subgraph fg [FlowGuard]
    R[(RabbitMQ)]
    A[Analyzer]
    M[Management]
    U[AML Portal]
  end
  PR -->|messages| R
  R --> A
  AN -->|browser| U
  U --> M
  A -->|alerts, cases, webhooks| M
```

## 2. Logical containers — what we actually run

| Component | What it does | How we deploy it |
|-----------|----------------|------------------|
| **FlowGuard.Analyzer** | Validates and **analyses** transactions per **bank code**; **rules + ML + watchlist**; **fraud** in parallel with AML; **signed webhooks** to Management; optional **monitoring** ingestion | Typically **per bank / tenant routing policy** — isolation is a **design feature**, not an afterthought |
| **FlowGuard.Management** | **AuthN/Z**, **users**, **tenants**, **alerts**, **cases**, **reporting**, **subscription & ingestion** administration | **Shared central** service — one place for operational truth |
| **AML Portal** | **Angular** SPA — the operational **face** of the product | Static assets + API path to Management |
| **PostgreSQL** | Durable state for Management and per-Analyzer **schemas** as deployed | Managed or containerised |
| **RabbitMQ** | **Topic** exchanges for transactions (and optional **monitoring** plumbing) | Cluster or node per environment |
| **Redis** | **Hot** caching | Optional per deployment |
| **Consul** | **KV** and discovery | Optional |
| **Observability** | **OpenTelemetry** collector, **Prometheus**, **Loki**, **Tempo**, **Grafana** | Same **compose / swarm** story as the apps — the stack is **observed**, not opaque |

Code layout: `src/Applications/` (hosts), `src/Services/`, `src/Core/`, `src/Clients/` — **clean separation** between deployable **hosts** and **reusable** domain and client libraries.

### 2.1 Tenant and deployment topology

**Per bank / tenant** you typically route traffic to a **dedicated Analyzer** and **dedicated queue binding** so `BankCode` on the envelope always matches the host’s `TenantConfig`. **Management**, the **portal**, and **subscription/ingestion** administration stay **centrally** deployed — one **operational** place for users, cases, and keys.

```mermaid
flowchart TB
  subgraph shared [Shared across banks]
    M[Management API]
    P[AML Portal]
    DBM[(Management DB - tenants, keys, cases, subscriptions)]
  end
  subgraph b1 [Bank A slice]
    QA[(Queue aml.transactions.A)]
    AA[Analyzer A - TenantConfig BankCode A]
    DBA[(Analyzer DB A)]
  end
  subgraph b2 [Bank B slice]
    QB[(Queue aml.transactions.B)]
    AB[Analyzer B - TenantConfig BankCode B]
    DBB[(Analyzer DB B)]
  end
  X[(Exchange aml.transactions)]
  M --> DBM
  P --> M
  AA --> DBA
  AB --> DBB
  AA -->|webhooks| M
  AB -->|webhooks| M
  X --> QA
  X --> QB
  QA --> AA
  QB --> AB
```

## 3. Primary data flow — AML transaction (the main event)

The diagram is the **happy path** from producer to case management. Everything else in the runbooks (retries, DLQ, HMAC) hangs off this spine.

```mermaid
flowchart LR
  subgraph ingest [Ingestion]
    P[Producer / Adapter]
    Q[(RabbitMQ<br/>aml.transactions)]
  end
  subgraph analyze [Analysis]
    A[FlowGuard.Analyzer]
    DB_A[(Analyzer DB)]
  end
  subgraph manage [Case management]
    M[FlowGuard.Management]
    DB_M[(Management DB)]
    U[AML Portal]
  end
  P -->|publish TransactionQueueMessage| Q
  Q -->|MassTransit consumer| A
  A --> DB_A
  A -->|signed webhook HTTP| M
  M --> DB_M
  U -->|JWT| M
```

### 3.0 End-to-end sequence (happy path)

Same spine as the diagram above, as a **time-ordered** view: from publish through analysis to the portal calling Management.

```mermaid
sequenceDiagram
  autonumber
  participant Prod as Producer
  participant RMQ as RabbitMQ
  participant MT as MassTransit consumer
  participant An as Analyzer
  participant Mgmt as Management
  participant Port as AML Portal
  Prod->>RMQ: Publish TransactionQueueMessage
  RMQ->>MT: Deliver to bank queue
  MT->>MT: Validate bank code vs TenantConfig
  MT->>An: Analyse and persist
  An->>Mgmt: POST signed alert or case webhook
  Mgmt-->>An: 2xx
  Port->>Mgmt: API over JWT
  Mgmt-->>Port: Cases, users, config
```

**Design power:**

- **Bank isolation** — `TenantConfig:BankCode` on each Analyzer; envelope **must** match. Wrong bank? **Rejected** — not silently cross-contaminated (see consumer logs and [queue runbook](./operations/aml-transaction-queue-runbook.md)).
- **At-least-once** — the broker can **redeliver**; idempotency on **transaction id** and ingestion rules is **documented** ([TENANT_INGESTION_KEYS.md](./TENANT_INGESTION_KEYS.md) for HTTP ingress and duplicates).
- **Legacy HTTP** analyse routes remain for **compatibility**; new work should go **queue-first** or the **supported** ingress in the integration guide.

### 3.1 Fraud, reviews, and case webhooks

**Fraud** runs in the **Analyzer** **alongside** AML and ML. It is **review-driven** and does not replace your typology or policy — it **informs** the right people. **FRAUD_REVIEW** (and other) alerts go to **Management** on the same **signed alert webhook** path as AML. The **AML Portal** carries **Fraud reviews**, per-tenant **Fraud config**, and **Fraud calibration**. When the Analyzer hits the **case webhook** (`POST` under `api/webhooks/.../case`), **Case** records land in **Management** so **investigator workflows** stay in one system of record.

### 3.2 Inside the Analyzer: processing pipeline

Logical stages after a **queue message** or **supported HTTP** path: validation, **screening** (rules, lists, models), then **persistence** and **downstream** signals to Management. Exact class names live in the platform repo; this is the **operational** mental model.

```mermaid
flowchart TB
  IN[Incoming transaction]
  V{Bank code and envelope OK?}
  S[Screening: rules, watchlist, ML, fraud]
  P[Persist results in Analyzer DB]
  W[Signed webhooks to Management]
  X[Response or ACK]
  IN --> V
  V -->|no| X
  V -->|yes| S
  S --> P
  P --> W
  W --> X
```

## 4. Security boundaries — defensible by design

| Boundary | Mechanism |
|----------|-----------|
| Portal → Management | **JWT** bearer; **roles** and **policies** on controllers |
| Management → edge | **TLS**; secrets from **env** or **Consul** — not baked defaults in repo |
| Analyzer → Management | **Webhook HMAC** + **timestamp** validation (`WebhookSecurityService`) |
| Monitoring → Analyzer | Optional **HMAC** on the canonical payload when `SignatureValidation:Enabled` |
| Transaction HTTP ingress | **API key** or **DB-backed** ingestion keys per **tenant** |

**Trust zones (who proves what to whom):**

```mermaid
flowchart LR
  subgraph z1 [Browser zone]
    U[User]
  end
  subgraph z2 [API zone]
    P[AML Portal]
    M[Management]
  end
  subgraph z3 [Analysis zone]
    A[Analyzer]
  end
  U -->|HTTPS + session/JWT| P
  P -->|Bearer JWT| M
  A -->|HMAC-signed webhooks, timestamp| M
```

Deeper hardening: [team-runbooks/security-runbook.md](./team-runbooks/security-runbook.md).

## 5. Observability — you can see what it did

**Signal path (typical compose / Swarm stack):**

```mermaid
flowchart LR
  subgraph apps [Applications]
    A[Analyzer]
    M[Management]
  end
  subgraph o11y [Observability]
    OT[OpenTelemetry]
    PR[Prometheus]
    LO[Loki]
    TE[Tempo]
    GF[Grafana]
  end
  A --> OT
  M --> OT
  OT --> PR
  OT --> LO
  OT --> TE
  PR --> GF
  LO --> GF
  TE --> GF
```

- **Metrics & traces** — `ObservabilityRegistration` in `src/BuildingBlocks/Observability/Telemetry/OpenTelemetry.cs`: **W3C** trace context and **baggage** before ASP.NET Core and **HTTP** clients start.
- **Messaging** — MassTransit paths emit **structured logs** and **propagate** trace context (see Analyzer consumer for headers and span tags).
- **Dashboards** — Grafana / Prometheus / Loki / Tempo from compose; [operations runbook](./team-runbooks/operations-runbook.md) ties it to **how you run** the stack.

**Why it matters in production:** a compliance stack that cannot be **traced** and **tuned** under load is a liability. FlowGuard is built so **SRE and auditors** can follow the **thread** from ingress to case.

## 6. Configuration — envs, compose, Consul

| Surface | Use |
|---------|------|
| `appsettings.json` + **env** | Local and container **defaults** |
| `deployment/docker-compose*.yml` | **Topology**, ports, **injected** config |
| **Consul KV** | Production **overrides**; ingestion keys described in `deployment/CONSUL_KV_INGESTION_SUBSCRIPTION.md` |

## 7. Frontend note

The **AML Portal** loads `/assets/config.json` at **container** startup (see `docker-entrypoint` and deployment env) — so **per-environment** API and logging are **not** a rebuild for every target.

## 8. Further reading

- [masarat.md](./masarat.md) — product owner and platform operator
- [GLOSSARY.md](./GLOSSARY.md) — shared vocabulary
- [integrations/masarat-wallet-flowguard-integration.md](./integrations/masarat-wallet-flowguard-integration.md) — wallet contract
- [operations/aml-transaction-queue-runbook.md](./operations/aml-transaction-queue-runbook.md) — queue operations in depth
