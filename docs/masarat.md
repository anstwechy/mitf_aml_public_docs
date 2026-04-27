# Masarat — the team behind the platform

**Masarat (Masarat Technology)** is the **product owner**, **primary engineering organisation**, and **default platform operator** for **FlowGuard** — the AML transaction monitoring and case-management stack documented here. We did not just ship a feature list: we own **roadmap, codebase quality, integration contracts, and how the system runs in production** so banks get a product that is **defensible, integrable, and operable**. **Governance, legal liability, and commercial terms** for any given bank are still defined in **contract** and in [bank/governance-and-operations.md](./bank/governance-and-operations.md#2-operating-authority) — this page is the capability story, not the legal schedule.

## What we own

| Area | What we bring |
|------|----------------|
| **Product** | We steer FlowGuard’s direction: **AML screening**, **cases**, **fraud review** flows, **reporting**, **subscription and ingestion** features — and we align major roadmap themes and releases with what institutions actually need in production. |
| **Codebase** | We maintain the **canonical source** and **versioned releases**; change history and engineering discipline are **Masarat-led** unless a rare engagement says otherwise. |
| **Quality** | We set the bar for **tests**, code standards, and security-related fixes, coordinated with the [security runbook](./team-runbooks/security-runbook.md) — the platform is built to be **extended without breaking the core**. |
| **Documentation** | We keep this **docs** corpus as the **single source of truth** next to the code; when behaviour or APIs move, the docs **move with them**. |

## The integration surface we stand behind

We **define, document, and maintain** the contracts that let external systems talk to FlowGuard with confidence:

- **RabbitMQ** topology and the `TransactionQueueMessage` envelope — built for **at-least-once, high-throughput** ingestion, not ad hoc REST sprawl.
- **HTTP** ingress, **subscription metering**, and **ingestion API keys** via Management — for governed, auditable access.
- The **Masarat MITF wallet** path ([integration contract](./integrations/masarat-wallet-flowguard-integration.md)) as part of a coherent **digital channel** story, not a one-off connector.

Banks and integrators **consume** these contracts. They do not **own** the product specification of the platform — that stays with us so the product stays **coherent and evolvable**.

## How we run it (default model)

In production, **Masarat** typically holds **operating authority** for the **service** — the model banks buy when they want a **managed platform**, not a tarball:

- **Infrastructure & runtime** (per contract): hosts, **Docker Compose** or **Swarm** stacks, **PostgreSQL**, **RabbitMQ**, **Redis**, **Consul** where used, and full-stack **observability** — plus **deployments** to agreed environments.
- **Day-2** life: **monitoring**, **on-call**, **maintenance windows**, **patching**, and **coordination** when brokers or data stores affect the product.
- **Support**: **severity-based** triage and resolution for **platform** issues as defined in the agreement.
- **Releases**: **Masarat-led rollouts** of versions, hotfixes, and **configuration baselines** — with the bank in UAT, approvals, and comms where the contract says so.

**Banks** stay responsible for **getting data in reliably**, **users and policy** on that data, **client-side** custody of ingestion credentials, and **regulatory** programme work — not for operating our core product stack as a DIY science project.

## Security and trust

We hold the line on **service security** as agreed: **hardening** the deployed stack, **operational secret rotation**, **vulnerability** handling for the product, and **evidence** (e.g. pen-test, SOC materials) when the contract requires. **Network edge**, **end-user identity governance**, and **outsourcing oversight** on the **bank** side remain with the **institution** — the split is clear and documented so audits have a map.

## Commercial interface

**SLAs, credits, support hours, and escalations** live in the **contract**, not in this repository. [bank/vendor-procurement-guide.md](./bank/vendor-procurement-guide.md) frames how procurement talks to the **technical** reality. This repo is for **build, run, and align** — not for pricing.

## Read next

| Topic | Link |
|--------|------|
| Bank vs Masarat (authority, tenant, data actor) | [bank/governance-and-operations.md §2](./bank/governance-and-operations.md#2-operating-authority) |
| Executive summary | [bank/executive-overview.md](./bank/executive-overview.md) |
| Supervisory / MLRO | [bank/compliance-and-supervision.md](./bank/compliance-and-supervision.md) |
| System architecture (technical) | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Glossary | [GLOSSARY.md](./GLOSSARY.md) |
