---
name: architecture
description: >
  Universal heuristics for making structural decisions.
  TRIGGER when: designing a new feature, deciding how to organise code,
  evaluating whether to abstract, split, or generalise, or when a change
  affects multiple parts of the system.
  DO NOT TRIGGER when: writing implementation inside an already-decided
  structure (use skill:coding-standards), or planning delivery sequencing
  (use skill:delivery).
license: MIT
metadata:
  author: pvasude
  version: "1.2.0"
  category: engineering-standards
  tags: "architecture, abstraction, boundaries, structure, design"
---

# Architecture

> This skill exists to reduce specific classes of autonomous engineering mistakes.
> If guidance is generic, obvious, or tool-specific — it does not belong here.
> If violating this rule would not plausibly cause a production failure,
> maintenance failure, debugging failure, security failure, or data integrity
> failure — it does not belong here.

## Non-goals

- Designing for hypothetical scale
- Building reusable frameworks before usage patterns stabilize
- Eliminating all duplication
- Optimizing abstractions before they have been used in multiple stable contexts
- Introducing service boundaries without measured operational need
- Proving sophistication through complexity

## Priority order

When constraints conflict, resolve in this order:

1. Preserve reversibility — the decision that can be undone is better
2. Preserve clarity of boundaries — who owns what must be obvious
3. Minimize blast radius of change — small changes should touch few areas
4. Optimize structure only after patterns have stabilized

## Core principles

**Prefer boring architectures.**
The architecture that lets a new engineer understand the system in one hour
is better than the architecture that impresses in a conference talk.
Novelty is a cost, not a feature.

**Duplicate twice before abstracting.**
One instance is a coincidence. Two is a pattern emerging. Three stable
instances often indicate an abstraction worth considering — but the
abstraction must fit all three, not just the first two.

**Optimize for local reasoning.**
Code should be understandable from the file it lives in. If understanding
a function requires tracing through multiple layers of indirection, the
architecture is working against the reader.

**Avoid indirection unless it removes real complexity.**
Every layer of indirection has a cost — it adds concepts to hold in mind
and places to look when debugging. Add a layer only when it removes more
complexity than it introduces.

**Design for deletion.**
A feature that can be removed cleanly was designed with good boundaries.
Build so that removing a feature is a subtraction, not a surgery.

**Avoid speculative extensibility.**
Do not add extension points for requirements that do not exist. The cost
of the wrong abstraction is higher than the cost of adding one later.

---

## Abstraction rules

Abstraction is justified when:
- The same logic appears in three or more distinct, stable places
- A boundary needs to hide a decision that is likely to change
- Complexity behind the boundary is genuinely higher than the interface suggests

Abstraction is not justified when:
- It exists to avoid typing
- It exists to make the code "look clean"
- It wraps a single call with no added behavior
- It is designed for a future requirement that is not yet confirmed

---

## Boundaries

- Business rules must remain understandable independently of transport,
  framework lifecycle, or persistence orchestration concerns
- Infrastructure concerns belong at the edges — not distributed through
  the system
- A module boundary is justified when ownership is clear and the interface
  is stable — not just because the files are getting large
- Shared mutable state across boundaries is a design error, not a
  performance optimisation

---

## Splitting files and modules

Split a file when:
- It contains two distinct concerns that change for different reasons
- A reader must scroll past unrelated code to understand any single thing

Do not split a file when:
- The motivation is line count alone
- The split would require the two halves to import from each other
- The split would obscure a simple thing by distributing it across files

---

## Scaling heuristics

Do not address scale until it is measured. When scale must be addressed:
- Cache before you shard
- Read replicas before you partition
- Queue before you spawn services
- Measure before you optimise

Introducing distributed systems complexity without a measured operational
need is a decision that cannot easily be reversed.

---

## Refactor triggers

Refactor when:
- Adding a feature requires understanding the whole file before touching any of it
- The same bug has appeared in the same area twice
- A function has been edited by three or more unrelated changes
- Tests require excessive setup because the code does too many things

Do not refactor when:
- A deadline is active and behavior is at risk
- The motivation is aesthetic preference alone
- The change combines refactoring with new behavior in the same PR

---

## Escalation triggers

Stop and ask before proceeding when:
- Multiple architectural directions are equally valid and the tradeoffs are real
- A change alters a public contract or shared interface
- A migration cannot be safely made incremental
- An abstraction would affect more than one bounded context
- The right boundary is genuinely unclear after reading existing code

Stop and warn (proceed but flag explicitly) when:
- A new file is being created where an existing one could be extended cleanly
- An abstraction is being introduced from a single usage example
- A dependency between modules is being created in the wrong direction
