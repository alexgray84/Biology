# /lesson - Interactive Web Lesson Generator

Generate an interactive HTML lesson using evidence-informed pedagogy. Uses a multi-agent team to analyse curriculum documents, design pedagogy, build content, create visuals, and assemble a self-contained HTML file.

## Arguments
- $ARGUMENTS: Topic and source, e.g. `"Cell Division" from ial/unit-2` or `"Photosynthesis" from T&L/spec.pdf`

## Instructions

Parse the arguments to extract:
- **TOPIC**: The lesson topic (in quotes)
- **SOURCE**: The document or folder path (after "from" or "using")

Then execute the following phases using the agent team architecture.

---

## PHASE 1: CURRICULUM ANALYSIS

Read the source documents to extract curriculum information.

1. **Locate source documents** at the specified path (relative to the project root `/Users/alexgray/Documents/Biology/`)
2. **Read all relevant files** (.html existing lessons for style reference, .docx, .pdf, .md, .txt)
3. **Extract and document**:
   - Specification reference (unit, topic number, spec points)
   - Learning objectives (exactly as written in spec)
   - Key terminology with definitions
   - Assessment objectives (AO1/AO2/AO3 weighting)
   - Prior knowledge links
   - Common misconceptions
   - Command words required

**IMPORTANT**: Read existing lessons in the same folder to match the established visual style and theme (dark theme with CSS variables, Playfair Display headings, Source Sans Pro body, animated backgrounds, glassmorphism cards).

Present the extracted curriculum analysis and confirm before proceeding.

---

## PHASE 2: PARALLEL DESIGN (3 Agents)

Launch three agents in parallel:

### Agent 1 - PEDAGOGY DESIGNER
Design the lesson structure following evidence-informed principles from `~/.claude/skills/lesson-gen/PEDAGOGY.md`:

- **Hook** (activate prior knowledge)
- **Diagnostic quiz** (3-5 MCQs testing prior knowledge)
- **Learning objectives** (clickable checkboxes)
- **Content sections** (one per major concept, each with dual coding)
- **Retrieval practice** (interleaved throughout - flashcards, fill-in-blank)
- **Application activities** (drag-and-drop, sequencing, scenarios)
- **Exam practice** (2-mark, 4-mark, and 6-mark questions with mark schemes)
- **Final assessment** (mirrors diagnostic to show progress)
- **Metacognition** (confidence rating, reflection)

### Agent 2 - CONTENT BUILDER
Write accurate, engaging scientific content:

- Clear explanations using precise terminology
- Key terms highlighted with `<span class="key-term">`
- Concrete examples and real-world applications
- Comparison tables where relevant
- Common misconceptions addressed
- Exam questions with detailed mark schemes
- Glossary of all key terms

### Agent 3 - VISUAL DESIGNER
Create interactive SVG diagrams:

- Inline SVG (no external files)
- Clickable elements with info popups or reveals
- Colour-coded by function (consistent scheme)
- Maternal/paternal chromosome colours (red/blue) where relevant
- Cell membranes, organelles, processes visualised
- Labels that can be shown/hidden
- Mobile-friendly sizing

---

## PHASE 3: HTML ASSEMBLY

Build a **single self-contained HTML file** combining all outputs.

### Match the existing lesson style:
- Read an existing lesson from the same folder for exact CSS variables and design patterns
- **Dark theme** (`--bg-dark: #0d1b2a`, `--bg-medium: #1b263b`, etc.)
- **Fonts**: Playfair Display (headings), Source Sans Pro (body), JetBrains Mono (code/notation)
- **Glass cards** with `backdrop-filter: blur(10px)` and subtle borders
- **Animated background** (DNA helix, gradient orbs, or topic-relevant)
- **Gradient section numbers** and accent colours
- **Sticky navigation progress bar** with clickable section links
- **Smooth animations** (fadeInUp on scroll, hover transforms)

### Required sections in the HTML:
1. `<header class="hero">` - Topic title, spec reference badge, subtitle
2. `<nav class="nav-progress">` - Sticky section navigation
3. Learning objectives card with checkboxes
4. Diagnostic quiz (MCQ with immediate feedback)
5. Content sections (numbered, with content cards)
6. Interactive SVG diagrams (inline, clickable)
7. Retrieval practice (flashcards with click-to-reveal)
8. Fill-in-the-blank with word bank
9. Drag-and-drop or sequencing activity
10. Exam practice (2, 4, 6 mark questions with model answers behind toggle buttons)
11. Progress check questions with mark schemes
12. Final assessment quiz
13. Confidence check (emoji buttons)
14. Vocabulary grid
15. `<footer>` with attribution

### JavaScript requirements:
- Quiz checking with correct/incorrect styling
- Answer toggle (reveal/hide model answers)
- Flashcard flip (click to reveal)
- Drag and drop with validation
- Fill-in-blank checking against word bank
- Progress tracking
- Section scroll navigation
- Learning objective checkbox toggle
- Confidence selection

### Output location:
Save the HTML file to the **same folder as other lessons in that unit/section**. Use kebab-case filename matching the topic.

Examples:
- `ial/unit-2/photosynthesis.html`
- `IGCSE/enzymes.html`
- `KS3/Biology/cell-division.html`

---

## PHASE 4: VALIDATION

Check the generated lesson against:

| Check | Required |
|-------|----------|
| All learning objectives covered | Yes |
| Diagnostic quiz (3-5 questions) | Yes |
| Interactive SVG diagram (at least 1) | Yes |
| Retrieval practice (flashcards or fill-in-blank) | Yes |
| Drag-and-drop or sequencing | Yes |
| 2-mark exam question with model answer | Yes |
| 6-mark exam question with planning checklist | Yes |
| Final assessment | Yes |
| Confidence check | Yes |
| Vocabulary grid | Yes |
| Mobile responsive (@media queries) | Yes |
| Single self-contained HTML | Yes |
| Matches existing lesson visual style | Yes |
| Scientific accuracy | Yes |

Fix any issues before presenting the final output.

---

## RULES

1. Always read T&L/source documents first
2. Extract learning objectives exactly as written in the spec
3. Align ALL content to the specification
4. Minimum 5 interactive elements per lesson
5. Include BOTH diagnostic AND final assessment
6. Include 2-mark AND 6-mark exam questions
7. Apply evidence-informed pedagogy throughout (retrieval, dual coding, scaffolding)
8. Make SVG diagrams fully interactive (clickable, colour-coded)
9. Validate before presenting to user
10. Output as a SINGLE self-contained HTML file (no external dependencies except Google Fonts)
11. Match the dark theme and visual style of existing lessons in the repository
12. Use British English spelling throughout
