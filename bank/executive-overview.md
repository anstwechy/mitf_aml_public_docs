# FlowGuard — executive overview

**Audience:** board members, senior management, programme sponsors, and non-technical steering committees.  
**Purpose:** describe what the platform achieves for the institution in business terms, without implementation detail.

For the full split between **Masarat** (operator) and the **bank** (tenant and data actor), see [governance and operations, §2](./governance-and-operations.md#2-operating-authority).

## Masarat and the bank: who runs the system

| Party | Role in one sentence |
|--------|------------------------|
| **Masarat** | **Product owner and platform operator** — runs FlowGuard end-to-end as the service provider (infrastructure, releases, platform monitoring, incident response, and support as contracted). Holds the **operating authority** for the system in production. |
| **Bank** | **Tenant and business actor on its data** — sends data in, configures what the product allows, and works alerts and cases **on that data**; does **not** run the core platform. |

**Accountability split:** the bank remains responsible for its **AML programme and regulatory duties**; Masarat is responsible for **operating the service and delivering the product** as agreed. Details: [governance and operations, §2](./governance-and-operations.md#2-operating-authority).

## Strategic intent

FlowGuard supports **transaction monitoring for anti–money laundering (AML)** and related operational workflows. It helps the institution:

- **Detect** activity that may warrant review according to agreed rules, models, and lists.
- **Document** decisions in **cases** with an audit trail suitable for internal governance and supervisory dialogue.
- **Operate** through a single operational portal so analysts and administrators work in one controlled environment.

The platform **does not replace** the bank’s own policies, risk appetite, or regulatory obligations. It is a **tool** that must sit inside your governance framework (policies, approvals, second-line oversight, and board reporting).

## What leadership should expect

| Topic | Plain-language expectation |
|--------|----------------------------|
| **Human review** | Alerts and cases are designed for **trained staff** to review; automation assists prioritisation and consistency, not blind acceptance. |
| **Models and rules** | Statistical and rule-based logic is **configurable** and should be **owned** by the institution (with agreed change control). Model outputs are one input among many. |
| **Fraud vs AML** | Where **fraud review** is enabled, it is typically a **separate review path** from AML case workflow unless your organisation deliberately aligns them. |
| **Outsourcing** | Under this model, **Masarat** operates the platform; the bank’s **oversight of outsourcing** and contract terms (SLA, data, exit) are central—not ad hoc IT items alone. |

## What Masarat delivers (beyond “software”)

**Masarat** provides not only the **FlowGuard** application but the **operated service** in the default model: **roadmap and releases**, **infrastructure and monitoring**, **incident response** and **support** for the platform, and the **integration contracts** (e.g. wallet, queues, APIs) that banks plug into. Extended profile: [masarat.md](../masarat.md).

## Capabilities in business language

- **Ingestion** — Agreed channels deliver transactions to screening in a controlled, identifiable way (tenant-scoped where relevant).
- **Screening** — Rules, watchlists (where configured), and anomaly-style scoring help surface transactions for attention.
- **Case management** — Escalation, assignment, dispositions, and reporting support sustained investigations and record-keeping.
- **Reporting** — Operational and compliance-style reporting exists for oversight; exact metrics and scope follow **product configuration and contract**.

## Outcomes (not technology promises)

Meaningful outcomes for the institution are usually framed as: **quality of detection**, **timeliness of review**, **consistency of documentation**, and **demonstrable control** during exams—not raw alert counts alone. Targets (e.g. review SLAs, model performance) should be set in **internal policy** and reflected in **contract or SLA** where applicable.

## Further reading

| Need | Document |
|------|----------|
| Masarat — ownership, operations, channels, support | [masarat.md](../masarat.md) |
| Roles, custody, continuity, auditor-oriented evidence | [governance-and-operations.md](./governance-and-operations.md) |
| Supervisory and MLRO lens | [compliance-and-supervision.md](./compliance-and-supervision.md) |
| Procurement, contracts, data handling questions | [vendor-procurement-guide.md](./vendor-procurement-guide.md) |
| Terminology | [GLOSSARY.md](../GLOSSARY.md) |
