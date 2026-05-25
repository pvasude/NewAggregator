---
name: coding-standards
description: >
  Universal heuristics for writing production code.
  ALWAYS ON — load at the start of every coding session.
  TRIGGER when: writing any production code, adding a feature, fixing a bug,
  creating an API route, modifying data access, or handling external input.
  DO NOT TRIGGER when: writing tests (use skill:testing), making structural
  decisions (use skill:architecture), or planning delivery (use skill:delivery).
license: MIT
metadata:
  author: pvasude
  version: "1.4.0"
  category: engineering-standards
  tags: "production-code, error-handling, security, validation, explicitness"
---

# Coding Standards

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Non-goals

- Comprehensive documentation of language features
- Framework-specific implementation patterns
- Optimizing for cleverness or elegance over clarity
- Satisfying all edge cases before any usage pattern exists
- Adding abstraction layers before repetition is painful

## Priority order

When constraints conflict, resolve in this order:

1. Preserve correctness
2. Preserve clarity
3. Preserve reversibility
4. Optimize only after measurement

## Core principles

**Explicitness over convenience.**
Write code that reveals intent at the call site. A caller should understand
a function's responsibility and observable effects without needing
implementation details.

**Validate at every boundary.**
External data must not influence business behavior before validation.
All data crossing a system boundary — incoming requests, external responses,
environment variables, file contents — must be validated before use or
storage. This applies to strings, objects, headers, files, webhooks,
binary payloads, and query parameters.

**Reject invalid state transitions as close to the point of introduction
as practical.**
Invalid state that survives deeper into the system becomes harder to
reason about and harder to recover from.

**Every caught error must be handled explicitly, transformed with context,
or surfaced with enough information to debug.**
Errors that cross API boundaries must be normalized — never leak internal
stack traces or implementation details to callers.

**If modifying one behavior requires understanding or risking unrelated
behavior, the boundary is wrong.**

**Services that accumulate state between requests hide coupling — make
state ownership explicit.**
When state must exist, its owner, lifetime, and access rules must be
unambiguous.

---

## Error handling

- Never swallow exceptions silently
- Caught errors must be one of:
  - Handled with an explicit recovery path
  - Transformed into a domain error that carries source context
  - Logged with: what failed, where, and what input caused it
- Parallel operations that can partially fail must define how partial
  failure is surfaced, isolated, or recovered from — do not block on
  partial failure or silently discard failures

---

## External data and validation

- External data must not influence business behavior before validation
- Validation is not optional for "trusted" sources — feeds change,
  APIs change, configs change
- If validation fails, reject explicitly with the reason — do not silently
  coerce or default
- Environment variables are external data — validate presence and shape
  at startup, not at the point of use

---

## API design

- Structured API responses should use a consistent envelope where callers
  rely on machine-readable contracts. Exceptions — streaming, SSE, file
  responses, health probes, webhooks — must be intentional and documented
- Operations with unbounded or unpredictable execution time must make
  timeout and cancellation behavior explicit
- Retryable operations must define how duplicate execution is prevented,
  tolerated, or reconciled
- Outbound network calls must define explicit timeout behavior

---

## Data persistence

- Writes touching multiple tables must be wrapped in atomic transactions
- Never perform external side effects inside a transaction — if the
  transaction rolls back, the side effect cannot be undone
- Critical business rules belong at the database layer — unique constraints,
  foreign keys, NOT NULL — not application code alone
- Database client lifecycle and pooling ownership must be explicit —
  avoid per-request or per-module client instantiation unless the runtime
  model requires it

---

## Security

- Secrets never appear in code, comments, or logs — use environment
  variables and a secret manager
- Never commit environment files or build artifacts
- Authentication must execute before protected business operations
- Resource-level authorization must execute where resource context exists —
  not at the authentication boundary alone

---

## Dependencies

Before adding any dependency:
1. Confirm the existing stack cannot solve the problem
2. Check maintenance activity and known vulnerabilities
3. Get explicit instruction — never add speculatively
4. Pin to a specific version — never use unbounded ranges in production

---

## Escalation triggers

Stop and ask before proceeding when:
- A change requires adding a dependency not currently in the stack
- An error handling strategy requires a decision about what the user sees
- An API contract change would affect existing callers
- Validation rules are ambiguous — external data could reasonably be
  accepted or rejected under the current schema

Stop and warn (proceed but flag explicitly) when:
- Modifying one behavior requires understanding or risking unrelated behavior
- An assumption is being made about external data shape without validation
- Timeout or retry policy is being introduced without explicit assumptions
  about expected latency or failure modes
