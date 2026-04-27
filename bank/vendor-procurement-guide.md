# FlowGuard — vendor, procurement, and contract desk

**Audience:** vendor management, procurement, legal, and **business owners** who sponsor contracts or renewals.  
**Purpose:** surface **business and contractual dimensions** to align with RFP, MSA, order forms, and data protection schedules—without substituting for your counsel.

**Default operating model:** **Masarat** is the **platform owner and operator** of FlowGuard; the **bank** is the **tenant** and **actor on its data** in the service. The agreement should name **operating responsibility**, **data roles**, and **escalation paths** to match that split (see [governance and operations, §2](./governance-and-operations.md#2-operating-authority)). **What Masarat commits to commercially** (SLA, DPA, audit rights, support) is separate from this repo—start from [masarat.md](../masarat.md) for the role model, then your schedule of services.

Technical integration details belong in the [BACKEND-INTEGRATION-GUIDE.md](../BACKEND-INTEGRATION-GUIDE.md) and related references.

## 1. What to clarify before signature

| Area | Why it matters for leadership |
|------|------------------------------|
| **Service scope** | What is in-product (e.g. screening, case management, reporting) vs professional services, customisation, or future roadmap items. |
| **Environments** | Production, UAT, disaster recovery, and which party (**Masarat** as operator vs **bank**-only sandboxes) runs each. |
| **Support and severity** | Response and resolution **targets** (business hours, critical incident paths)—ordinarily **Masarat** as operator for the live platform. |
| **Change windows** | **Releases** and **maintenance**: ordinarily **Masarat-led**; how the bank is notified and how emergency fixes are approved. |
| **Exit and portability** | How **data** and **configurations** can be exported on exit; minimum periods for access to records. |

Operational **runbooks** in this repository help **technical** teams execute; **contractual** RTO/RPO and penalties belong in the **agreement**, not in open-source documentation alone.

## 2. Data and privacy (framing, not a DPA)

Typical data categories in an AML transaction monitoring context include **transaction and counterparty identifiers**, **amounts and timestamps**, and **case and user audit** data. Exact categories, retention, and legal basis are **jurisdiction- and contract-specific**.

**Questions** for your data protection and security teams:

- Where does **data reside** (region / cloud), and is it consistent with your policies?
- Who are **subprocessors** (hosting, support), and how is notification handled?
- How are **ingestion keys** and **admin credentials** rotated and revoked?
- What **logging** and **access control** apply to the operational portal and APIs?

For security control topics aimed at **implementation**, see [team-runbooks/security-runbook.md](../team-runbooks/security-runbook.md).

## 3. Commercial constructs (illustrative)

| Topic | Stakeholder question (examples) |
|--------|---------------------------------|
| **Volume and metering** | If **subscriptions** or **ingress limits** apply, who owns forecast vs true-up, and what happens at limit? |
| **Liability and indemnities** | How are errors in detection, availability gaps, and regulatory fines addressed—per your policy and local law. |
| **Audits and assurance** | Rights for **on-site** or **remote** audit, **SOC reports**, and **penetration test** evidence. |
| **Intellectual property** | Ownership of **rules content**, **tuning parameters**, and **exports** the bank creates. |

## 4. Service continuity in business terms

- **Resilience** expectations (e.g. backup, recovery drills) should be **expressed in the contract** with **Masarat**; the bank is not the day-to-day **platform** operator in the default model.
- **Business continuity** playbooks: the bank covers **its people, escalation, and feed of data**; **Masarat** covers **service restoration** for the platform. Tabletop exercises should reflect that handover.

Background for **technical** continuity: [governance-and-operations.md](./governance-and-operations.md) and [team-runbooks/operations-runbook.md](../team-runbooks/operations-runbook.md).

## 5. Related reading

- [masarat.md](../masarat.md) — full Masarat role (ownership, operations, support, security split).
- [executive-overview.md](./executive-overview.md) — strategic value and what leadership should expect.
- [governance-and-operations.md](./governance-and-operations.md) — roles, custody, operational handover.
- [compliance-and-supervision.md](./compliance-and-supervision.md) — exam and evidence framing.
