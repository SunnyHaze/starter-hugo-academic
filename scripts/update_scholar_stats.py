"""Update the Google Scholar metrics rendered on the homepage.

Credential maintenance:
- Manage or regenerate the key at https://serpapi.com/manage-api-key
- Store it as the ``SERPAPI_KEY`` Actions repository secret in GitHub.
- Never place the key in this file, the workflow, or ``data/scholar.yaml``.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import pathlib
import re
import urllib.error
import urllib.parse
import urllib.request


AUTHOR_ID = "hGEIyCEAAAAJ"
DATA_FILE = pathlib.Path(__file__).resolve().parents[1] / "data" / "scholar.yaml"
SERPAPI_URL = "https://serpapi.com/search.json"
METRIC_KEYS = ("citations", "h_index", "i10_index")


def fetch_stats() -> dict[str, int]:
    api_key = os.environ.get("SERPAPI_KEY")
    if not api_key:
        raise RuntimeError("SERPAPI_KEY is not configured")

    query = urllib.parse.urlencode(
        {
            "engine": "google_scholar_author",
            "author_id": AUTHOR_ID,
            "hl": "en",
            "api_key": api_key,
        }
    )
    request = urllib.request.Request(
        f"{SERPAPI_URL}?{query}",
        headers={"Accept": "application/json", "User-Agent": "xiaochen-ma-homepage-stats"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Unable to read Scholar metrics from SerpAPI: {exc}") from exc

    if payload.get("error"):
        raise RuntimeError(f"SerpAPI returned an error: {payload['error']}")

    values: dict[str, int] = {}
    for row in payload.get("cited_by", {}).get("table", []):
        for key in METRIC_KEYS:
            value = row.get(key, {}).get("all")
            if isinstance(value, int):
                values[key] = value

    missing = [key for key in METRIC_KEYS if key not in values]
    if missing:
        raise RuntimeError(f"SerpAPI response is missing: {', '.join(missing)}")
    if any(values[key] <= 0 for key in METRIC_KEYS):
        raise RuntimeError("SerpAPI returned invalid Scholar metrics")

    return values


def current_stats() -> dict[str, int] | None:
    content = DATA_FILE.read_text(encoding="utf-8")
    parsed: dict[str, int] = {}
    for key in METRIC_KEYS:
        match = re.search(rf"^{key}:\s*(\d+)\s*$", content, re.MULTILINE)
        if not match:
            return None
        parsed[key] = int(match.group(1))
    return parsed


def main() -> None:
    stats = fetch_stats()
    if current_stats() == stats:
        print(
            f"Scholar metrics unchanged: citations={stats['citations']}, "
            f"h-index={stats['h_index']}, i10-index={stats['i10_index']}"
        )
        return

    updated = dt.datetime.now(dt.timezone.utc).date().isoformat()
    DATA_FILE.write_text(
        "\n".join(
            [
                "# Updated weekly from Google Scholar through SerpAPI.",
                *(f"{key}: {stats[key]}" for key in METRIC_KEYS),
                f"updated: {updated}",
                "",
            ]
        ),
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Scholar metrics updated: citations={stats['citations']}, "
        f"h-index={stats['h_index']}, i10-index={stats['i10_index']} ({updated})"
    )


if __name__ == "__main__":
    main()
