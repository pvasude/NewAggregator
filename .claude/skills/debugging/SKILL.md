---
name: debugging
description: >
  Universal heuristics for finding and fixing problems.
  TRIGGER when: a test is failing unexpectedly, behavior does not match
  expectation, an error is occurring in production or development, or
  a fix is being considered without a confirmed root cause.
  DO NOT TRIGGER when: writing new code with no existing failure to investigate.
license: MIT
metadata:
  author: pvasude
  version: "1.2.0"
  category: engineering-standards
  tags: "debugging, root-cause, diagnosis, fixes, observability"
---

# Debugging

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Non-goals

- Patching symptoms without understanding root cause
- Making multiple simultaneous changes to test different hypotheses
- Modifying tests to hide failures
- Adding defensive code without understanding what it is defending against
- Diagnosing production failures without sufficient observability in place

## Priority order

When constraints conflict, resolve in this order:

1. Preserve understanding of the failure mechanism — fix nothing until the
   cause is confirmed
2. Preserve existing behavior outside the affected area
3. Minimize blast radius of the fix — the smallest change that removes
   the confirmed cause
4. Optimize fix elegance only after correctness is verified

## Prerequisites

Before this skill is effective:
- The failure must be reproducible in a controlled environment
- Sufficient logging must exist to identify what failed and under what
  conditions
- If investigating production failures: error tracking and structured logs
  must be in place

If prerequisites are not met, do not attempt to diagnose by reading code
alone. Escalate: the observability gap must be addressed first. A fix
without reproduction is a guess — flag it as such.

## Core principles

**Reproduce before fixing.**
A bug that cannot be reproduced reliably cannot be confirmed as fixed.
The first task is always: produce a reliable, minimal reproduction.

**Isolate the root cause.**
The error message points to a symptom. The root cause is the upstream
decision that made the symptom possible. Fix the cause, not the symptom.

**Test one hypothesis at a time.**
State what you believe is wrong and why. Make one change that tests the
hypothesis. Evaluate the result before forming the next hypothesis.
Multiple simultaneous changes destroy causal understanding.

**Smallest failing case first.**
Reduce the reproduction to the minimum input that still triggers the
failure. A smaller reproduction reveals the cause faster and produces
a cleaner fix.

**Defensive handling without understanding the underlying cause increases
the risk of recurring failures.**
Adding null checks or fallbacks before root cause is confirmed is not
a fix — it is risk deferral. It may be appropriate as a temporary
mitigation, but must be treated as incomplete until the cause is understood.

---

## Debugging workflow

**Step 1 — Reproduce**
- Confirm the failure is reproducible in a controlled environment
- Identify the exact input or conditions that trigger it
- If intermittent: identify what varies between failing and passing runs

**Step 2 — Isolate**
- Narrow the failure to the smallest code path that still exhibits it
- Read the full error — message, stack trace, and line numbers
- Identify the last point where behavior was correct

**Step 3 — Hypothesize**
- State one specific cause in plain language
- Identify what evidence would confirm or refute it
- Prioritize the most likely cause — do not pursue all possibilities in parallel

**Step 4 — Test the hypothesis**
- Make the single smallest change that would confirm the hypothesis
- If confirmed: proceed to fix
- If refuted: return to step 2 with new information

**Step 5 — Fix**
- Fix the root cause — not the symptom
- Large fixes for narrowly scoped bugs are a signal that root cause
  isolation may be incomplete

**Step 6 — Verify**
- Write a test that would have caught this failure before the fix existed
- Confirm all existing tests still pass
- Confirm the fix works under the original failure conditions

---

## Common failure patterns

**The fix that makes tests pass but does not fix the bug.**
Changing test assertions or mocking behavior away from the failure hides
the bug. If a test change is required, understand why before making it.

**The cascading change.**
Fixing one thing breaks another. Revert and re-investigate before
proceeding — root cause was not fully isolated.

**The intermittent failure attributed to environment.**
Intermittent failures almost always have a cause — timing, state leak,
non-deterministic ordering, resource contention. "It's flaky" is not
an explanation.

---

## Observability during debugging

- Add logging at the point of failure with enough context to reproduce:
  what input caused it, what state existed at the time
- Remove temporary investigative logging before merging — structured
  diagnostic logs that aid future debugging should be retained
- If the failure required extensive investigation, leave a comment at
  the fix site explaining the root cause

---

## Escalation triggers

Stop and ask before proceeding when:
- The root cause requires a change outside the current scope
- Fixing the root cause would require a breaking change or schema migration
- The failure is intermittent and no reliable reproduction exists after
  genuine investigation
- Observability is insufficient to diagnose reliably — address the gap first
- The fix requires coordinated changes across multiple layers with unclear
  ownership boundaries

Stop and warn (proceed but flag explicitly) when:
- The fix is larger than expected for the stated bug
- A regression test cannot be written because the failure conditions are
  too difficult to reproduce in a test environment
