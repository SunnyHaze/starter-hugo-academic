"""Update the aggregate GitHub star count rendered on the homepage."""

from __future__ import annotations

import datetime as dt
import json
import os
import pathlib
import re
import urllib.error
import urllib.request


DATA_FILE = pathlib.Path(__file__).resolve().parents[1] / "data" / "github.yaml"
REPOSITORY_PATTERN = re.compile(
    r"^\s*-\s+([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)\s*$", re.MULTILINE
)


def configured_repositories() -> list[str]:
    content = DATA_FILE.read_text(encoding="utf-8")
    repositories = REPOSITORY_PATTERN.findall(content)
    if not repositories:
        raise RuntimeError(f"No repositories configured in {DATA_FILE}")
    if len(repositories) != len(set(repository.lower() for repository in repositories)):
        raise RuntimeError("Duplicate repositories found in GitHub star configuration")
    return repositories


def repository_stars(repository: str) -> int:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "xiaochen-ma-homepage-stats",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(
        f"https://api.github.com/repos/{repository}", headers=headers
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Unable to read {repository}: {exc}") from exc

    stars = payload.get("stargazers_count")
    if not isinstance(stars, int) or stars < 0:
        raise RuntimeError(f"Invalid star count returned for {repository}")
    print(f"{repository}: {stars}")
    return stars


def main() -> None:
    repositories = configured_repositories()
    total = sum(repository_stars(repository) for repository in repositories)
    updated = dt.datetime.now(dt.timezone.utc).date().isoformat()

    lines = [
        "# Repositories included in the homepage's aggregate GitHub star count.",
        "# Add or remove an `owner/repository` entry; the weekly workflow updates `stars`.",
        "repositories:",
        *(f"  - {repository}" for repository in repositories),
        f"stars: {total}",
        f"updated: {updated}",
        "",
    ]
    DATA_FILE.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    print(f"Aggregate GitHub stars: {total} ({updated})")


if __name__ == "__main__":
    main()
