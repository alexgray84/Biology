# Biology Interactive Lessons: Claude Code Instructions

## What This Is
A collection of interactive HTML science lessons hosted on GitHub Pages, built by Alex Gray for students at Arcadia British School Dubai. Covers KS3 Science, IGCSE Biology (Pearson Edexcel), and IAL Biology (Pearson Edexcel A-Level). Each lesson is a self-contained HTML file with embedded CSS/JS — no build tools, no frameworks, just static files served via GitHub Pages.

**Live site:** https://alexgray84.github.io/Biology/

## Tech Stack
- Pure HTML/CSS/JS (no framework)
- Google Fonts: DM Sans, Instrument Serif, JetBrains Mono
- GitHub Pages for hosting
- Git for version control

## Architecture
```
Biology/
├── index.html                 # Main landing page (links to all courses)
├── ial/                       # IAL Biology (A-Level)
│   └── unit-2/                # 12 lessons (most active area)
│       ├── index.html         # Unit index with lesson list
│       └── *.html             # Individual lessons
├── IGCSE/                     # IGCSE Biology
│   ├── index.html             # Topic 4: Ecology
│   ├── index5.html            # Topic 5: Biological Resources
│   ├── topic-2/               # Topic 2: Structure & Function
│   └── *.html                 # Individual lessons
├── KS3/                       # Key Stage 3
│   ├── Biology/Ecosystems/    # 1 lesson
│   └── Physics/               # Forces (2), Waves (2), Sound (1)
└── revision/                  # Revision sessions
```

### Pattern: Each lesson is a single self-contained HTML file
- All CSS is in a `<style>` block in `<head>`
- All JS is in a `<script>` block at the end of `<body>`
- No external dependencies beyond Google Fonts
- Two design systems in use:
  1. **Dark theme** (IGCSE, newer): `--bg: #0f110f`, green accent, dark surface
  2. **Warm light theme** (IAL unit-2, newer): `--bg: #f5f0e8`, terracotta accent, serif display font
  3. **Simple green/blue gradient** (index pages, older): system-ui fonts, card-based layout

### Lesson Features
- Sticky section navigation
- Progress tracking
- Tiered difficulty (Foundation / Core / Challenge)
- Interactive quizzes with feedback
- Interleaved retrieval practice questions

## Key Files
- `index.html` — Main landing page, links to all courses and units
- `ial/unit-2/index.html` — Unit 2 lesson list (most lessons live here)
- `IGCSE/index5.html` — Topic 5 index (most recent IGCSE work)
- `IGCSE/Selective-breeding.html` — Most recently created lesson

## Commands
```bash
# Preview locally
open index.html          # or use Live Server in VS Code

# Deploy (auto via GitHub Pages on push)
git add <files>
git commit -m "Add lesson"
git push
```

## Coding Conventions
- Lesson files use kebab-case for new files (older files have spaces/PascalCase)
- Each lesson is entirely self-contained (no shared CSS/JS files)
- Index pages follow a consistent template with course-section cards
- Lessons use CSS custom properties for theming
- Interactive elements use vanilla JS (no jQuery, no React)
- Status badges on index: "Coming soon" vs active lesson count

## Current Work
- Most recent: IGCSE Selective Breeding lesson + Topic 5 index update (Feb 24)
- IAL Unit 2 is the most complete section (12 lessons covering Topics 3A-3C)
- KS3 Physics has 5 lessons across Forces, Waves, Sound
- Many sections still marked "Coming soon"

## Domain Context
This is an education project. Lessons follow evidence-informed pedagogy:
- **Retrieval practice** — Students recall information through quizzes embedded in lessons
- **Interleaving** — Questions from previous topics mixed into current lessons
- **Tiered difficulty** — Foundation (recall), Core (application), Challenge (analysis/evaluation)
- **Specification alignment** — Lessons map to Pearson Edexcel spec references (e.g., "3C.1")
- Lessons are designed for classroom use on student devices (responsive design matters)
- The audience is secondary school students (ages 11-18) in Dubai
