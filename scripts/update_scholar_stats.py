"""Update the Google Scholar metrics rendered on the homepage."""

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


def fetch_stats() -> tuple[int, int, int]:
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
        for key in ("citations", "h_index", "i10_index"):
            value = row.get(key, {}).get("all")
            if isinstance(value, int):
                values[key] = value

    missing = [key for key in ("citations", "h_index", "i10_index") if key not in values]
    if missing:
        raise RuntimeError(f"SerpAPI response is missing: {', '.join(missing)}")
    if values["citations"] <= 0 or values["h_index"] <= 0 or values["i10_index"] <= 0:
        raise RuntimeError("SerpAPI returned invalid Scholar metrics")

    return values["citations"], values["h_index"], values["i10_index"]


def current_stats() -> tuple[int, int, int] | None:
    content = DATA_FILE.read_text(encoding="utf-8")
    parsed: dict[str, int] = {}
    for key in ("citations", "h_index", "i10_index"):
        match = re.search(rf"^{key}:\s*(\d+)\s*$", content, re.MULTILINE)
        if not match:
            return None
        parsed[key] = int(match.group(1))
    return parsed["citations"], parsed["h_index"], parsed["i10_index"]


def main() -> None:
    citations, h_index, i10_index = fetch_stats()
    new_stats = (citations, h_index, i10_index)
    if current_stats() == new_stats:
        print(
            f"Scholar metrics unchanged: citations={citations}, "
            f"h-index={h_index}, i10-index={i10_index}"
        )
        return

    updated = dt.datetime.now(dt.timezone.utc).date().isoformat()
    DATA_FILE.write_text(
        "\n".join(
            [
                "# Updated weekly from Google Scholar through SerpAPI.",
                f"citations: {citations}",
                f"h_index: {h_index}",
                f"i10_index: {i10_index}",
                f"updated: {updated}",
                "",
            ]
        ),
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Scholar metrics updated: citations={citations}, "
        f"h-index={h_index}, i10-index={i10_index} ({updated})"
    )


if __name__ == "__main__":
    main()
