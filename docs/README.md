# FlowGuard — what we built

**FlowGuard** is a full-stack **AML transaction monitoring and case-management platform**: high-throughput screening, institution-tuned rules, statistical and ML-assisted detection, **fraud review** paths, and a single **AML Portal** where analysts work alerts and cases end to end. It is built to run **multi-tenant** (per-bank isolation), **queue-first** at scale (RabbitMQ + MassTransit), and **operationally observable** (metrics, logs, traces) in real environments.

This site is the **canonical technical documentation** for FlowGuard — **owned and shipped by [Masarat](./masarat.md)** alongside the platform code and deployment manifests. When behaviour or interfaces change, the docs move in the **same change set** as the product.

---

### At a glance — platform powers

| Capability | What it means in practice |
|------------|---------------------------|
| **Screening engine** | Analyzer services score every ingested transaction with rules, watchlists, anomaly models, and ML where configured — not a black box: integration contracts and field semantics are documented. |
| **Cases & alerts** | Central **Management** API for alerts, cases, reporting, subscription and **ingestion credential** administration; analysts use the **AML Portal** against that API. |
| **Channel breadth** | **RabbitMQ** as the primary path for `TransactionQueueMessage`, optional **HTTP** ingress where agreed, and a **Masarat MITF wallet** integration story for digital channels ([wallet contract](integrations/masarat-wallet-flowguard-integration.md)). |
| **Security posture** | Signed **webhooks** (HMAC) from Analyzer to Management, JWT to the portal, optional **HMAC** on monitoring event payloads, **DB-backed ingestion keys** and metering — see [security runbook](team-runbooks/security-runbook.md). |
| **Operations** | Runbooks for **queues / DLQ**, **deployment**, **health checks**, and **observability** (Grafana, Loki, Tempo, Prometheus) so the platform is **runnable**, not just documented. |

---

### How this documentation is organised

Structure follows [Diátaxis](https://diataxis.fr/) (tutorial / how-to / reference / explanation). The table below is the full map; there is no separate file index so we do not duplicate links.

| Type | Where | What it contains |
|------|--------|------------------|
| **Tutorials** | `README.local.md` in the [platform](#related-material-outside-the-docs-repository) repository, [developers/README.md](developers/README.md) | Local stack, ports, first path from transaction to portal |
| **How-to** | [team-runbooks/README.md](team-runbooks/README.md) — [operations](team-runbooks/operations-runbook.md), [deployment](team-runbooks/deployment-runbook.md), [security](team-runbooks/security-runbook.md); [operations/aml-transaction-queue-runbook.md](operations/aml-transaction-queue-runbook.md) | Day-2 ops, releases, hardening, RabbitMQ transaction queue |
| **Reference** | [BACKEND-INTEGRATION-GUIDE.md](BACKEND-INTEGRATION-GUIDE.md), [integrations/masarat-wallet-flowguard-integration.md](integrations/masarat-wallet-flowguard-integration.md), [TENANT_INGESTION_KEYS.md](TENANT_INGESTION_KEYS.md), [GLOSSARY.md](GLOSSARY.md) | HTTP/queue contracts, wallet vocabulary, keys and metering, terminology |
| **Explanation** | [ARCHITECTURE.md](ARCHITECTURE.md), [masarat.md](masarat.md), [bank/README.md](bank/README.md) (executive, governance, compliance, procurement), [ML_DETECTION_ENHANCEMENTS.md](ML_DETECTION_ENHANCEMENTS.md), [ML_WALLET_ROADMAP.md](ML_WALLET_ROADMAP.md) | System design, **Masarat** (ownership & operations), business stakeholders, ML |
| **Masarat (platform owner)** | [masarat.md](./masarat.md) → [bank/governance — §2](./bank/governance-and-operations.md#2-operating-authority) | Product ownership, platform operations, integration contracts, support model |

## Audience entry points

| Audience | Start here |
|----------|------------|
| **Software engineers** | [developers/README.md](./developers/README.md) → [ARCHITECTURE.md](./ARCHITECTURE.md) → `src/Applications/*/README.md` (platform repo) |
| **Integration / bank IT** | [BACKEND-INTEGRATION-GUIDE.md](./BACKEND-INTEGRATION-GUIDE.md) → [integrations/masarat-wallet-flowguard-integration.md](./integrations/masarat-wallet-flowguard-integration.md) → [TENANT_INGESTION_KEYS.md](./TENANT_INGESTION_KEYS.md) |
| **Platform & SRE** | [team-runbooks/README.md](./team-runbooks/README.md) → [operations/aml-transaction-queue-runbook.md](./operations/aml-transaction-queue-runbook.md) |
| **Security** | [team-runbooks/security-runbook.md](./team-runbooks/security-runbook.md) |
| **Release engineering** | [team-runbooks/deployment-runbook.md](team-runbooks/deployment-runbook.md) → `deployment/QUICK-START.md` in the [platform](#related-material-outside-the-docs-repository) repository |
| **Executives, compliance, Masarat + bank leadership** | [masarat.md](./masarat.md), [bank/README.md](./bank/README.md) |

## Related material outside the docs repository

This site is **documentation only**. The FlowGuard **application**, `deployment/`, and `src/` live in a separate **platform** clone (the product repository you build and run from source).

| Path (in platform repo) | Description |
|------|------|
| `README.local.md` | Local stack: smoke tutorial, port table, env notes (often `src/docker-compose` or local scripts) |
| `deployment/QUICK-START.md` | Scripted deploy entry; pick one bootstrap path and match env files and image tags. |
| `deployment/PRODUCTION-SETUP.md` | Production setup detail. |
| `deployment/CONSUL_KV_INGESTION_SUBSCRIPTION.md` | Consul KV keys for ingestion and subscription. |
| `src/Applications/FlowGuard.Analyzer/README.md` | Analyzer endpoint notes. |
| `src/Applications/FlowGuard.Management/README.md` | Management API notes. |
