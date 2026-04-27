# Backend integration guide — AML Analyzer

This document is for backend teams integrating **bank transaction screening** and **security / monitoring events** with the FlowGuard AML Analyzer. The **interface contracts** and **RabbitMQ topology** described here are **owned and maintained by [Masarat](masarat.md)** as the platform vendor; this repository reflects the current **implemented** behaviour. It covers the Analyzer API, validation rules, RabbitMQ topology, and event signing behavior.

## Table of contents

1. [Overview](#overview)
2. [Multi-tenant routing](#multi-tenant-routing)
3. [Base URL, discovery, and headers](#base-url-discovery-and-headers)
4. [Part A — Transactions](#part-a-transactions)
5. [Part B — Security and monitoring events](#part-b-security-and-monitoring-events)
6. [Request and response models](#request-and-response-models)
7. [Validation (transactions)](#validation-transactions)
8. [Rate limiting and HTTP 429](#rate-limiting-and-http-429)
9. [Error handling](#error-handling)
10. [Best practices](#best-practices)
11. [Testing](#testing)
12. [References in this repository](#references-in-this-repository)

## Overview

The Analyzer service provides:

- **AML transaction analysis** — ingest transactions (preferably via RabbitMQ), score risk, run rules, persist results, and forward alerts to the Management service via webhook when configured.
- **Security monitoring** — ingest signed **mobile / channel events** (authentication, device changes, etc.) for monitoring rules and dashboards.

Production integrations should prefer **message queues** for transactions (and optionally for monitoring events where your deployment supports it). HTTP endpoints for transactions remain available but are marked **obsolete** in code for backward compatibility.

## Multi-tenant routing

Each Analyzer instance is configured for **one bank** via `TenantConfig:BankCode` (see `src/Applications/FlowGuard.Analyzer/appsettings.json`).

- **Transactions** — If the transaction’s bank code (from `customerBankCode` or `bankCode`) does not match the instance’s configured bank, the analyzer **does not process** the transaction as normal AML analysis; the API returns a response with `riskLevel` of `UNKNOWN` and a summary explaining the mismatch (see `AnalyzerAMLService` in `src/Services/FlowGuard.Services.Analyzer`).
- **Monitoring events** — The monitoring pipeline validates that the event’s bank matches the configured tenant before persisting (see `MonitoringService.LogEventAsync` in `src/Masarat.Monitoring.Ingestion`).

Integrators must **route traffic to the correct Analyzer URL or queue** for each bank.

## Base URL, discovery, and headers

### Base URLs (per environment)

Hostnames and ports depend on your deployment (Docker Compose, Kubernetes, etc.). Example service names from internal docs:

- Tejari: `http://analyzer-tejari:8080` (illustrative)
- Sahara: `http://analyzer-sahara:8081` (illustrative)
- Jumhoria: `http://analyzer-jumhoria:8084` (illustrative)

Use the URLs provided by your platform team; do not hardcode ports without confirming the deployment manifest.

### JSON and content type

Send:

```http
Content-Type: application/json
```

ASP.NET Core uses **camelCase** JSON property names by default. Examples below use camelCase (`transactionId`, `accountNumber`, …).

### Optional headers (rate limiting)

The Analyzer applies sliding-window rate limits per client (see [Rate limiting](#rate-limiting-and-http-429)). You may supply:

- `X-API-Key` — if present, used as the client identity for rate limiting (preferred behind NAT).
- `X-Tenant-Id` or `X-Bank-Code` — participates in the rate-limit key bucket.

### Documentation (Swagger / ReDoc)

When the service is running, OpenAPI is exposed; the app maps Swagger UI at the **root** (`/`) and ReDoc at `/redoc` (see `Program.cs` in `src/Applications/FlowGuard.Analyzer`).

---

## Part A — Transactions {#part-a-transactions}

### Recommended: RabbitMQ (MassTransit consumer) {#recommended-rabbitmq-masstransit-consumer}

Configuration lives under `TransactionQueue` and uses the **same RabbitMQ connection section** as monitoring: `MasaratMonitoring:RabbitMq` (section name `MasaratMonitoring:RabbitMq` — see `RabbitMqOptions.SectionName` in `src/Masarat.Monitoring.Messaging`).

Defaults in `appsettings.json`:

| Setting | Example / template |
|--------|----------------------|
| Exchange | `aml.transactions` (topic) |
| Routing key | `transaction.{BankCode}` (e.g. `transaction.TEJARI`) |
| Queue | `aml.transactions.{BankCode}` |
| Dead-letter exchange | `aml.transactions.dlq` |
| Dead-letter queue | `aml.transactions.dlq.{BankCode}` |
| MassTransit | `TransactionQueue:UseMassTransit` = true |
| Retries | `MaxRetryAttempts`, `RetryDelayMs` (exponential retry in consumer setup) |

The message envelope type is `TransactionQueueMessage` (`src/Core/FlowGuard.Core/Models/TransactionQueueMessage.cs`):

```json
{
  "messageId": "uuid",
  "timestamp": "2025-01-15T10:30:00Z",
  "bankCode": "TEJARI",
  "retryCount": 0,
  "correlationId": "optional-correlation-id",
  "messageVersion": "1.0",
  "routingKey": "optional",
  "transaction": {
    "transactionId": "TEJARI-20250115-001",
    "accountNumber": "TEJ12345678",
    "amount": 75000.00,
    "currency": "LYD",
    "transactionDate": "2025-01-15T10:30:00Z"
  }
}
```

The Analyzer client publisher (`src/Clients/FlowGuard.Analyzer.Client/Services/TransactionQueuePublisher.cs`) serializes this envelope with **camelCase** and publishes to the configured exchange with routing key from `AnalyzerClientSettings.RabbitMq.RoutingKeyTemplate` (typically `transaction.{BankCode}`).

### HTTP endpoints (obsolete but supported)

Controller: `TransactionAnalysisController` — route prefix `api/v1/TransactionAnalysis`.

| Method | Path | Behavior |
|--------|------|----------|
| POST | `/api/v1/TransactionAnalysis/submit` | **202 Accepted** — queues analysis in a background task; returns immediately. |
| POST | `/api/v1/TransactionAnalysis/analyze` | **200 OK** — synchronous full analysis result. |
| POST | `/api/v1/TransactionAnalysis/analyze-batch` | **200 OK** — parallel analysis per item. |

These actions are marked `[Obsolete]` in code; new integrations should use the queue.

### Health check

`GET /health` — used by clients and load balancers (`AnalyzerClientService.HealthCheckAsync` calls `/health`).

---

## Part B — Security and monitoring events {#part-b-security-and-monitoring-events}

### HTTP ingestion (primary integration surface)

**Endpoint:** `POST /api/v1/monitoring/events`

**Controller:** `MonitoringEventsController` (`src/Applications/FlowGuard.Analyzer/Controllers/Monitoring/MonitoringEventsController.cs`).

**Success:** **202 Accepted** with a small JSON body including `eventId`, `bankId`, `correlationId`, `channel`.

**Validation failure / bad signature:** **400 Bad Request** with `{ "success": false, "errors": [ ... ] }`.

Payload model: `MobileEventPayload` (`src/Masarat.Monitoring.Ingestion/Models/MobileEventPayload.cs`). Important fields:

| Field | Notes |
|-------|--------|
| `bankId` | Required — bank identifier (must match tenant routing; may be resolved against the Banks table). |
| `eventType` | String; mapped to enum (`Authentication`, `CredentialChange`, `Transaction`, `AccountOperation`, `SystemEvent`) — see `MonitoringEventMapper`. |
| `eventSubType` | String; maps to `EventSubType` (e.g. `LoginAttempt`, `Logout`, …). |
| `channel` | String; maps to `ChannelType` (`Mobile`, `Web`, `SMS`, `Api`). |
| `timestampUtc` | Required — must not be default; use UTC ISO 8601. |
| `isSuccessful`, `failureReason` | As applicable |
| `signature` | Base64-encoded **HMAC-SHA256** over the canonical string (see below). |
| `signingKeyId` | Optional; defaults to `SignatureValidation:DefaultKeyId` if omitted. |
| `metadata` | Optional string dictionary; included in canonical payload in sorted key order. |

#### HMAC signing (integrators must implement)

When `SignatureValidation:Enabled` is `true` (default in `appsettings.json`), the server validates the signature using `HmacSignatureValidator`:

- Algorithm: **HMAC-SHA256** over UTF-8 bytes of the **canonical string**.
- Signature on the wire: **Base64** encoding of the raw HMAC bytes.
- Secret: looked up from `SignatureValidation:HmacSecrets:{signingKeyId}` (case-insensitive key id).

Canonical string construction (must match `MobileEventIngestionService.BuildCanonicalPayload` line-for-line):

1. Concatenate lines in this order (each line ends with `\n` except you build with `AppendLine` which adds newline per line on .NET):
   - `bankId`, `tenantId`, `userId`, `accountId`, `deviceId`, `appId`
   - `eventType`, `eventSubType`
   - `isSuccessful` (True/False as .NET would output)
   - `failureReason`, `channel`
   - `timestampUtc` as **round-trip ISO 8601** (`ToUniversalTime().ToString("O")`)
   - `correlationId`, `ipAddress`, `geolocation`, `phoneNumber`, `appVersion`, `oSType`
   - `amount` formatted as **two decimal places** (`F2`) if present, else empty line
   - `transactionType`, `operationType`
2. If `metadata` is non-empty: append lines `key:value` for each entry sorted by key (ordinal), one per line.

The canonical string uses .NET `StringBuilder.AppendLine`, which follows the **platform newline** (typically `\n` on Linux deployments). Integrators must produce the **same byte sequence** as the Analyzer host when computing HMAC. Add a unit test that compares your canonical string to a **known-good vector** from the AML team if signatures fail in integration.

**Development only:** disabling signature check — set `SignatureValidation:Enabled` to `false` (non-production only).

### Querying events (read API)

`GET /api/v1/monitoring/events/{bankId}`

Query parameters include pagination (`page`, `pageSize`), time range (`from`, `to`), and filters (`eventType`, `eventSubType`, `isSuccessful`, `channel`) — integers map to enum ordinals as implemented in the controller.

### RabbitMQ (optional path for mobile events)

`MasaratMonitoring:RabbitMq` in `appsettings.json` defines:

- Exchange: `monitoring.events` (topic)
- Queue template: `monitoring.mobile-events.{BankCode}`
- Binding routing key pattern: `mobile.{BankCode}`

A background consumer (`MobileEventQueueConsumer`) processes messages from the queue when messaging is enabled. Prefer HTTP signing for greenfield integrations unless your platform already publishes to this exchange.

### Test helper endpoint

`POST /api/v1/monitoring/events/test/trigger-rules?bankCode=TEJARI` — generates sample events for rule testing; **not** for production use.

---

## Request and response models

### TransactionAnalysisRequest (core model)

Defined in `src/Core/FlowGuard.Core/Models/DTOs/Requests/DTOs.cs` as `TransactionAnalysisRequest`.

| Property | Type | Notes |
|----------|------|--------|
| `transactionId` | string | Business unique id. |
| `accountNumber` | string | **Required by API validation** (see below). |
| `customerBankCode` | string? | Sender / customer bank. |
| `beneficiaryAccount` | string? | |
| `beneficiaryBankCode` | string? | Cross-bank transfers. |
| `beneficiaryName` | string? | |
| `beneficiaryCountryCode` | string? | |
| `amount` | decimal | Must be greater than zero. |
| `currency` | string | ISO 4217, **three uppercase letters** (e.g. `LYD`). |
| `transactionDate` | datetime | UTC recommended; must not be default; validator allows up to **5 minutes** in the future for clock skew. |
| `transactionType` | string? | e.g. `TRANSFER`, `WIRE_TRANSFER`. |
| `productId` | string? | |
| `correlationId` | string? | Tracing. |
| `description` | string? | |
| `bankCode` | string? | Often same as customer bank. |
| `branchCode` | string? | |
| `customerId` | string? | |
| `customerName` | string? | |
| `customerType` | string? | |
| `countryCode` | string? | |
| `channel` | string? | e.g. branch, mobile. |

### TransactionAnalysisResponse (abbreviated)

| Property | Description |
|----------|-------------|
| `transactionId` | Echo. |
| `riskScore` | 0–1 (decimal). |
| `riskLevel` | See [Risk levels](#risk-levels). |
| `isFlagged` | True if rules fire or score threshold met. |
| `summary` | Human-readable summary. |
| `analyzedAt` | UTC timestamp. |
| `anomalyPrediction` | Optional ML details when returned by the pipeline. |
| `alerts` | List of `AMLAlertDto` items when rules generate alerts. |

### Risk levels

The analyzer derives levels from score in `AnalyzerAMLService`:

| Score range | `riskLevel` |
|-------------|-------------|
| ≥ 0.8 | `CRITICAL` |
| ≥ 0.6 | `HIGH` |
| ≥ 0.4 | `MEDIUM` |
| Else | `LOW` |

If the bank code does not match the configured tenant, the service returns **`UNKNOWN`** with a rejection summary (no normal scoring).

The older documentation’s `MINIMAL` band is **not** used by the current implementation.

### Example: synchronous analyze (curl)

```bash
curl -s -X POST "http://localhost:8080/api/v1/TransactionAnalysis/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEJARI-20250115-001",
    "accountNumber": "TEJ12345678",
    "amount": 75000.00,
    "currency": "LYD",
    "transactionDate": "2025-01-15T10:30:00Z",
    "customerId": "CUST001",
    "customerName": "Mohammed Ahmed",
    "transactionType": "TRANSFER",
    "beneficiaryAccount": "SAH87654321",
    "customerBankCode": "TEJARI"
  }'
```

---

## Validation (transactions)

`TransactionAnalysisRequestValidator` (`src/Applications/FlowGuard.Analyzer/Validation/TransactionAnalysisRequestValidator.cs`) enforces:

- `transactionId` — not empty, max 100 characters.
- `transactionDate` — not default; not more than ~5 minutes in the future (UTC).
- `amount` — greater than zero.
- `currency` — exactly three **uppercase** A–Z letters.
- **`accountNumber` — required**, max 50 characters.
- Optional fields — length and regex constraints for bank codes, country codes, etc.

Invalid requests receive **400** with FluentValidation error details.

---

## Rate limiting and HTTP 429

`RateLimitingMiddleware` (`src/Services/FlowGuard.Services.Analyzer/Middleware/RateLimitingMiddleware.cs`) applies when `RateLimit:Enabled` is true (default in `appsettings.json`).

- Limits: per **burst** (10s window), per **minute**, per **hour** — configurable (`RequestsPerMinute`, `RequestsPerHour`, `BurstSize`).
- **Health** paths (`/health`, `/Health`) are excluded.
- When exceeded: **429 Too Many Requests** with JSON `{ "error": "RATE_LIMIT_EXCEEDED", ... }` and `Retry-After`, `X-RateLimit-*` headers.

---

## Error handling

### Analyzer errors (example)

For failures during synchronous analysis, the API may return **500** with a body shaped like:

```json
{
  "errorCode": "INTERNAL_ERROR",
  "message": "An unexpected error occurred during analysis",
  "userMessage": "Analysis failed due to an internal error. Please try again or contact support.",
  "traceId": "00-..."
}
```

Use `traceId` when contacting support.

### Monitoring event errors

Signature or validation failures return **400** with `success: false` and an `errors` array.

---

## Best practices

1. **Use RabbitMQ for transactions in production** — aligns with `TransactionQueue` + MassTransit consumer and avoids HTTP rate limits for high volume.
2. **Always send a valid `accountNumber` and correct `currency` format** — requests fail validation otherwise.
3. **Keep clock skew small** — transaction timestamps must be plausible (validator allows a small future skew only).
4. **Route to the correct Analyzer instance per bank** — mismatched bank codes produce `UNKNOWN` / rejected monitoring behavior.
5. **Protect HMAC secrets** — rotate via `SignatureValidation:HmacSecrets` and coordinate `signingKeyId` with the AML team.
6. **Use correlation IDs** on transactions and events for end-to-end tracing (also propagated in queue messages and OpenTelemetry where enabled).
7. **Do not log full payloads** in your adapters if they contain PII; follow your bank’s data policy.

---

## Testing

### Low-risk transaction (HTTP)

```json
{
  "transactionId": "TEST-LOW-001",
  "accountNumber": "TEJ12345678",
  "amount": 500.00,
  "currency": "LYD",
  "transactionDate": "2025-01-15T10:30:00Z",
  "customerId": "CUST001",
  "customerName": "Test Customer",
  "transactionType": "TRANSFER",
  "customerBankCode": "TEJARI"
}
```

### Higher-risk scenario

Use larger amounts, high-risk `beneficiaryCountryCode`, or patterns your sandbox rules target — aligned with `AnomalyDetection` configuration in `appsettings.json`.

### Monitoring event (shape only — signature must be computed)

```json
{
  "bankId": "TEJARI",
  "eventType": "Authentication",
  "eventSubType": "LoginAttempt",
  "channel": "Mobile",
  "timestampUtc": "2025-01-15T10:30:00Z",
  "isSuccessful": false,
  "failureReason": "Invalid credentials",
  "signature": "<base64 HMAC-SHA256>",
  "signingKeyId": "primary"
}
```

---

## References in this repository

| Topic | Location |
|-------|-----------|
| Transaction HTTP API | `src/Applications/FlowGuard.Analyzer/Controllers/TransactionAnalysisController.cs` |
| Transaction validation | `src/Applications/FlowGuard.Analyzer/Validation/TransactionAnalysisRequestValidator.cs` |
| Core DTOs | `src/Core/FlowGuard.Core/Models/DTOs/Requests/DTOs.cs` |
| Queue envelope | `src/Core/FlowGuard.Core/Models/TransactionQueueMessage.cs` |
| Analyzer client (HTTP + queue) | `src/Clients/FlowGuard.Analyzer.Client/Services/AnalyzerClientService.cs` |
| AML analysis / risk bands | `src/Services/FlowGuard.Services.Analyzer/Services/Analysis/AnalyzerAMLService.cs` |
| Monitoring ingest + canonical string | `src/Masarat.Monitoring.Ingestion/Services/MobileEventIngestionService.cs` |
| HMAC validation | `src/Masarat.Monitoring.Ingestion/Services/HmacSignatureValidator.cs` |
| Monitoring HTTP API | `src/Applications/FlowGuard.Analyzer/Controllers/Monitoring/MonitoringEventsController.cs` |
| Rate limiting | `src/Services/FlowGuard.Services.Analyzer/Middleware/RateLimitingMiddleware.cs` |
| Default configuration | `src/Applications/FlowGuard.Analyzer/appsettings.json` |

For questions or onboarding of new bank tenants (URLs, queue names, HMAC keys), contact the **AML System / platform team**.
