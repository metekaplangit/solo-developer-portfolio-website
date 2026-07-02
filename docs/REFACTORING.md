# Refactoring

> **Purpose:** Behavior-preserving refactor cadence, hotspot/debt triggers, and safe-move rules.
> **Read when:** Before opening a new feature packet, or when a module gets awkward/duplicated.
> **Update when:** Refactor triggers, debt thresholds, or safe-move rules change.
> **Synchronize with:** ARCHITECTURE.md, TESTING.md, ROADMAP.md, STATUS.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Definition

Refactoring is **behavior-preserving**: no new feature, no bug-fix behavior, no
product SemVer bump; tests green before and after. If tests must change because
behavior changed, split the work into a separate packet.

## Three triggers (kept together)

1. **Hotspot (rule-of-three):** a third same-class patch to a module, or a
   fix-of-a-fix, forces a refactor/consolidation packet before another patch
   (unless explicitly blocked and recorded).
2. **Consolidation cadence:** run a consolidation pass after every **one or two**
   feature packets — review cohesion, coupling, dependency direction, duplication
   (esp. product-fact duplication), naming, magic values, dead code, size.
3. **Milestone/backstop debt pass:** at each milestone boundary.

## Decision rubric

Patch clean code; refactor-then-change awkward code; force a refactor for flagged
hotspots; spike unclear constraints on a throwaway branch; leave isolated
low-risk code; avoid big-bang rewrites.

## Safe techniques

Characterization tests before moving untested behavior; one named move per commit
(rename, extract, inline, move, consolidate-duplicates, introduce-seam, delete
dead code); mechanical moves before judgment-heavy moves.

## Deferred debt

Deferred debt becomes a tracked issue + a STATUS entry. The next feature packet
cannot open until the cadence pass is completed, explicitly deferred with reason,
or blocked.
