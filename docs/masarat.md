# Masarat — platform ownership and operations

**Masarat** (Masarat Technology) is the **product owner**, **primary engineering organisation**, and **platform operator** for **FlowGuard**, the AML transaction monitoring and case-management stack documented in this repository. This page summarises that role for every audience; **governance, legal liability, and commercial terms** for a given bank are always defined in **contract** and in [bank/governance-and-operations.md](./bank/governance-and-operations.md#2-operating-authority).

## Product and software ownership

| Area | Masarat’s role |
|------|----------------|
| **Product** | Owns the FlowGuard product direction: capabilities (AML screening, cases, fraud review paths, reporting, subscription and ingestion features), major roadmap themes, and release planning. |
| **Codebase** | Maintains the canonical source in this repository; versioned **releases** and **change history** are Masarat-led unless a specific engagement delegates fork maintenance (unusual). |
| **Quality** | Drives **engineering standards**, automated tests, and technical debt priorities for the platform; coordinates security-related fixes in line with the [security runbook](./team-runbooks/security-runbook.md). |
| **Documentation** | Owns this **`docs/`** corpus as the technical and business **source of truth** alongside the code; updates are expected in the same change sets as material behaviour or interface changes. |

## Channel and integration ecosystem

Masarat **defines and maintains** the **integration contracts** that connect external systems to FlowGuard, including:

- **RabbitMQ** transaction topology and `TransactionQueueMessage` envelope.
- **HTTP** ingress, subscription metering, and **ingestion API keys** (with Management).
- The **Masarat MITF wallet** and related channel documentation ([integrations/masarat-wallet-flowguard-integration.md](./integrations/masarat-wallet-flowguard-integration.md)) as part of the broader Masarat **digital channel** story.

Banks and bridge teams **consume** these contracts; they do not **own** the product specification of the platform.

## Operational ownership (default model)

In production, **Masarat** ordinarily holds **operating authority** for the **service**:

- **Infrastructure and runtime** (as contracted): hosts, container orchestration or compose stacks, databases, **RabbitMQ**, Redis, observability, and **deployments** to agreed environments.
- **Day-2 operations**: monitoring, **on-call** for platform incidents, **maintenance windows**, **patching** of the application stack, and **coordination** of broker/DB incidents that affect the product.
- **Support**: triage and resolution paths for **platform** issues per **severity** in the agreement.
- **Releases**: **Masarat-led** **rollouts** of new versions, hotfixes, and configuration baselines, with the bank’s involvement defined for UAT, approval gates, and communication.

**Banks** remain responsible for: feeding **data** reliably, **users** and **policies** on that data, **ingestion secret** custody on the client side, and **regulatory** programme delivery—not for running the core platform as operator.

## Security and trust operating model

Masarat is accountable for the **service security** posture as contracted: **hardening** the deployed stack, **rotating** platform-side secrets in operational processes, **vulnerability** response for the product, and providing **evidence** (e.g. pen-test summaries, SOC reports) where the contract requires. **Bank-side** network controls, identity governance for **end users**, and **oversight of outsourcing** remain **institution** responsibilities.

## Commercial and support interface

**Contracts** define **SLAs**, **credits**, **support hours**, and **escalation paths** to Masarat. This repository does **not** set commercial terms; it supports **implementation** and **stakeholder alignment** only. Procurement framing: [bank/vendor-procurement-guide.md](./bank/vendor-procurement-guide.md).

## Where to read more

| Topic | Link |
|--------|------|
| Bank vs Masarat (authority, tenant, data actor) | [bank/governance-and-operations.md §2](./bank/governance-and-operations.md#2-operating-authority) |
| Executive summary | [bank/executive-overview.md](./bank/executive-overview.md) |
| Supervisory / MLRO | [bank/compliance-and-supervision.md](./bank/compliance-and-supervision.md) |
| System architecture (technical) | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Glossary | [GLOSSARY.md](./GLOSSARY.md) |
