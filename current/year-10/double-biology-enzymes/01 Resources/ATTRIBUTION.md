# Digestive-enzyme graphs lesson assets

Created 18 October 2026 for Year 10 Double Science (Biology), Week 8, Lesson 1 (Monday 19 October 2026).

- Frame: local copy of Arcadia Lesson Frame 1.0.0, approved 13 September 2026. Canonical template assets are unchanged.
- Original interactive models (no downloaded meshes, textures or images; no network calls; nothing stored):
  - `enzyme-model.js` (`LessonModels.enzyme`): copied unchanged from the Year 10 Triple “Enzymes, temperature and pH” lesson (Week 5). Used here in its `bind` and `ph` modes. Shapes, speeds and rates are schematic.
  - `graph-reader-model.js` (`LessonModels.graphReader`): original 2D-canvas graph reader for the illustrative amylase rate–temperature graph. Pupils drag, tap or use the slider or arrow keys; a ruled line goes up to the curve and across, and the readout gives the value with its unit. It uses the same curve as the static diagrams. No Three.js is needed for a flat graph.
  - Each model has a local SVG fallback.
- Original SVG diagrams (`lesson-diagrams.js`): `readGraph`, `yourTurnGraph`, `explainFrame`, `lipaseGraph`, `toolkitGraph`, `toolkitCard`, `practiceTrypsin`, `practicePapain`, `practiceFish`, key-word pictures (`kwEnzyme`, `kwSubstrate`, `kwActiveSite`, `kwComplex`, `kwOptimum`, `kwDenatured`, `kwRate`), plus `enzymeFallback` and `phGraph` reused from the Week 5 Triple lesson. All are original programmatic diagrams. Every graph uses illustrative data, not experimental measurements, and says so. The same SVGs are rendered into `Graph toolkit.html`, `Lipase question frames.html` and `Enzyme graphs practice.html`.
- Three.js 0.160.1: https://github.com/mrdoob/three.js/tree/r160 · MIT. Full licence in `THREE-LICENSE.txt`.
- Fonts: optional Google Fonts links inherited from the approved frame, with local fallbacks. The resource pages use system fonts only.
- Curriculum: Pearson Edexcel International GCSE Science (Double Award), Biology content numbered as 4XBI1: 2.11 and 2.13, with 2.10 and 2.29 retrieved.
- All exam-style questions are original and labelled “Original exam-style question”. The mark schemes are classroom mark schemes written for these questions, not Pearson mark schemes.
- Prepared AI-style claims are authored classroom checking tasks, not transcripts or live model outputs. No pupil responses are transmitted or stored.
- UAE context: Dubai Municipality, *Food Code* (2013 English edition), page 34, the temperature danger zone (5 °C to 60 °C) and keeping high-risk food at or below 5 °C or at or above 60 °C. The official PDF loaded and its text was checked on 18 October 2026. The car, fridge and social-media scenarios are hypothetical.
- Key-fact wording is aligned with the class's published Week 8 home-learning page. No home-learning questions or contexts are reused.
- No pupil data are stored or transmitted by the lesson or its resource pages. All data are synthetic or illustrative.
- No textbook scans, publisher illustrations or third-party photographs are reproduced.

## Source links

https://dmpmedia.dm.gov.ae/uploads/2024/10/Food-Code-2013-English.pdf

https://github.com/mrdoob/three.js/tree/r160
