# FlowGuard — governance and operations overview

**Audience:** bank compliance leadership, risk committees, vendor oversight, and IT management.  
**Not covered here:** API fields, queue names, or deployment commands (see technical docs linked from [docs/README.md](../README.md)).

## 1. What FlowGuard does

FlowGuard ingests transaction data from **agreed channels** (including Masarat wallet and other institution feeds), evaluates each transaction against institution policy (rules and statistical models), applies watchlist screening where configured, and raises **alerts** for staff review. Confirmed issues are tracked through **cases** with an audit trail suitable for supervisory review.

A parallel path may exist for **fraud review** (behavioural fraud scoring). That path is typically review-oriented and does not replace the bank’s own fraud policies unless contractually agreed.

## 2. Operating authority

**Scope:** *Masarat* as platform owner and operator; the *bank* as tenant and actor on its data. Contractual terms take precedence; this is descriptive.

### 2.1 Masarat — product owner and operator

**Masarat** owns FlowGuard as a product and, in the ordinary course, **runs the system**: application and supporting **infrastructure as contracted**, **deployments and releases**, **platform monitoring**, **incident response** for the service, **maintenance windows**, and **support** per agreed severities. Masarat also drives **product roadmap** and **software governance** for the codebase. The **bulk of day-to-day operational responsibility** for keeping the service up, healthy, and aligned with the deployed product sits with **Masarat**, not with the bank’s IT team as platform operator.

Technical staff use [team-runbooks](../team-runbooks/README.md) and [operations](../operations/aml-transaction-queue-runbook.md) to describe *how* the stack is operated; **execution** of that operating model in production is **Masarat’s remit** under the agreement, unless a specific deal explicitly shares or transfers parts of operations to the bank.

A fuller statement of **product ownership, channels, support model, and security operating split** is in **[masarat.md](../masarat.md)**.

### 2.2 The bank — tenant and actor on its data

The **bank** is not a co-operator of the underlying platform. The bank **uses** the service as a **tenant**: it **supplies** its transaction and related data through agreed interfaces, **configures** what the product allows for its organisation (rules, thresholds, users, credentials within scope), and **acts** on that data through analysts and administrators in the AML Portal (reviews, dispositions, cases, reporting relevant to its business). In this sense the bank is **an actor on its data**—making **decisions and operational use**—while **Masarat** provides and **runs** the system in which those actions occur.

### 2.3 Regulatory and programme accountability

**Legal and supervisory duties** for the bank’s **AML/CFT programme**, **policies**, **effectiveness**, and **regulatory reporting** remain with the **institution**, as required by law and practice. **Masarat’s authority** is **service operation and product delivery**, not a transfer of the bank’s statutory or prudential obligations. The bank must still demonstrate **oversight of outsourcing** where the platform is vendor-operated, as your jurisdiction requires.

### 2.4 Roles and responsibilities (summary)

| Party | Primary focus |
|--------|----------------|
| **Masarat** | Product ownership; **operation of the FlowGuard platform** (availability, patching, platform-level incidents, releases, monitoring); **support**; security and resilience of the **service** as contracted. |
| **Bank — leadership / MLRO** | Programme governance, risk appetite, and regulatory reporting for the **bank’s** monitoring and use of the service. |
| **Bank — compliance operations** | Day-to-day **alert and case handling** on the **bank’s** data in the portal; dispositions and quality control. |
| **Bank — integration** | Reliable **data feed** into the service, custody and rotation of **ingestion credentials**, and secure connectivity to **endpoints Masarat** exposes—without taking over **core platform** operations. |

## 3. Data custody and boundaries

- The bank’s data is **processed in the FlowGuard service operated by Masarat** under the **agreement** (regions, retention, subprocessing, and DPA as agreed).
- **Ingestion credentials** (API keys) identify which tenant’s traffic is accepted; the bank must protect and rotate them; **platform-side** key issuance and validation are part of the **operated service**.
- **Subscriptions and metering** (where enabled) limit or record ingress volume by plan; business owners should align plan tier with expected transaction volume.

## 4. Service continuity

Operational targets (RTO/RPO, maintenance windows, on-call escalation for the **platform**) should be **written in the contract** with **Masarat**, not inferred from this repository. Reference material for people supporting the stack:

- [team-runbooks/operations-runbook.md](../team-runbooks/operations-runbook.md) — monitoring, incidents, recovery steps.
- [team-runbooks/deployment-runbook.md](../team-runbooks/deployment-runbook.md) — release process (typically **Masarat**-led for the operated service).

Banks should require **evidence of backup and restore** for the data stores underpinning the service before production sign-off; the operations runbook notes where automation may still need to be defined.

## 5. Security and access

- Human access to the AML Portal is **authenticated**; role separation (e.g. administrator vs analyst) should follow least privilege. **Platform-level** access control and service security are operated by **Masarat** as contracted.
- **Integration endpoints** sit per deployment; network controls (VPN, private link, IP allow lists) are agreed between **the bank and Masarat** in the security annex.
- Security hardening expectations: [team-runbooks/security-runbook.md](../team-runbooks/security-runbook.md).

## 6. Evidence for auditors

What auditors usually ask for—and what the system should be able to demonstrate (often with **Masarat** providing **platform** evidence and the **bank** providing **programme and use** evidence):


| Topic | Evidence |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| Alert handling | Case records, timestamps, user actions, disposition reasons (export or DB query per policy). |
| Model and rule changes | Change tickets, configuration history, versioned ML model metadata where deployed. |
| Ingress integrity | Access logs, key rotation records, DLQ monitoring for poison messages. |
| **Outsourcing / operation** | Contractual allocation of operations; **vendor** evidence (e.g. change, availability) for the **platform** as applicable. |


## 7. Glossary

See [GLOSSARY.md](../GLOSSARY.md) for product terms (alert, case, tenant, webhook, etc.).

## 8. Related stakeholder pages

- [masarat.md](../masarat.md) — Masarat: product owner, platform operator, documentation authority.
- [executive-overview.md](./executive-overview.md) — strategic value and what leadership should expect.
- [compliance-and-supervision.md](./compliance-and-supervision.md) — MLRO and supervisory exam framing.
- [vendor-procurement-guide.md](./vendor-procurement-guide.md) — contract, procurement, and data-desk questions.
