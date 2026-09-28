# Enzymes, temperature and pH lesson assets

Created 28 September 2026 for Year 10 Triple Biology, Week 5, Lesson 2 (Wednesday 30 September 2026).

- Frame: local copy of Arcadia Lesson Frame 1.0.0, approved 13 September 2026. Canonical template assets are unchanged.
- Original Three.js models, built from original geometry (no downloaded meshes, textures or images; no network calls; nothing stored):
  - `enzyme-model.js` (`LessonModels.enzyme`): lock-and-key enzyme with a gold-rimmed active site. Modes: binding stages, specificity (complementary and different substrate), temperature (permanent deformation above the optimum until reset) and pH (amylase, pepsin and trypsin optima). Shapes, speeds and rates are schematic.
  - `spot-tile-model.js` (`LessonModels.spotTile`): virtual iodine spotting-tile investigation for Core Practical 2. End-point times are the lesson’s illustrative dataset, not real measurements.
  - Drag or arrow-key rotation only; no autoplay. Each model has a local SVG fallback if WebGL is unavailable.
- Original SVG diagrams (`lesson-diagrams.js`): `catalyst`, `enzymeFallback`, `specificity`, `digestion`, `tempGraph`, `phGraph`, `cpSetup`, `spotTileFallback`, `cormmss`, `resultsGraph`. They are original programmatic educational diagrams. Shapes, sizes and colours are schematic; graph data are illustrative, not experimental measurements. The same SVGs are copied into `Enzymes reading.html`, `Exam-style questions.html` and `Enzyme investigation planner.html`.
- Three.js 0.160.1: https://github.com/mrdoob/three.js/tree/r160 · MIT. Pinned browser build obtained from https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js . Full licence in THREE-LICENSE.txt.
- Fonts: optional Google Fonts links inherited from the approved frame; local Georgia/system fallbacks are provided. The pupil resource pages use system fonts only.
- Curriculum: Pearson Edexcel International GCSE Biology (Modular) 4XBI1, Issue 2, September 2024. Specification points 2.10, 2.11, 2.12, 2.13 and 2.14B, with 2.29 (digestive enzymes, substrates and products) introduced. Selected components only, as shown beside the outcomes.
- Core practical method: the Hodder/Pearson International GCSE Biology core practical lab book (Core Practical 2) was used only as a method reference. No text, tables, questions, answers, photographs or illustrations from it are reproduced. The method wording, questions and mark schemes are original.
- All exam-style questions are original and labelled “Original exam-style question”. Mark schemes are classroom mark schemes written for these questions, not Pearson mark schemes.
- Prepared AI-style claims are authored classroom checking tasks, not transcripts or live model outputs. No pupil responses are transmitted or stored.
- UAE context: National Food Security Strategy 2051 on the official UAE Government portal, checked 27 September 2026. The milk, blanching and freezer-advert scenarios are expressly hypothetical.
- No pupil data are stored or transmitted by the lesson or its resource pages. All data are synthetic or illustrative.
- No textbook scans, publisher illustrations or third-party photographs are reproduced.

## Source links

Specification: Pearson Edexcel International GCSE in Biology (Modular) (4XBI1), Specification – Issue 2 – September 2024, © Pearson Education Limited 2024 (local PDF copy; section 2(c) Biological molecules).

https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051

https://github.com/mrdoob/three.js/tree/r160
