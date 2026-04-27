# Developer guide

Master index: [docs/README.md](../README.md). **Product owner:** [Masarat](../masarat.md) maintains this repository and FlowGuard releases.

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20 LTS](https://nodejs.org/) (for Angular; match `frontend/AMLPortal/package.json` engines if present)
- Docker Engine (optional but recommended for full stack)
- PostgreSQL client tools (optional, for ad hoc SQL)

## Repository map

| Path | Role |
|------|------|
| `src/FlowGuard.sln` | Solution entry |
| `src/Applications/` | Runnable hosts: `FlowGuard.Analyzer`, `FlowGuard.Management`, `FlowGuard.MockBankAdapter`, and console `FlowGuard.RulesTestConsole` |
| `src/Services/` | Business logic and EF contexts |
| `src/Core/FlowGuard.Core/` | Shared models and DTOs |
| `src/Clients/FlowGuard.Analyzer.Client/` | Publisher and HTTP client for Analyzer |
| `src/Tests/` | xUnit test projects |
| `frontend/AMLPortal/` | Angular 17 application |
| `deployment/` | Compose files, scripts, infra configs |

## First-time setup

1. Clone the repository.
2. Follow **[README.local.md](../../README.local.md)** — Docker stack, default ports, and **tutorial: first transaction to the portal** (single document; no separate local-smoke guide).
3. Run Management and Analyzer tests after schema changes:

   ```bash
   dotnet test src/FlowGuard.sln --no-build
   ```

   Build first if needed: `dotnet build src/FlowGuard.sln`.

## Integration work

Read in this order:

1. [ARCHITECTURE.md](../ARCHITECTURE.md) — how services connect.
2. [BACKEND-INTEGRATION-GUIDE.md](../BACKEND-INTEGRATION-GUIDE.md) — HTTP, queues, validation, errors.
3. [integrations/masarat-wallet-flowguard-integration.md](../integrations/masarat-wallet-flowguard-integration.md) — if the producer is a wallet or similar channel.

Use OpenAPI on a running Analyzer (`/` Swagger, `/redoc` ReDoc) as the authoritative HTTP contract; the guide explains behaviour that OpenAPI may not spell out (rate limits, obsolete routes, signing).

## Frontend work

- Local dev server: `ng serve` from `frontend/AMLPortal` (see README.local for ports).
- After Docker image builds, hard-refresh the browser so hashed bundles update.
- Runtime API base URL and optional API request logging come from `/assets/config.json` (see portal entrypoint script).

## ML and rules tuning

- Feature and training pipeline notes: [ML_DETECTION_ENHANCEMENTS.md](../ML_DETECTION_ENHANCEMENTS.md)
- Wallet-specific roadmap: [ML_WALLET_ROADMAP.md](../ML_WALLET_ROADMAP.md)

## Contribution rule for documentation

Any merge request that changes:

- public HTTP routes or models,
- queue topology or envelope,
- auth or webhook verification,
- default configuration keys,

must update the matching section in `docs/` in the same merge request.
