# Security Runbook

This runbook is for security engineers responsible for hardening, monitoring, and incident response for the AML System. **Division of responsibility:** **Masarat** owns the **service** hardening, vulnerability lifecycle, and platform-side **security operations** as contracted; the **bank** owns identity governance for end users, network path to the service, and **outsourcing oversight**. Summary: [masarat.md](../masarat.md), [bank/governance — §2](../bank/governance-and-operations.md#2-operating-authority).

## 1) Security Controls Present in Codebase

### Authentication and authorization

- JWT bearer authentication with issuer/audience/lifetime/signature validation in `src/Applications/FlowGuard.Management/Program.cs`
- JWT secret length enforcement (minimum 32 characters) in:
  - `src/Applications/FlowGuard.Management/Program.cs`
  - `src/Services/FlowGuard.Services/Services/Security/Authentication/JwtTokenService.cs`
- Role and policy-based authorization plus permission attributes in:
  - `src/Applications/FlowGuard.Management/Program.cs`
  - `src/Services/FlowGuard.Services/Auth/RequirePermissionAttribute.cs`
  - `src/Services/FlowGuard.Services/Services/Security/Authorization/PermissionService.cs`
- Password hashing (BCrypt) in `src/Services/FlowGuard.Services/Services/Security/Authentication/BCryptPasswordHasher.cs`

### Integrity and API security mechanisms

- Webhook signature verification (HMAC and timestamp validation) in:
  - `src/Services/FlowGuard.Services/Services/Security/Webhook/WebhookSecurityService.cs`
  - `src/Applications/FlowGuard.Management/Controllers/WebhooksController.cs`
  - `src/Services/Masarat.Monitoring.Ingestion/Services/HmacSignatureValidator.cs`

### CI security hooks

- Security-related jobs: `.github/workflows/` (GitHub Actions). If your deployment still uses GitLab definitions in-repo, see `deployment/.gitlab-ci.yml` and `src/.gitlab-ci.yml`.

## 2) High-Priority Risks to Track

- Hardcoded/default secrets and credentials exist in compose/appsettings/script files.
- Frontend stores tokens in `localStorage` (`frontend/AMLPortal/src/app/core/services/simple-jwt-auth.service.ts`), increasing XSS blast radius.
- Many service ports are host-exposed in production compose files.
- Frontend nginx configuration is HTTP-only (`frontend/AMLPortal/nginx.conf`) without TLS termination in that config.
- Some CORS paths in management include permissive fallback behavior.

## 3) Security Baseline Checklist (Before Production)

- Replace all default credentials and placeholders.
- Move sensitive values to secure secret management workflow; do not store in repository.
- Enforce TLS at ingress/reverse proxy for all external traffic.
- Restrict exposed host ports to only what is operationally necessary.
- Validate JWT secret strength and rotation policy.
- Confirm webhook secrets are unique per tenant and rotated periodically.
- Ensure Swagger/API documentation exposure is restricted to approved environments.
- Enable and verify log redaction for sensitive data.

## 4) Secrets Management SOP

1. Inventory all secret-bearing keys in compose/env/appsettings.
2. Rotate existing known/default credentials immediately.
3. Store runtime secrets in secure environment injection path (not committed files).
4. Validate applications load secrets from environment or trusted config service.
5. Re-run deployment health checks and auth flow tests after rotation.

## 5) Network Hardening SOP

1. Front all public endpoints with TLS-enabled reverse proxy/ingress.
2. Keep internal-only services (DB, Redis, RabbitMQ, Consul, observability backends) on private network segments.
3. Remove host port mappings that are not needed by operators.
4. Restrict management interfaces (Grafana/RabbitMQ/Consul) via firewall/IP allow list and strong credentials.
5. Verify forwarded headers and HTTPS behavior in production startup configuration.

## 6) Monitoring and Detection

Monitor and alert on:

- repeated authentication failures
- privilege/permission denial spikes
- unexpected token refresh anomalies
- webhook signature validation failures
- unusual outbound traffic from app containers
- suspicious configuration/secret file changes

Use observability stack defined in `deployment/docker-compose.infra.yml` and `deployment/docker-compose.swarm.infra.yml` as primary telemetry source.

## 7) Security Incident Response Procedure

1. Classify incident severity and impacted assets.
2. Isolate affected services/credentials.
3. Preserve logs and forensic artifacts before cleanup/restart.
4. Rotate potentially compromised secrets/tokens.
5. Eradicate root cause and redeploy verified images/config.
6. Validate service health and security controls post-recovery.
7. Publish incident report with timeline, impact, and corrective actions.

## 8) Immediate Backlog Recommendations

- Remove hardcoded secrets/tokens from scripts and config files.
- Migrate frontend auth token storage from `localStorage` to a safer pattern (for example, secure HTTP-only cookies where architecture permits).
- Add explicit backup/restore and security recovery runbooks for data stores.
- Add automated checks that fail CI on default credentials or hardcoded secret patterns.
