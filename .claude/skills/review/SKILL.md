---
name: review
description: >
  Universal heuristics for reviewing collaborative software changes in
  PR-based workflows. Stage-scoped — only checks what is required at
  the declared stage.
  TRIGGER when: user comments "@claude review stage:N" on a PR, where N
  is 1, 2, or 3.
  DO NOT TRIGGER when: writing code, planning features, or discussing
  architecture. This skill evaluates — it does not build.
license: MIT
metadata:
  author: pvasude
  version: "1.4.0"
  category: engineering-standards
  tags: "review, pr, feedback, quality, stages"
---

# Review

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Maintenance discipline

This skill is a failure-prevention system, not a checklist.
Its value comes from signal density, not coverage breadth.

When this skill is updated:
- Default pressure is toward deletion, not addition
- Every proposed addition must pass both the production failure test and
  the portability test before it is included
- A rule that can be reworded to pass the tests probably should not be
  reworded — it should be removed
- If a section is growing, that is a signal to audit and cut, not to
  reorganize

The review skill fails by accumulating prescriptive checks over time.
Resist that pressure explicitly.

---

## Non-goals

- Flagging style preferences as issues
- Commenting on deliberately deferred items (see project-specific section)
- Generating a comprehensive description of what the code does
- Rewarding cleverness over clarity
- Producing a long list of minor observations that obscure real problems
- Raising infrastructure, hosting, CI topology, deployment cadence, or
  platform constraints as universal findings

## Priority order

When judgments conflict, resolve in this order:

1. Correctness — does it do what it claims?
2. Safety — does it introduce security, data, or reliability risk?
3. Clarity — will the next engineer understand it?
4. Consistency — does it follow established patterns in this codebase?

## Portability enforcement

Do not raise infrastructure, hosting, CI topology, deployment cadence,
or platform constraints as universal findings unless the PR violates a
project-specific rule documented in the mandatory checks section below.

## Prerequisites

Before invoking this skill:
- Stage must be declared explicitly: `stage:1`, `stage:2`, or `stage:3`
- Any verification process required by the project for the declared stage
  must have completed
- For `stage:2` review: confirm observability tooling is integrated before
  applying Stage 2 checks

## How to invoke

```
@claude review stage:1
@claude review stage:2
@claude review stage:3
```

Checks from earlier stages always apply — `stage:2` includes all `stage:1` checks.

---

## Output format

**Blockers** — must be resolved before merging
`[BLOCKER] <file:line if applicable> — <what is wrong and why it matters>`

**Warnings** — should be addressed, judgment call
`[WARNING] <file:line if applicable> — <what the risk is>`

**Notes** — observations with no action required
`[NOTE] <observation>`

**Skipped** — checks explicitly not applied and why
`[SKIPPED] <check> — <reason>`

If there are no blockers, say so explicitly.

---

## Stage 1 checks — always applied

### External data
- [ ] External data does not influence business behavior before validation

### Failure handling
- [ ] Failures preserve diagnosability and do not silently corrupt behavior

### Data integrity
- [ ] Writes that touch multiple entities are atomic and free of external
  side effects that cannot be rolled back

### API contracts
- [ ] Operations that may execute more than once define how duplicate
  execution is handled
- [ ] Operations with unbounded execution time make timeout and
  cancellation behavior explicit

### Business logic boundaries
- [ ] Business rules remain understandable independently of transport,
  framework lifecycle, or persistence orchestration concerns

### Testing
- [ ] Changed business behavior is covered by tests proportional to the
  operational risk of failure. When uncertain, prefer higher-confidence coverage
- [ ] Tests remain deterministic and independent of uncontrolled systems
- [ ] Test setup and isolation strategy appear intentional and reliable
- [ ] Tests do not appear dependent on nondeterministic timing behavior

### Security
- [ ] No secrets, credentials, API keys, or connection strings committed
  in code or git history
- [ ] No environment files or generated build artifacts committed
- [ ] Authentication and authorization execute before protected operations
  or data access
- [ ] Sensitive data handling matches the access risk of the operation

### Documentation
- [ ] API, architecture, and schema changes are documented in the PR

### Repository workflow
- [ ] PR was not raised from main directly

---

## Stage 2 checks — applied when stage:2 or stage:3 declared

### Observability
- [ ] Errors on external calls and critical paths are tracked and surfaced —
  not silently logged only
- [ ] Requests carry correlation identifiers through the system
- [ ] No temporary investigative logs left in production paths

### Reliability
- [ ] Public-facing operations have abuse protection
- [ ] List operations are bounded — no unbounded result sets returned
- [ ] Concurrent writes account for race conditions where data integrity
  is at risk

### Security
- [ ] Sensitive data handled with appropriate access controls
- [ ] Dependencies reviewed for known vulnerabilities before release

---

## Stage 3 checks — applied when stage:3 declared

### Architecture
- [ ] Complexity corresponds to a clear operational or maintenance need
- [ ] Boundaries between concerns are clear and intentional

### Contracts
- [ ] Public interfaces have defined compatibility guarantees
- [ ] Breaking changes have a versioning strategy before release

---

## Project-specific: behavioral deferments — do not flag

Engineering behaviors that are deliberately incomplete at this stage.
Do not raise as blockers, warnings, or notes.

| Deferred behavior | Reason |
|---|---|
| No rate limiting on public endpoints | Deferred to Phase 3 |
| No pagination on feed endpoint | Deferred to Phase 3 |
| Structured production error aggregation | Deferred to Phase 3 |
| Refresh endpoint does not return async task ID | Async pattern deferred to Phase 3 |
| Source filter UI not wired to filtering logic | Deferred to Phase 3 |

---

## Project-specific: mandatory checks — raise as blockers

These are enforced review invariants for this project regardless of stage.

- [ ] Any new database client instantiation outside the designated shared
  client module
- [ ] Any test capable of touching development or production data stores
- [ ] Any new synchronous endpoint that may exceed this project's
  platform synchronous execution limits (project runtime constraint —
  not a universal engineering requirement)
- [ ] Any hardcoded secret, credential, API key, or connection string

---

## Escalation triggers

Stop and ask before posting a review when:
- A potential issue requires understanding project history not visible
  in the diff
- A blocker would require a significant architectural change — surface
  as a discussion, not a mandate
- Two standards appear to conflict in this specific PR
- Auth or schema behavior in the diff has ambiguous safety implications

Stop and warn (flag in the review output) when:
- A pattern passes stage:1 but will cause problems at the next stage —
  note as a forward risk, not a current blocker
