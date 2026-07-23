#!/usr/bin/env python3
"""Create one or more standardized GitHub issues in this repo via `gh`.

Ensures the fixed label taxonomy exists (creating any missing labels with a
consistent color), builds a body from Problem/Why it matters/Suggested
approach sections, and calls `gh issue create` once per issue. Exists so
every issue this skill creates looks the same, instead of each invocation
hand-rolling its own `gh` call and drifting in format.

Usage:
  # single issue
  create_issues.py --title "..." --problem "..." --why "..." --approach "..." \
      --labels bug,priority:high[,launch-blocker,whatsapp,billing]

  # batch, from a JSON file: a list of objects with the same fields
  # (title, problem, why, approach, labels: [...], references: "..." optional)
  create_issues.py --file issues.json

Both modes print the created issue URLs, one per line.
"""

from __future__ import annotations

import argparse
import json
import subprocess

REPO = "LEstebanR/spapp"

# Only labels NOT already covered by GitHub's defaults (bug, enhancement).
# Colors are fixed so re-runs never create a second, differently-colored
# version of the same label.
TAXONOMY_LABELS = {
    "launch-blocker": ("e11d21", "Must ship before v1 launch"),
    "whatsapp": ("25D366", "Client-facing WhatsApp messaging"),
    "billing": ("f2c94c", "Pricing, subscriptions and payments"),
    "priority: urgent": ("b60205", ""),
    "priority: high": ("d93f0b", ""),
    "priority: medium": ("fbca04", ""),
    "priority: low": ("c2e0c6", ""),
}

# priority: N shorthand -> the real label name
PRIORITY_ALIASES = {
    "priority:urgent": "priority: urgent",
    "priority:high": "priority: high",
    "priority:medium": "priority: medium",
    "priority:low": "priority: low",
}


def run(*args: str) -> str:
    result = subprocess.run(args, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"command failed: {' '.join(args)}\n{result.stderr}")
    return result.stdout.strip()


def existing_labels() -> set[str]:
    out = run("gh", "label", "list", "--repo", REPO, "--json", "name")
    return {item["name"] for item in json.loads(out)}


def ensure_labels(labels: list[str], known: set[str]) -> None:
    for label in labels:
        if label in known or label not in TAXONOMY_LABELS:
            continue
        color, description = TAXONOMY_LABELS[label]
        args = ["gh", "label", "create", label, "--repo", REPO, "--color", color]
        if description:
            args += ["--description", description]
        run(*args)
        known.add(label)


def normalize_labels(labels: list[str]) -> list[str]:
    return [PRIORITY_ALIASES.get(label, label) for label in labels]


def build_body(problem: str, why: str, approach: str, references: str | None) -> str:
    body = f"## Problem\n{problem.strip()}\n\n## Why it matters\n{why.strip()}\n\n## Suggested approach\n{approach.strip()}\n"
    if references:
        body += f"\n## References\n{references.strip()}\n"
    return body


def create_issue(
    title: str, problem: str, why: str, approach: str, labels: list[str], references: str | None = None
) -> str:
    labels = normalize_labels(labels)
    known = existing_labels()
    ensure_labels(labels, known)
    body = build_body(problem, why, approach, references)
    args = ["gh", "issue", "create", "--repo", REPO, "--title", title, "--body", body]
    for label in labels:
        args += ["--label", label]
    return run(*args)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--title")
    parser.add_argument("--problem")
    parser.add_argument("--why")
    parser.add_argument("--approach")
    parser.add_argument("--references")
    parser.add_argument("--labels", help="comma-separated, e.g. bug,priority:high")
    parser.add_argument("--file", help="JSON file with a list of issues (batch mode)")
    args = parser.parse_args()

    if args.file:
        with open(args.file) as f:
            issues = json.load(f)
        for issue in issues:
            url = create_issue(
                issue["title"],
                issue["problem"],
                issue["why"],
                issue["approach"],
                issue.get("labels", []),
                issue.get("references"),
            )
            print(url)
        return

    missing = [f for f in ("title", "problem", "why", "approach") if not getattr(args, f)]
    if missing:
        parser.error(f"missing required arguments: {', '.join('--' + m for m in missing)} (or use --file)")

    labels = args.labels.split(",") if args.labels else []
    url = create_issue(args.title, args.problem, args.why, args.approach, labels, args.references)
    print(url)


if __name__ == "__main__":
    main()
