---
name: testing
description: >
  Universal heuristics for validating correctness through tests.
  ALWAYS ON — load at the start of every coding session alongside coding-standards.
  TRIGGER when: writing tests, deciding what to test, choosing test structure,
  debugging a failing test, or evaluating test quality.
  DO NOT TRIGGER when: writing production code unrelated to tests, making
  architectural decisions, or planning delivery.
license: MIT
metadata:
  author: pvasude
  version: "1.3.0"
  category: engineering-standards
  tags: "tdd, testing, correctness, test-lifecycle, mocking"
---

# Testing

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Non-goals

- Maximizing coverage percentages
- Testing framework internals or implementation details
- Mocking everything in sight
- Writing tests that pass trivially without asserting real behavior
- Reproducing production data in tests
- Asserting on internal timing unless timing itself is the behavior under test

## Priority order

When constraints conflict, resolve in this order:

1. Preserve test reliability — a flaky test is worse than no test
2. Preserve failure clarity — a failing test must explain what broke and why
3. Preserve test independence — tests must not depend on each other's state
4. Optimize test speed only after the suite is trustworthy

## Prerequisites

Before this skill is effective:
- A test environment isolated from development and production must exist
- External call mocking infrastructure must be in place
- If testing persistence: a dedicated test data store must be available

If prerequisites are not met, flag this in the phase plan before proceeding.

## Core principles

**New or changed behavior must be specified by a failing test before
the behavior is considered complete.**
Tests are executable assertions of intended behavior — not documentation
or proof of implementation. Untested behavior is unverified behavior.

**A newly added behavior-specification test should fail before the
corresponding implementation exists.**
A test that passes before implementation is asserting nothing new.
Exception: regression tests, characterization tests, and existing behavior
capture may pass immediately by design.

**Tests assert behavior, not implementation.**
A test that breaks when you rename an internal function is testing the
wrong thing. Test what the code does, not how it does it.

**A failing test must not be weakened without explicitly validating that
the expected behavior changed intentionally.**
If a test fails, the first question is whether the implementation is wrong.
Weakening a test to make it pass removes the protection it provided and
requires explicit justification.

**Tests must not depend on external systems whose state, availability,
or data lifecycle cannot be controlled by the test environment.**
Real infrastructure is acceptable only when isolated, reproducible, and
fully owned by the test setup.

**Never use timing as a synchronization mechanism.**
Synchronize on observable behavior — a state change, a return value, an
emitted event — not elapsed time. Timing-based tests are flaky by design.

---

## TDD workflow

The following order is the default. The invariant that must hold in all
cases is completion, not sequence: tests defining intended behavior must
exist before the work is considered complete.

**Step 1 — Specify with a failing test**
- Describe the intended behavior in the test name — it should read as a
  specification
- Run it and confirm it fails for the right reason

**Step 2 — Write minimum implementation**
- Write only enough code to make the test pass
- Resist adding untested logic — if it is not tested, it is not required yet

**Step 3 — Refactor**
- Clean up implementation and tests
- All tests must still pass after refactoring
- Refactoring production code and test code are separate steps

**Legitimate exceptions to strict sequencing:**
Exploratory work, debugging reproductions, schema archaeology, integration
spikes, and third-party API characterization may have tests follow
implementation. The invariant that must hold in all cases: tests defining
intended behavior must exist before the work is considered complete.

---

## Test lifecycle — choose deliberately

Every test file must choose one lifecycle and document why:

**Per test (maximum isolation)**
- Set up and tear down data for each individual test
- Use for: critical data integrity, uniqueness constraints, cascade behavior
- Cost: slowest — reserve for tests where isolation genuinely matters

**Per suite (default)**
- Set up data once per file, tear down after all tests in the file
- Use for: most API tests, most business logic tests

**Per session (read-only)**
- Set up once for the entire test run, never mutate
- Use for: read-only queries, schema verification, static behavior
- Never use if any test writes data

---

## What must be tested

Every PR that adds or changes behavior must include tests for:

- The happy path — the thing is supposed to work
- Explicit failure paths — invalid or missing inputs
- Boundary conditions — empty inputs, null values, duplicate data
- External call failures — what happens when a dependency is unavailable
- Side effects — if a function writes data, assert it wrote correctly

## What does not need tests

- Framework behavior you did not write
- Third-party library internals
- Configuration files
- Code that is purely a pass-through with no logic

---

## Mocking

- Mock at the system boundary — the point where your code calls something external
- Do not mock internal functions — if you need to, the code has a boundary problem
- Mocks must return realistic shapes — a mock that omits fields the real
  response includes will miss real bugs
- If a mock is reused across many tests, it is a fixture — treat it as one

---

## Test quality signals

A test suite is healthy when:
- A failing test tells you exactly what broke without reading source code
- Tests can run in any order without affecting results
- Adding a new test does not require modifying existing ones
- A bug found in production gets a regression test before the fix is written

A test suite is unhealthy when:
- Tests pass in isolation but fail together
- Changing an internal function breaks tests that should not care
- Coverage is high but confidence is low
- Tests are skipped rather than fixed
- Tests contain sleeps or timing waits

---

## Escalation triggers

Stop and ask before proceeding when:
- The right test lifecycle for a new file is genuinely ambiguous
- A test requires so much setup that the design of the code may be the problem
- A failing test is being considered for weakening rather than prompting
  an implementation fix — requires explicit validation of intent

Stop and warn (proceed but flag explicitly) when:
- A test is being written after implementation — confirm behavior is still
  being specified, not just verified after the fact
- Test cleanup is not guaranteed — state could leak between tests
- A mock is returning a shape that does not match the real dependency
- A sleep or timing wait is being considered as a synchronization strategy
