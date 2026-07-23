---
name: github-issue
description: Create standardized, easy-to-parse GitHub issues in this repo (LEstebanR/spapp), one at a time or in batch, via a bundled script that wraps `gh issue create`. Use whenever the user asks to file a GitHub issue, turn a bug/gap/backlog item into a tracked issue, or migrate a list of items (e.g. from an audit, a Linear backlog, or a code review) into GitHub Issues for this repo — even if they just say "create issues for this" without naming GitHub explicitly.
---

# GitHub issue creation (spapp)

Every issue this skill creates has the same shape — same body sections, same label taxonomy — so that later, listing issues (`gh issue list`) or opening one to work on gives Claude (or a human) everything needed without having to guess the format. Don't hand-write `gh issue create` calls for this repo; use the bundled script so nothing drifts.

## Body sections (always these three, in this order)

```
## Problem
What's missing or broken. Point at the actual file/function involved when known.

## Why it matters
The concrete consequence — who hits this, what breaks, why it can't wait (or why it can).

## Suggested approach
A real starting point: which files to touch, which existing pattern in the codebase to mirror. Not a full spec — just enough that picking this up doesn't start from zero.
```

A fourth, optional `## References` section holds links or file paths that don't fit naturally in the prose above.

## Label taxonomy

Type — reuse GitHub's own defaults, don't create competing labels:
- `bug` — something is broken
- `enhancement` — new feature or improvement (no separate "feature"/"improvement" split; this is a one-person project, that distinction isn't worth the overhead)

Domain/theme (created by the script on first use if missing):
- `launch-blocker` — must ship before v1
- `whatsapp` — client-facing WhatsApp messaging
- `billing` — pricing, subscriptions, payments

Priority (GitHub issues have no native priority field, so it's a label):
- `priority: urgent`, `priority: high`, `priority: medium`, `priority: low`

Pick whichever of these actually apply — most issues need one type label + one priority label, plus a domain label if relevant. Don't invent new labels for a one-off; if nothing in the taxonomy fits, it's fine to leave the domain label off rather than growing the taxonomy for a single issue.

## Creating issues

Use `scripts/create_issues.py` — it ensures the taxonomy labels exist (creating any that are missing, with fixed colors so re-runs don't duplicate them), builds the body from the three sections, and calls `gh issue create`.

**Single issue:**
```bash
python3 .claude/skills/github-issue/scripts/create_issues.py \
  --title "Bug: doble-reserva — la disponibilidad no valida turnos existentes" \
  --problem "..." \
  --why "..." \
  --approach "..." \
  --labels bug,launch-blocker,priority:high
```

**Batch** (e.g. migrating a backlog): write a JSON array to a temp file — each item has `title`, `problem`, `why`, `approach`, `labels` (array), and optionally `references` — then:
```bash
python3 .claude/skills/github-issue/scripts/create_issues.py --file /tmp/issues.json
```

Both modes print the created issue URL(s). Compose the title, problem/why/approach text, and labels yourself based on what you actually know about the codebase — the script only handles the mechanical part (labels + `gh` call), not the judgment about what the issue should say.
