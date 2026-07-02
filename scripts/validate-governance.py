#!/usr/bin/env python3
"""Validate generated-project governance for AI Project Starter projects.

Copy this file into a generated project as scripts/validate-governance.py and
adapt only project-specific paths or checks. Keep checks small, explicit, and
failure-transparent.
"""

from __future__ import annotations

import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
STEP_RE = re.compile(r"\bSTEP-\d{4,}\b")

REQUIRED_DOCS = [
    "STATUS.md",
    "ROADMAP.md",
    "CHECKPOINTS.md",
    "AI_WORKFLOW.md",
    "VERSION_CONTROL.md",
    "ISSUE_TRACKING.md",
    "DEPLOYMENT.md",
    "CHANGELOG.md",
]

TASK_CARD_MARKERS = [
    "ID",
    "Type",
    "One outcome",
    "Why now",
    "Acceptance criteria",
    "Non-goals",
    "Evidence method",
    "Proof classification",
    "Required checks",
    "Issue links",
    "Rollback/containment",
    "Evidence after completion",
]

PROOF_CLASSIFICATIONS = [
    "machine-verifiable",
    "needs-packaged-app",
    "needs-human-permission",
    "needs-human-runtime",
    "manual-runtime",
    "blocked",
]

STATUS_STATE_KEYS = [
    "schema_version",
    "profile",
    "active_step",
    "current_step",
    "next_step",
    "branch",
    "head",
    "product_tag",
    "dirty",
    "remote_sync",
    "due_checkpoints",
    "blockers",
    "required_reads",
    "required_checks",
    "updated_at",
]


