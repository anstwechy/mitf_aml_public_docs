# AML system — team runbooks

Operational documentation for **running**, **deploying**, and **securing** FlowGuard in real environments. In the default model, **production execution** of these practices is **Masarat-led** as platform operator; runbooks are the technical reference for *how* the stack is operated ([masarat.md](../masarat.md)).

| Runbook | Use when |
|---------|----------|
| [operations-runbook.md](./operations-runbook.md) | Day-2 operations, health checks, monitoring, incident triage |
| [deployment-runbook.md](./deployment-runbook.md) | Releases, compose vs swarm, rollback |
| [security-runbook.md](./security-runbook.md) | Hardening, secrets, security incidents |

**Queue-specific operations:** [../operations/aml-transaction-queue-runbook.md](../operations/aml-transaction-queue-runbook.md) (topology, DLQ, manual verification).

**Parent index:** [../README.md](../README.md)

## Maintenance

When you change `deployment/docker-compose*.yml`, health endpoints, auth middleware, or webhook verification, update the relevant runbook in the **same** change request.
