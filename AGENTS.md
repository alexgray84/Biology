# Science and Biology lesson site: working instructions

The teacher locked in the current lesson-building approach on **13 September 2026**. Read and follow [LESSON_AUTHORING_STANDARD.md](LESSON_AUTHORING_STANDARD.md) for new lessons and substantial revisions. It supersedes the earlier all-inline HTML, legacy-theme, universal ability-tier and private-only answer defaults. Existing lessons do not require automatic migration.

## Site and content ownership

This repository hosts pupil-facing science lessons for Arcadia British School Dubai at https://alexgray84.github.io/Biology/. Current routes are:

- `index.html`: current class directory.
- `classes/<class-code>/index.html`: class homepage.
- `units/<course>/<unit>/index.html`: lessons in teaching order.
- `current/<course>/<unit>/`: lesson HTML and local asset packages.

Year 10 Triple Biology is `10/Bio/Tri2`, with class route `classes/10-bio-tri2/` and unit route `units/year-10-triple/cells/`. Preserve existing URLs. The new lessons are Lessons 04 and 05 directly in `current/year-10/triple-biology-cells/`, with `04 Resources` and `05 Resources`. Organise lessons by curriculum unit, not by week. The former Week 3 entry URLs only redirect to the unit copies.

## Required authoring behaviour

Use the Arcadia projection layout: six screen families, specification-linked outcomes, purposeful do now, explicit small-step input, modelling, guided and independent thinking, relevant adaptations and HOT. Populate all six contextual widget capabilities purposefully. Every question and pupil-response task, including widget tasks, must have an explicit model-answer and mark-scheme reveal. Keep answers hidden until opened; unmarked tasks use labelled success criteria.

Use a direct HTML entry point with local assets. JavaScript and CSS may live beside the lesson. Retain local dependencies and licences; do not require a remote build framework for the pupil route. Do not copy the Week 3 subject content into unrelated lessons.

Pupil model answers and mark schemes are authorised public review content. Private teaching notes, personal/class data, pupil identifiers, code-to-name mappings, secrets and private-companion links are not. Publish only the requested lesson package, navigation and relevant authoring documentation.

## Publishing

GitHub Pages currently serves the root of `main`. Verify the live configuration when publishing. Stage explicit paths, commit with a useful summary and use a normal fast-forward push. Do not overwrite concurrent work or use a force push. Update class/unit links and lesson counts. Check deployment completion and the published paths.

The teacher's explicit push request supplies publication approval. Respect a session instruction to leave classroom/browser test gates to the teacher, recording the limitation without claiming those checks passed. A deployed page is not proof of classroom suitability.
