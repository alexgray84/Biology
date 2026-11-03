"""Static navigation regressions for the two Year 7 class routes.

Run from the repository root with:
    python3 -m unittest discover -s tests -p 'test_y7_navigation.py'
"""

from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class NavigationParser(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.links = []
        self.active_link = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self.active_link = {
                "attrs": attrs,
                "ancestors": list(self.stack),
                "text": "",
                "number": "",
            }
            self.links.append(self.active_link)
        if tag not in VOID_ELEMENTS:
            self.stack.append((tag, attrs))

    def handle_endtag(self, tag):
        if tag == "a":
            self.active_link = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if self.active_link is None:
            return
        self.active_link["text"] += data
        if any(
            "lesson-link__number" in attrs.get("class", "").split()
            for _, attrs in self.stack
        ):
            self.active_link["number"] += data


def has_class(link, class_name):
    return class_name in link["attrs"].get("class", "").split()


def in_element(link, tag, *, element_id=None, class_name=None):
    return any(
        name == tag
        and (element_id is None or attrs.get("id") == element_id)
        and (class_name is None or class_name in attrs.get("class", "").split())
        for name, attrs in link["ancestors"]
    )


class Year7NavigationTests(unittest.TestCase):
    def page(self, relative_path):
        return NavigationParser((ROOT / relative_path).read_text(encoding="utf-8"))

    def test_class_units_contain_only_their_eight_lessons(self):
        for code, other_code in (("01", "04"), ("04", "01")):
            with self.subTest(class_code=code):
                page = self.page(f"classes/7-sci-{code}/cells-and-living-things/index.html")
                lessons = [
                    link for link in page.links
                    if has_class(link, "lesson-link")
                    and in_element(link, "section", element_id="lessons")
                ]
                self.assertEqual(len(lessons), 8)
                self.assertEqual(
                    [link["number"].strip() for link in lessons],
                    [f"Lesson {number:02}" for number in range(1, 9)],
                )
                for number, link in enumerate(lessons, start=1):
                    href = unquote(link["attrs"]["href"])
                    self.assertIn("/current/year-7/cells-and-living-things/", href)
                    self.assertTrue(Path(href).name.startswith(f"{number:02} "))
                    if number >= 5:
                        self.assertIn(f"(7.{code})", href)
                    self.assertNotIn(f"7.{other_code}", href)
                for link in page.links:
                    self.assertNotIn(f"7.{other_code}", unquote(link["attrs"].get("href", "")))

    def test_cover_is_separate_and_only_for_701(self):
        for code in ("01", "04"):
            with self.subTest(class_code=code):
                page = self.page(f"classes/7-sci-{code}/cells-and-living-things/index.html")
                cover_links = [
                    link for link in page.links
                    if "7.01 cover.html" in unquote(link["attrs"].get("href", ""))
                ]
                self.assertEqual(len(cover_links), 1 if code == "01" else 0)
                if code == "01":
                    cover = cover_links[0]
                    self.assertIn("cover", cover["text"].lower())
                    self.assertTrue(in_element(cover, "section", element_id="cover-work"))
                    self.assertFalse(in_element(cover, "section", element_id="lessons"))
                    first_lesson = next(
                        link for link in page.links
                        if in_element(link, "section", element_id="lessons")
                    )
                    self.assertLess(page.links.index(cover), page.links.index(first_lesson))

    def test_shared_unit_route_is_an_explicit_class_chooser(self):
        page = self.page("units/year-7/cells-and-living-things/index.html")
        class_links = [link for link in page.links if has_class(link, "unit-card")]
        self.assertEqual(
            {link["attrs"]["href"] for link in class_links},
            {
                "../../../classes/7-sci-01/cells-and-living-things/",
                "../../../classes/7-sci-04/cells-and-living-things/",
            },
        )
        self.assertEqual(len(class_links), 2)
        for code in ("01", "04"):
            self.assertTrue(any(f"7/SCI/{code}" in link["text"] for link in class_links))
        self.assertFalse(any("/current/" in link["attrs"].get("href", "") for link in page.links))

    def test_class_homepages_open_their_own_cells_index(self):
        for code in ("01", "04"):
            with self.subTest(class_code=code):
                page = self.page(f"classes/7-sci-{code}/index.html")
                cells_links = [
                    link for link in page.links
                    if has_class(link, "unit-card") and "Cells and living things" in link["text"]
                ]
                self.assertEqual(len(cells_links), 1)
                self.assertEqual(cells_links[0]["attrs"]["href"], "./cells-and-living-things/")

    def test_ap2_is_the_first_homepage_resource(self):
        for code in ("01", "04"):
            with self.subTest(class_code=code):
                page = self.page(f"classes/7-sci-{code}/index.html")
                first_resource = next(link for link in page.links if has_class(link, "unit-card"))
                self.assertEqual(first_resource["attrs"]["href"], "../../units/year-7/ap2-revision/")
                self.assertTrue(in_element(first_resource, "section", element_id="ap2"))

    def test_ap2_has_a_direct_header_link_on_each_navigation_page(self):
        pages = {
            "classes/7-sci-01/index.html": "../../units/year-7/ap2-revision/",
            "classes/7-sci-04/index.html": "../../units/year-7/ap2-revision/",
            "classes/7-sci-01/cells-and-living-things/index.html": "../../../units/year-7/ap2-revision/",
            "classes/7-sci-04/cells-and-living-things/index.html": "../../../units/year-7/ap2-revision/",
            "units/year-7/cells-and-living-things/index.html": "../../../units/year-7/ap2-revision/",
        }
        for relative_path, expected_href in pages.items():
            with self.subTest(page=relative_path):
                page = self.page(relative_path)
                ap2_links = [link for link in page.links if has_class(link, "y7-ap2-link")]
                self.assertEqual(len(ap2_links), 1)
                self.assertEqual(ap2_links[0]["attrs"]["href"], expected_href)
                self.assertTrue(in_element(ap2_links[0], "header", class_name="site-header"))

    def test_unit_and_lesson_links_resolve_to_existing_local_pages(self):
        pages = [
            "classes/7-sci-01/index.html",
            "classes/7-sci-04/index.html",
            "classes/7-sci-01/cells-and-living-things/index.html",
            "classes/7-sci-04/cells-and-living-things/index.html",
            "units/year-7/cells-and-living-things/index.html",
        ]
        for relative_path in pages:
            with self.subTest(page=relative_path):
                page_path = ROOT / relative_path
                page = self.page(relative_path)
                for link in page.links:
                    if not any(has_class(link, name) for name in (
                        "unit-card", "lesson-link", "y7-ap2-link", "header-link", "brand",
                    )):
                        continue
                    href = urlsplit(link["attrs"].get("href", ""))
                    if not href.path or href.scheme or href.netloc:
                        continue
                    target = page_path.parent / unquote(href.path)
                    if target.is_dir():
                        target /= "index.html"
                    self.assertTrue(target.is_file(), f"Missing link target: {relative_path} → {href.path}")


if __name__ == "__main__":
    unittest.main()
