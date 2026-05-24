# Engineering Standards for Code Review

This file instructs GitHub Copilot on the engineering standards to apply when reviewing code in this repository. The project's tech stack and specific tools are defined in CLAUDE.md. Flag any violation as a review comment.

---

## Engineering Philosophy
- Prefer operational simplicity over architectural sophistication
- Prefer consistency over novelty
- Prefer explicitness over hidden magic
- Do not introduce distributed systems complexity without measured operational need
- Performance optimisations must be driven by measurement, not assumption
- AI-generated code is never trusted without human review

---

## Code Quality
- Validate all external data at system boundaries before use or storage — use the validation library defined in CLAUDE.md
- Never parse raw strings from external sources without schema validation
- Single shared database client across the codebase — use the client defined in CLAUDE.md, never instantiate elsewhere
- Connection pooling must be configured on the shared database client
- Lockfile must always be committed
- No shared mutable in-memory state across requests or workers
- Application services must remain stateless wherever practical
- Domain layers must not depend directly on infrastructure or framework code

## Error Handling
- Never swallow exceptions silently
- All caught errors must be handled explicitly, transformed into domain errors, or logged with context
- Silent failures are not acceptable — every error must have a visible outcome

## Database
- Writes touching multiple tables must be wrapped in atomic transactions
- Never perform irreversible external side effects inside database transactions (emails, webhooks, queue publishes, charges) — if the transaction rolls back the side effect cannot be undone
- Critical business rules must be enforced at the database layer (foreign keys, unique constraints, NOT NULL) — never application code only
- Destructive schema changes must use expand-contract migration strategy

## APIs
- Long-running operations must be async — return a task ID immediately, provide a status endpoint to check progress
- All external HTTP calls must define explicit timeouts and retry policies
- Any operation that may be retried must be idempotent
- Every new or changed API endpoint must be documented: method, request/response shape, error codes

## Security
- Never commit secrets, API keys, connection strings, or environment files — use the platform's secret manager
- Authentication belongs in middleware — never inside individual route handlers
- Authorization and business permissions belong in service/domain logic — middleware cannot safely handle resource-level permissions alone
  - "is authenticated?" → middleware
  - "can edit this record?" → service/domain layer
- Enforce HTTPS, secure cookies, CSP headers, and CSRF protection
- Production infrastructure and configuration must be version controlled — never manually modified

## Testing
- Tests must be written before implementation for business logic, APIs, state transitions, and persistence (TDD)
- For refactors, migrations, infra setup, and exploratory architecture, tests may follow implementation — but must exist before merging
- Never modify test files to make tests pass — fix the implementation
- All external calls must be mocked in tests — never hit real networks or real databases in unit tests
- Use a separate test database — never development or production data
- Choose test lifecycle deliberately: per-test, per-suite, or per-session based on what is being tested
- Every test suite must document its focus: code coverage, real world use cases, or edge cases

## Documentation — every PR must include
- API docs: endpoint, method, request/response shape, error codes
- Architecture notes: how new or changed components connect to the rest of the system
- DB schema notes: what each new or changed table and field means and why it exists

## Deployment
- Database migrations must run automatically before every build — never manually
- Seed data must be automated as part of deployment — never manual
- Every deployment must have a documented rollback strategy
- Infrastructure configuration must be version controlled and reproducible

## AI-generated code
- Must meet the same standards as human-written code
- Must include tests, documentation, and pass all CI checks before merging
- Never merged without human review

---

## What to flag in every PR review
- Any database client instantiated outside the shared client file defined in CLAUDE.md
- Any write to multiple tables not wrapped in a transaction
- Any external side effect (email, webhook, queue publish, charge) inside a transaction
- Any `catch` block that swallows an error silently
- Any hardcoded secret, URL, credential, or environment file committed to the repo
- Any auth check inside a route handler instead of middleware
- Any resource-level permission check in middleware instead of service/domain layer
- Any external fetch or HTTP call without an explicit timeout
- Any test file modified to make a test pass instead of fixing the implementation
- Any missing schema validation on external data
- Any API endpoint added or changed without documentation
- Any long-running synchronous operation that should be async with a task ID
- Any migration that renames, drops, or changes constraints without an expand-contract strategy
- Any new dependency added without review comment on maintenance quality and security
