# FlowGuard — compliance and supervision lens

**Audience:** MLRO / compliance leadership, second-line risk, internal audit, and teams preparing for **supervisory** or **regulatory** interaction.  
**Not covered here:** API specifications, infrastructure commands, or detailed control implementation (see technical documentation from [docs/README.md](../README.md)).

This page explains **what examiners and auditors typically care about** in abstract terms and how FlowGuard’s **design intent** supports defensible documentation. It is **not** legal advice and does not guarantee any regulatory outcome.

**Operating model:** **Masarat** is the **platform operator** for the **service**; evidence requests about **uptime, change, and security of the system** are often directed at **Masarat** under the **outsourcing** file, while the **bank** shows **programme** effectiveness and **use** of the system. [masarat.md](../masarat.md), [governance §2](./governance-and-operations.md#2-operating-authority).

The **bank** remains responsible for:

- **AML/CFT programme** design, governance, and effectiveness.
- **Policies and procedures** (including alert handling, escalation, and reporting to authorities where required).
- **Model risk management** where statistical or ML components are used—validation, documentation, and periodic review appropriate to your jurisdiction.
- **Oversight of outsourcing** and of **Masarat** as platform operator, where the service is run by Masarat (evidence, contract, and regulatory expectations as in your jurisdiction).

**Masarat** holds **operating authority** for the FlowGuard **platform** (run, release, support as agreed). **Regulatory and programme duties** for the **bank’s** use of the service stay with the **institution**—see [governance and operations, §2](./governance-and-operations.md#2-operating-authority) and §2.3 there.

FlowGuard provides **systems and records** that support these duties; it does not replace them.

## 2. Typical supervisory themes (mapped to product intent)

| Theme | What supervisors often look for | How the product supports documentation (conceptually) |
|--------|-----------------------------------|--------------------------------------------------------|
| **Alert and case handling** | Timeliness, traceability, consistent dispositions | Alerts and **cases** with user actions and timestamps; exports or queries per your policy |
| **Detection approach** | Transparency of rules and models; change control | Configuration and model metadata (as deployed); **change tickets** remain a bank responsibility |
| **Watchlist / screening** | Coverage and timeliness where applicable | Screening behaviour as **configured** and evidenced in your operating model |
| **Management information** | MI for boards and committees | Reporting surfaces in the portal; definitions and scope follow **configuration and contract** |
| **Independent review** | Second line and internal audit access to evidence | Evidence is in **records and exports**—access policies are yours to define |

## 3. Model and rule change (non-technical)

When **rules**, **thresholds**, or **model versions** change:

- Expect your **model risk** or **change advisory** process to record **who approved**, **why**, and **when**.
- The system can hold **configuration history and model metadata** where deployed; the **institution** remains accountable for the control design.

Forward-looking ML quality topics (e.g. wallet channel) are described separately in [ML_WALLET_ROADMAP.md](../ML_WALLET_ROADMAP.md) for product direction—not as a regulatory commitment.

## 4. Fraud review vs AML

If **fraud review** is in scope, clarify in your policies:

- Whether fraud dispositions feed **AML cases** or remain **separate**.
- How **dual** fraud and AML concerns are escalated and documented.

The platform can support a **separate review path**; alignment with the bank’s policy is a **governance** decision. See also [governance-and-operations.md](./governance-and-operations.md).

## 5. Evidence checklist (illustrative)

Use this as a **conversation starter** with legal and compliance—not an exhaustive list.

- Case files with **decision rationale** and **time bounds** for review.
- **Configuration and change** records for material detection logic.
- **Key and access** governance for transaction ingestion and administration.
- **Incident** and **continuity** evidence where operational failures affected monitoring (link to your ITSM and vendor process).

Deeper runbook context for **operations** and **security** (for control owners, not this page’s primary audience): [team-runbooks/operations-runbook.md](../team-runbooks/operations-runbook.md), [team-runbooks/security-runbook.md](../team-runbooks/security-runbook.md).

## 6. Related reading

- [masarat.md](../masarat.md) — Masarat: product owner, operator, and integration authority.
- [governance-and-operations.md](./governance-and-operations.md) — roles, custody, continuity, high-level evidence table.
- [executive-overview.md](./executive-overview.md) — strategic intent and business outcomes.
- [GLOSSARY.md](../GLOSSARY.md) — product terms (alert, case, tenant, etc.).
