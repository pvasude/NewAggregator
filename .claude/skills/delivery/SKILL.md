---
name: delivery
description: >
  Universal heuristics for executing and shipping collaborative software
  work safely.
  TRIGGER when: planning how to implement a feature, breaking down a task,
  deciding commit and branch strategy, sequencing migrations, or assessing
  the risk of a change before making it.
  DO NOT TRIGGER when: writing implementation code (use skill:coding-standards),
  making structural decisions (use skill:architecture), or writing tests
  (use skill:testing).
license: MIT
metadata:
  author: pvasude
  version: "1.3.0"
  category: engineering-standards
  tags: "delivery, execution, commits, migrations, risk, scope"
---

# Delivery

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Non-goals

- Rewriting working code speculatively before adding new behavior
- Combining refactoring, new features, and migrations in a single change
- Optimizing delivery speed at the cost of rollback capability
- Making irreversible changes without explicit confirmation
- Expanding scope beyond what was agreed before starting

## Priority order

When constraints conflict, resolve in this order:

1. Preserve safety of existing behavior — do not break what works
2. Preserve rollback capability — every change should be undoable
3. Minimize scope — the smallest change that delivers the stated goal
4. Optimize delivery speed only after risk is understood

## Core principles

**Plan before coding.**
Understand the full scope of a change before writing the first line. If
the scope is unclear, clarify before starting — not after half the code
is written.

**One concern per PR.**
A PR that refactors, adds a feature, and fixes a bug is three PRs.
Reviewers cannot evaluate mixed concerns, rollbacks become dangerous, and
the blast radius of a revert is unpredictable.

**Smallest change that works.**
The correct implementation delivers the stated goal with the least
additional surface area. Resist the pull to improve adjacent things while
in the area — log them as separate tasks instead.

**Never work directly on the main branch.**
All changes happen on a feature branch. A direct commit to main is a
deployment without a review.

**Incremental over big bang.**
A sequence of small, safe, reviewable steps is better than one large
change that must be right first time. If a change cannot be made
incrementally, the risk must be explicitly acknowledged.

**Prefer release strategies that reduce rollback cost and blast radius
when deployment risk is uncertain.**
The easier a change is to reverse, the safer it is to ship.

---

## Task decomposition

Before writing any code:
1. State the goal in one sentence — if you cannot, the scope is unclear
2. Identify what existing behavior must be preserved
3. Identify the smallest change that delivers the goal
4. List any migrations, schema changes, or breaking changes separately —
   these need their own sequencing

If implementing a change requires modifying multiple areas that do not
share the same responsibility, decompose further before proceeding.

---

## Commit discipline

- Each commit must represent one coherent change that can be understood
  and reverted independently
- Commit messages state what changed and why — not what the code does
- Do not mix formatting changes with behavior changes in the same commit

---

## Migrations and schema changes

- Migration execution strategy must be explicit, repeatable, and
  documented — how and when migrations run must be a decision, not
  an assumption
- Required seed data must have a repeatable, documented execution path
- Schema changes that remove or rename must use expand-contract strategy:
  add the new thing, migrate data, remove the old thing — in separate deploys
- Never rename or drop a column in a system that may have in-flight
  requests using the old name
- Schema migrations must remain independently understandable and reversible
- Migrations must document rollback or recovery strategy before merge

---

## Scope discipline

If during implementation you discover something adjacent that should be
improved:
1. Note it — create a task or comment
2. Do not fix it in the current PR unless it directly blocks the stated goal
3. Scope creep in AI-assisted development compounds quickly

A change that was not in the plan requires explicit confirmation before
it is made.

---

## Branch and PR hygiene

- Branch from an up-to-date main — never from a stale branch
- Keep branches short-lived — the longer a branch lives, the harder the merge
- Every PR must pass all required verification before merging
- Delete the branch after merge — stale branches are noise

---

## Documentation in PRs

Every PR that adds or changes behavior must include:
- What changed and why
- Any API changes: endpoint, method, request/response shape, error codes
- Any schema changes: what each new or changed table and field means
- How to verify the change works as expected

---

## Escalation triggers

Stop and ask before proceeding when:
- The blast radius of a change is unclear
- A rollback would require manual intervention
- A migration cannot be trivially rolled back
- Backward compatibility of a change is uncertain
- The change combines refactoring, new feature, and migration
- Scope has expanded beyond what was agreed at the start
- A change touches more areas than expected for its stated purpose
- Auth or security behavior is ambiguous in the proposed change

Stop and warn (proceed but flag explicitly) when:
- An adjacent improvement is tempting but was not part of the plan
