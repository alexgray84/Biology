#!/usr/bin/env python3
"""Build every class homepage from tools/classes.json.

Run from the repository root:
    python3 tools/build_class_pages.py            # write classes/<slug>/index.html
    python3 tools/build_class_pages.py --check    # report only; fail if a page is stale

Each page has the same order: revision band, latest lessons, class extras, all units.
Lessons are read from the unit pages, so adding a lesson to a unit page and re-running
this script updates the class homepage. Edit classes.json to reorder units (newest
first) or to hold back lessons that have not been taught yet ("upto").
"""
from __future__ import annotations

import html
import json
import os
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path
from urllib.parse import quote, unquote

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "tools" / "classes.json"
LATEST_COUNT = 4
ICONS = set(re.findall(r'<symbol id="([a-z-]+)"', (ROOT / "assets/class-icons.svg").read_text("utf-8")))


def fail(message: str) -> None:
    sys.exit(f"build_class_pages: {message}")


def text(fragment: str) -> str:
    """Visible text of an HTML fragment."""
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", fragment))).strip()


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def split_target(target: str) -> tuple[str, str]:
    """Split 'path?query#hash' into (path, suffix)."""
    match = re.match(r"([^?#]*)(.*)", target)
    return match.group(1), match.group(2)


def site_path(page_dir: Path, href: str) -> tuple[Path, str]:
    """Resolve an href found on a page in page_dir to (absolute path, suffix)."""
    path, suffix = split_target(href)
    return (page_dir / unquote(path)).resolve(), suffix


def href_from(class_dir: Path, target: Path, suffix: str = "", folder: bool = False) -> str:
    """Relative, URL-encoded href from a class homepage to a file or folder in the site."""
    exists = target.is_dir() if folder else target.is_file()
    if not exists:
        fail(f"missing link target: {target.relative_to(ROOT) if ROOT in target.parents else target}")
    rel = os.path.relpath(target, class_dir).replace(os.sep, "/")
    if not rel.startswith("."):
        rel = "./" + rel
    return quote(rel) + ("/" if folder else "") + suffix


