"""Update the citation count rendered on the homepage.

The script uses only Python's standard library so it can run on GitHub Actions
without installing dependencies. It exits without touching the existing data
file when Google Scholar is unavailable or returns an unexpected page.
"""

from __future__ import annotations

import datetime as dt
import pathlib
import re
import urllib.error
import urllib.request


SCHOLAR_ID = "hGEIyCEAAAAJ"
DATA_FILE = pathlib.Path(__file__).resolve().parents[1] / "data" / "scholar.yaml"
PROFILE_URLS = (
    f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en",
    f"https://scholar.google.com.hk/citations?user={SCHOLAR_ID}&hl=en",
)
HEADERS = {
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
}
CITATION_PATTERN = re.compile(
    r">Citations</a></td>\s*<td[^>]*class=[\"']gsc_rsb_std[\"'][^>]*>"
    r"\s*([\d,]+)\s*</td>",
    re.IGNORECASE,
)


def fetch_citations() -> int:
    errors: list[str] = []
    for url in PROFILE_URLS:
        request = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                html = response.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError) as exc:
            errors.append(f"{url}: {exc}")
            continue

        match = CITATION_PATTERN.search(html)
        if match:
            count = int(match.group(1).replace(",", ""))
            if count > 0:
                return count
        errors.append(f"{url}: citation count not found")

    raise RuntimeError("; ".join(errors))


def main() -> None:
    citations = fetch_citations()
    updated = dt.datetime.now(dt.timezone.utc).date().isoformat()
    DATA_FILE.write_text(
        f"citations: {citations}\nupdated: {updated}\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Google Scholar citations: {citations} ({updated})")


if __name__ == "__main__":
    main()