@dataclass
class Check:
    check_id: str
    passed: bool
    evidence: str
    severity: str = "fail"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def run(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def first_step_id(text: str) -> str:
    match = STEP_RE.search(text)
    return match.group(0) if match else ""


def all_step_ids(text: str) -> set[str]:
    return set(STEP_RE.findall(text))


def marker_value(text: str, marker: str) -> str:
    marker_lower = marker.lower()
    for line in text.splitlines():
        normalized = line.strip().lstrip("-* ").replace("**", "").strip()
        if not normalized.lower().startswith(marker_lower):
            continue
        if ":" not in normalized:
            continue
        return normalized.split(":", 1)[1].strip()
    return ""


def marker_has_content(text: str, marker: str) -> bool:
    value = marker_value(text, marker)
    return bool(value and value.upper() not in {"TBD", "TODO"})


def status_field(text: str, field: str) -> str:
    match = re.search(rf"^\s*{re.escape(field)}\s*:\s*(.+?)\s*$", text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def empty_state_value(value: str) -> bool:
    return value.strip().lower() in {"", "[]", "[ ]", "none", "n/a", "null", "false"}


def task_card_candidates(step_id: str) -> list[Path]:
    return [
        DOCS / "tasks" / f"{step_id}.md",
        DOCS / "task-cards" / f"{step_id}.md",
        DOCS / "TASKS" / f"{step_id}.md",
        DOCS / "TASK_CARDS" / f"{step_id}.md",
        DOCS / f"{step_id}.md",
    ]


def find_task_card(step_id: str) -> Path | None:
    for path in task_card_candidates(step_id):
        if path.is_file():
            return path

    for path in DOCS.rglob("*.md") if DOCS.is_dir() else []:
        if step_id in path.name and "task" in str(path).lower():
            return path
    return None


def check_required_docs() -> list[Check]:
    checks: list[Check] = []
    for doc in REQUIRED_DOCS:
        path = DOCS / doc
        checks.append(
            Check(
                f"doc.exists:{doc}",
                path.is_file(),
                "present" if path.is_file() else f"missing docs/{doc}",
            )
        )
    return checks


def check_step_and_task_card() -> list[Check]:
    checks: list[Check] = []
    status = read_text(DOCS / "STATUS.md")
    roadmap = read_text(DOCS / "ROADMAP.md")
    checkpoints = read_text(DOCS / "CHECKPOINTS.md")
    changelog = read_text(DOCS / "CHANGELOG.md")

    status_step = first_step_id(status)
    roadmap_steps = all_step_ids(roadmap)

    checks.append(
        Check(
            "step.status_has_active_step",
            bool(status_step),
            status_step or "STATUS.md must name the active or next Step ID",
        )
    )
    checks.append(
        Check(
            "step.roadmap_has_steps",
            bool(roadmap_steps),
            f"{len(roadmap_steps)} step(s)" if roadmap_steps else "ROADMAP.md has no Step IDs",
        )
    )

    if status_step:
        checks.append(
            Check(
                "step.status_matches_roadmap",
                status_step in roadmap_steps,
                f"{status_step} found in ROADMAP.md" if status_step in roadmap_steps else f"{status_step} missing from ROADMAP.md",
            )
        )
        task_card = find_task_card(status_step)
        checks.append(
            Check(
                "task_card.exists",
                task_card is not None,
                str(task_card.relative_to(ROOT)) if task_card else f"missing task card for {status_step}",
            )
        )

        if task_card:
            task_text = read_text(task_card)
            checks.append(
                Check(
                    "task_card.id_matches_status",
                    status_step in task_text,
                    f"{status_step} present" if status_step in task_text else f"{status_step} missing from task card",
                )
            )
            for marker in TASK_CARD_MARKERS:
                checks.append(
                    Check(
                        f"task_card.marker:{marker}",
                        marker_has_content(task_text, marker),
                        "filled" if marker_has_content(task_text, marker) else f"missing or empty: {marker}",
                    )
                )
            proof_value = marker_value(task_text, "Proof classification").lower()
            proof_valid = any(token in proof_value for token in PROOF_CLASSIFICATIONS)
            checks.append(
                Check(
                    "task_card.proof_classification_known",
                    proof_valid,
                    (
                        f"proof classification: {proof_value}"
                        if proof_valid
                        else "use machine-verifiable, needs-packaged-app, needs-human-permission, needs-human-runtime, manual-runtime, or blocked"
                    ),
                )
            )

    checks.append(
        Check(
            "checkpoint.ledger_mentions_steps",
            "STEP-" in checkpoints,
            "step-linked checkpoint ledger" if "STEP-" in checkpoints else "CHECKPOINTS.md must link checkpoints to Step IDs/events",
        )
    )
    checks.append(
        Check(
            "changelog.has_unreleased",
            "Unreleased" in changelog,
            "Unreleased section present" if "Unreleased" in changelog else "CHANGELOG.md missing Unreleased section",
        )
    )
    due_checkpoints = status_field(status, "due_checkpoints")
    checks.append(
        Check(
            "checkpoint.no_due_checkpoints",
            empty_state_value(due_checkpoints),
            (
                "no due checkpoints"
                if empty_state_value(due_checkpoints)
                else f"due_checkpoints={due_checkpoints}; run, repair, or mark the dependent action Blocked"
            ),
        )
    )
    return checks


def check_status_state_block() -> list[Check]:
    status = read_text(DOCS / "STATUS.md")
    missing = [key for key in STATUS_STATE_KEYS if key not in status]
    return [
        Check(
            "status.machine_state_keys",
            not missing,
            "required STATUS state keys present"
            if not missing
            else "STATUS.md missing machine-readable state keys: " + ", ".join(missing),
        )
    ]


def check_git_and_status() -> list[Check]:
    checks: list[Check] = []
    status_doc = read_text(DOCS / "STATUS.md")
    version_control = read_text(DOCS / "VERSION_CONTROL.md")
    deployment = read_text(DOCS / "DEPLOYMENT.md")
    issue_tracking = read_text(DOCS / "ISSUE_TRACKING.md")
    issue_ledger = read_text(DOCS / "issues" / "LEDGER.md")

    inside = run(["git", "rev-parse", "--is-inside-work-tree"])
    is_git = inside.returncode == 0 and inside.stdout.strip() == "true"
    checks.append(Check("git.repository", is_git, "inside git repository" if is_git else "not a git repository"))
    if not is_git:
        return checks

    branch_result = run(["git", "branch", "--show-current"])
    branch = branch_result.stdout.strip()
    checks.append(Check("git.branch_detected", bool(branch), branch or "detached or unknown branch"))

    default_branch = "main"
    remote_head = run(["git", "symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"])
    if remote_head.returncode == 0 and remote_head.stdout.strip().startswith("origin/"):
        default_branch = remote_head.stdout.strip().split("/", 1)[1]
    elif run(["git", "show-ref", "--verify", "refs/heads/main"]).returncode != 0:
        for candidate in ["master", "trunk"]:
            if run(["git", "show-ref", "--verify", f"refs/heads/{candidate}"]).returncode == 0:
                default_branch = candidate
                break

    porcelain = run(["git", "status", "--porcelain"]).stdout.strip()
    dirty = bool(porcelain)
    if branch == default_branch:
        checks.append(
            Check(
                "git.default_branch_clean",
                not dirty,
                "clean" if not dirty else "default branch has uncommitted changes",
            )
        )
    else:
        checks.append(
            Check(
                "git.feature_branch_dirty_state_recorded",
                not dirty or "dirty" in status_doc.lower() or "uncommitted" in status_doc.lower(),
                "clean or dirty state recorded" if (not dirty or "dirty" in status_doc.lower() or "uncommitted" in status_doc.lower()) else "dirty feature branch not recorded in STATUS.md",
            )
        )

    if branch:
        branch_check_required = branch == default_branch
        checks.append(
            Check(
                "status.names_current_branch",
                (branch in status_doc) if branch_check_required else True,
                (
                    f"{branch} listed in STATUS.md"
                    if branch in status_doc
                    else f"short-lived branch {branch}; STATUS default-branch check applies to {default_branch}"
                    if not branch_check_required
                    else f"STATUS.md must name current default branch: {branch}"
                ),
            )
        )

    remote = run(["git", "remote", "-v"]).stdout.strip()
    remote_blocked_docs = [status_doc, version_control, deployment, issue_tracking, issue_ledger]
    remote_blocked_synchronized = all(
        "remote" in text.lower() and "blocked" in text.lower() for text in remote_blocked_docs
    )
    checks.append(
        Check(
            "git.remote_recorded_or_blocked",
            bool(remote) or remote_blocked_synchronized,
            "remote configured or Blocked across canonical docs" if remote or remote_blocked_synchronized else "remote missing and not synchronized as Blocked across canonical docs",
        )
    )
    if not remote:
        checks.append(
            Check(
                "git.remote_blocked_synchronized",
                remote_blocked_synchronized,
                "remote Blocked in STATUS/VERSION_CONTROL/DEPLOYMENT/ISSUE_TRACKING/issue ledger"
                if remote_blocked_synchronized
                else "record remote Blocked in STATUS, VERSION_CONTROL, DEPLOYMENT, ISSUE_TRACKING, and docs/issues/LEDGER.md",
            )
        )
    return checks


def check_ci_and_handoff() -> list[Check]:
    checks: list[Check] = []
    workflow_text = "\n".join(read_text(path) for path in (ROOT / ".github" / "workflows").glob("*.yml")) if (ROOT / ".github" / "workflows").is_dir() else ""
    workflow_text += "\n".join(read_text(path) for path in (ROOT / ".github" / "workflows").glob("*.yaml")) if (ROOT / ".github" / "workflows").is_dir() else ""
    status_doc = read_text(DOCS / "STATUS.md")
    ai_workflow = read_text(DOCS / "AI_WORKFLOW.md")

    validator_command = "scripts/validate-governance.py"
    checks.append(
        Check(
            "governance.command_recorded",
            validator_command in status_doc and validator_command in ai_workflow,
            "recorded in STATUS.md and AI_WORKFLOW.md" if validator_command in status_doc and validator_command in ai_workflow else "record validator command in STATUS.md and AI_WORKFLOW.md",
        )
    )
    checks.append(
        Check(
            "ci.runs_governance_validator",
            validator_command in workflow_text or ("ci" in status_doc.lower() and "blocked" in status_doc.lower()),
            "CI runs governance validator" if validator_command in workflow_text else "CI missing or not marked Blocked in STATUS.md",
        )
    )

    handoff_files = [
        ROOT / "AGENTS.md",
        ROOT / "CLAUDE.md",
        ROOT / "GEMINI.md",
        ROOT / ".cursor" / "rules" / "project-instructions.mdc",
    ]
    existing = [path for path in handoff_files if path.is_file()]
    handoff_recorded = "handoff" in status_doc.lower()
    checks.append(
        Check(
            "handoff.exists_when_supported",
            bool(existing) or handoff_recorded,
            (
                ", ".join(str(path.relative_to(ROOT)) for path in existing)
                if existing
                else "handoff state recorded in STATUS.md"
                if handoff_recorded
                else "no root AI handoff file and no STATUS note"
            ),
            severity="warn",
        )
    )
    return checks


# --- Project-specific checks (solo-dev-portfolio-website) -------------------
# Enforce the zero-cost / static-only contract (GitHub Pages + Cloudflare only).
# See docs/ARCHITECTURE.md and docs/TECH_STACK.md.

FORBIDDEN_STACK_TOKENS = [
    "@astrojs/node",
    "@astrojs/vercel",
    "@astrojs/netlify",
    "@astrojs/cloudflare",
    "output: 'server'",
    'output: "server"',
    "output: 'hybrid'",
    'output: "hybrid"',
]


def check_zero_cost_guardrails() -> list[Check]:
    checks: list[Check] = []
    config = read_text(ROOT / "astro.config.mjs")
    pkg = read_text(ROOT / "package.json")

    has_static = "output: 'static'" in config or 'output: "static"' in config
    checks.append(
        Check(
            "guardrail.astro_output_static",
            has_static,
            "astro.config.mjs pins output: 'static'"
            if has_static
            else "astro.config.mjs must pin output: 'static' (no SSR/server output)",
        )
    )

    hits = [tok for tok in FORBIDDEN_STACK_TOKENS if tok in config or tok in pkg]
    checks.append(
        Check(
            "guardrail.no_ssr_or_paid_adapters",
            not hits,
            "no SSR adapter / server output present"
            if not hits
            else "forbidden static-only violation(s): " + ", ".join(hits),
        )
    )
    return checks


def main() -> int:
    checks: list[Check] = []
    checks.extend(check_required_docs())
    checks.extend(check_step_and_task_card())
    checks.extend(check_status_state_block())
    checks.extend(check_git_and_status())
    checks.extend(check_ci_and_handoff())
    checks.extend(check_zero_cost_guardrails())

    failures = [check for check in checks if not check.passed and check.severity == "fail"]
    for check in checks:
        if check.passed:
            status = "PASS"
        elif check.severity == "warn":
            status = "WARN"
        else:
            status = "FAIL"
        print(f"{status} {check.check_id} :: {check.evidence}")

    if failures:
        print(f"Generated-project governance validation failed with {len(failures)} failure(s).", file=sys.stderr)
        return 1

    print(f"Generated-project governance validation passed with {len(checks)} check(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