def added_dates() -> dict[str, date]:
    """First commit date of every tracked file (repo-relative path)."""
    out = subprocess.run(
        ["git", "-c", "core.quotepath=off", "log", "--diff-filter=A", "--name-only", "--format=@%cs"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout
    dates: dict[str, date] = {}
    current = None
    for line in out.splitlines():
        if line.startswith("@"):
            current = date.fromisoformat(line[1:])
        elif line and current:
            dates[line] = current  # log runs newest to oldest, so the oldest add wins
    return dates


ADDED = added_dates()


def added(path: Path) -> date:
    rel = path.relative_to(ROOT).as_posix()
    return ADDED.get(rel) or datetime.fromtimestamp(path.stat().st_mtime).date()


LINK_START = re.compile(r'<(a|article)\b[^>]*class="lesson-link(?:\s[^"]*)?"[^>]*>')


def lesson_blocks(page: str):
    """Yield (label, title, href, block) for each lesson-link block on a unit page."""
    starts = list(LINK_START.finditer(page))
    for i, match in enumerate(starts):
        end = starts[i + 1].start() if i + 1 < len(starts) else len(page)
        block = page[match.start():end]
        label = re.search(r'lesson-link__number">(.*?)</span>', block, re.S)
        title = re.search(r"<h3[^>]*>(.*?)</h3>", block, re.S)
        href = re.search(r'href="([^"]+)"', block)
        if label and title and href:
            yield text(label.group(1)), text(title.group(1)), html.unescape(href.group(1)), block


def unit_lessons(unit: dict) -> list[dict]:
    """Lessons on a unit page, in teaching order."""
    unit_dir = ROOT / unit["index"]
    index = unit_dir / "index.html"
    if not index.is_file():
        fail(f"unit page not found: {unit['index']}")
    include = re.compile(unit.get("include", r"^Lesson\s"))
    lessons, last_number = [], 0.0
    for position, (label, title, href, _) in enumerate(lesson_blocks(index.read_text("utf-8"))):
        short = label.split("·")[0].strip()
        number = re.match(r"Lesson\s+0*(\d+)([a-z]?)", short)
        if number:
            last_number = int(number.group(1)) + (0.5 if number.group(2) else 0)
            order, short = last_number, f"Lesson {int(number.group(1))}{number.group(2)}"
            code = f"{int(number.group(1)):02}{number.group(2)}"
        else:
            order, code = last_number + 0.01 * (position + 1), None
        if not include.search(label):
            continue
        target, suffix = site_path(unit_dir, href)
        lessons.append({"label": short, "title": title, "target": target, "suffix": suffix,
                        "order": order, "code": code, "unit": unit["title"], "icon": unit["icon"]})
    lessons.sort(key=lambda lesson: lesson["order"])
    if "upto" in unit:
        codes = [lesson["code"] for lesson in lessons]
        if unit["upto"] not in codes:
            fail(f"{unit['index']}: upto {unit['upto']!r} is not a lesson on that page ({codes})")
        lessons = lessons[: codes.index(unit["upto"]) + 1]
    return lessons


def latest_lessons(units: list[dict]) -> list[dict]:
    """Newest lessons: walk the units newest first, each unit's lessons latest first."""
    found: list[dict] = []
    for unit in units:
        for lesson in reversed(unit_lessons(unit)):
            if len(found) == LATEST_COUNT:
                return found
            found.append(lesson)
    return found


def revision(config: dict | None) -> dict | None:
    """Read pack, mock paper and topic groups from a revision hub page."""
    if not config:
        return None
    hub_dir = ROOT / config["hub"]
    page = (hub_dir / "index.html").read_text("utf-8")
    info = {"name": config["name"], "hub": hub_dir, "topics": [], "mock": None, "plan": False, "units": 0}
    sections = re.split(r'(?=<h2 id="[^"]+">)', page)[1:]
    for section in sections:
        anchor, heading = re.match(r'<h2 id="([^"]+)">(.*?)</h2>', section, re.S).groups()
        blocks = list(lesson_blocks(section))
        if text(heading).lower() == "start here":
            for label, title, href, block in blocks:
                if label.lower() == "mock paper":
                    minutes = re.search(r"(\d+)-minute", title)
                    info["mock"] = {"target": site_path(hub_dir, href), "minutes": minutes.group(1) if minutes else None}
                elif "countdown" in text(block).lower():
                    info["plan"] = True
            continue
        count = sum(1 for label, *_ in blocks if label.startswith("Unit"))
        if count:
            info["topics"].append((text(heading), anchor, count))
            info["units"] += count
    if not info["topics"]:
        fail(f"no topic sections found in {config['hub']}")
    return info


def icon(name: str, prefix: str) -> str:
    if name not in ICONS:
        fail(f"unknown icon: {name}")
    box = 24 if name.startswith("arrow") else 64
    return f'<svg class="i" viewBox="0 0 {box} {box}" aria-hidden="true"><use href="{prefix}assets/class-icons.svg#{name}"></use></svg>'


def short_date(day: date) -> str:
    return f"{day.day} {day.strftime('%b')}"


def render(cls: dict) -> str:
    class_dir = ROOT / "classes" / cls["slug"]
    up = "../../"
    arrow = icon("arrow", up)
    rev = revision(cls.get("revision"))
    lessons = latest_lessons(cls["units"])
    if not lessons:
        fail(f"{cls['slug']}: no lessons found")

    parts: list[str] = []
    add = parts.append
    add(f"""<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="{up}assets/science-mark.svg" type="image/svg+xml">
    <meta name="description" content="{esc(cls['title'])} class homepage for {esc(cls['code'])}.">
    <title>{esc(cls['code'])} | Science Lessons</title>
    <link rel="stylesheet" href="{up}assets/class-hub.css">
  </head>
  <!-- Generated by tools/build_class_pages.py from tools/classes.json. Edit those, not this file. -->
  <body class="class-hub">
    <a class="skip-link" href="#content">Skip to class resources</a>
    <header class="site-header{' site-header--rev' if rev else ''}">
      <div class="shell site-header__inner">
        <a class="brand" href="{up}"><img src="{up}assets/science-mark.svg" width="30" height="30" alt=""><span>Science &amp; Biology</span></a>
        <nav class="site-nav" aria-label="Site">""")
    if rev:
        hub_href = href_from(class_dir, rev["hub"], folder=True)
        add(f'          <a class="hub-rev-link" href="{hub_href}">{esc(rev["name"])}</a>')
    add(f"""          <a class="header-link" href="{up}">{icon('arrow-back', up)}All classes</a>
        </nav>
      </div>
    </header>
    <main class="shell page-main" id="content" tabindex="-1">
      <div class="hub-title"><h1>{esc(cls['title'])}</h1><span class="hub-title__code">{esc(cls['code'])}</span></div>""")

    if rev:
        copy = f"{rev['units']} one-page organisers, exam questions with mark schemes"
        extras = (["a countdown plan"] if rev["plan"] else []) + (
            [f"a {rev['mock']['minutes']}-minute mock paper" if rev["mock"]["minutes"] else "a mock paper"] if rev["mock"] else [])
        copy += (", " + " and ".join(extras) if len(extras) == 2 else " and " + extras[0] if extras else "") + "."
        add(f"""      <section class="hub-band" id="revision" aria-labelledby="revision-heading">
        <div><h2 id="revision-heading">{esc(rev['name'])}</h2><p>{esc(copy)}</p></div>
        <div class="hub-band__actions">
          <a class="hub-btn hub-btn--band" href="{hub_href}">Open revision pack {arrow}</a>""")
        if rev["mock"]:
            target, suffix = rev["mock"]["target"]
            add(f'          <a class="hub-btn hub-btn--ghost" href="{href_from(class_dir, target, suffix)}">Mock paper</a>')
        add("""        </div>
        <div class="hub-band__topics"><span>Jump to a topic</span>""")
        for name, anchor, count in rev["topics"]:
            label = f"{count} unit{'s' if count != 1 else ''}"
            add(f'          <a class="hub-topic" href="{hub_href}#{anchor}">{esc(name)} <small aria-label="{label}">{count}</small></a>')
        add("""        </div>
      </section>""")

    side = cls.get("side", [])
    first, rest = lessons[0], lessons[1:]
    first_day = added(first["target"])
    add(f"""      <div class="hub-now{'' if side else ' hub-now--solo'}">
        <section aria-labelledby="latest-heading">
          <div class="hub-h"><h2 id="latest-heading">Latest lessons</h2><span>Newest first</span></div>
          <a class="hub-lead" href="{href_from(class_dir, first['target'], first['suffix'])}">
            {icon(first['icon'], up)}
            <div><h3>{esc(first['title'])}</h3><p class="hub-meta"><b>{esc(first['unit'])}</b> · {esc(first['label'])} · added <time datetime="{first_day.isoformat()}">{short_date(first_day)}</time></p></div>
            <span class="hub-btn hub-btn--go">Open lesson {arrow}</span>
          </a>""")
    if rest:
        add('          <ul class="hub-rows">')
        for lesson in rest:
            day = added(lesson["target"])
            add(f'            <li><a class="hub-row" href="{href_from(class_dir, lesson["target"], lesson["suffix"])}"><div><h3>{esc(lesson["title"])}</h3><p class="hub-meta">{esc(lesson["unit"])} · {esc(lesson["label"])}</p></div><time datetime="{day.isoformat()}">{short_date(day)}</time>{arrow}</a></li>')
        add("          </ul>")
    add("        </section>")
    if side:
        add("""        <aside class="hub-side" aria-labelledby="side-heading">
          <div class="hub-h"><h2 id="side-heading">Also for this class</h2></div>
          <ul class="hub-rows">""")
        for item in side:
            path, suffix = split_target(item["href"])
            target = ROOT / path
            href = href_from(class_dir, target, suffix, folder=path.endswith("/"))
            add(f'            <li><a class="hub-row" href="{href}">{icon(item["icon"], up)}<div><h3>{esc(item["title"])}</h3><p class="hub-meta">{esc(item["meta"])}</p></div>{arrow}</a></li>')
        add("""          </ul>
        </aside>""")
    add("""      </div>
      <section class="hub-all" id="units" aria-labelledby="units-heading">
        <div class="hub-h"><h2 id="units-heading">All units</h2><span>Newest first</span></div>
        <ul class="hub-units">""")
    for position, unit in enumerate(cls["units"]):
        pill = '<span class="hub-pill">Current unit</span>' if position == 0 else ""
        href = href_from(class_dir, ROOT / unit["index"], folder=True)
        add(f'          <li><a class="hub-unit" href="{href}">{icon(unit["icon"], up)}<div><h3><span>{esc(unit["title"])}</span>{pill}</h3><p class="hub-meta">{esc(unit["meta"])}</p></div>{arrow}</a></li>')
    add(f"""        </ul>
      </section>
    </main>
    <footer class="site-footer">
      <div class="shell">{esc(cls['code'])} class homepage</div>
    </footer>
  </body>
</html>
""")
    return "\n".join(parts)


def main() -> None:
    check = "--check" in sys.argv[1:]
    stale = []
    for cls in json.loads(DATA.read_text("utf-8"))["classes"]:
        page = ROOT / "classes" / cls["slug"] / "index.html"
        output = render(cls)
        if check:
            if not page.is_file() or page.read_text("utf-8") != output:
                stale.append(cls["slug"])
        else:
            page.write_text(output, "utf-8")
            print(f"wrote classes/{cls['slug']}/index.html")
    if stale:
        fail("stale class pages (re-run without --check): " + ", ".join(stale))


if __name__ == "__main__":
    main()
