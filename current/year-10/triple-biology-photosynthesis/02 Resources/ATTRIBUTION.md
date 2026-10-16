# Limiting factors of photosynthesis lesson assets

Created 16 October 2026 for Year 10 Triple Biology, Week 8, Lesson 2 (Wednesday 21 October 2026).

- Frame: local copy of Arcadia Lesson Frame 1.0.0, approved 13 September 2026. Canonical template assets are unchanged.
- Original Three.js model, built from original geometry (no downloaded meshes, textures or images; no network calls; nothing stored):
  - `pondweed-model.js` (`LessonModels.pondweed`): a simulated pondweed investigation with an LED lamp, a water bath with a thermometer, a boiling tube of pondweed in sodium hydrogencarbonate solution and a gas syringe. Pupils choose light intensity, CO₂ concentration or temperature, commit a prediction (Run stays locked until they do), then run 5-minute collections in 5 seconds of real time. It shows measurements only: no means, graphs or conclusions.
  - All volumes come from the lesson's deterministic simulated dataset: a smooth minimum of a light limit and a CO₂ × temperature limit, ±4 % deterministic repeat variation and one planned anomaly. They are simulated data, not real measurements.
  - Drag or arrow-key rotation only; no autoplay. Without WebGL, an SVG view, the readout and every control still work.
- `Pondweed lab.html` and `pondweed-lab-host.js`: a standalone, device-friendly page that hosts the model with the same contract as the lesson runtime. It shows a raw results table and never totals, averages or plots results.
- Original SVG diagrams (`lesson-diagrams.js`): `predictAxes`, `pondweedSetup`, `pondweedFallback`, `limitingGraph`, `tempCurve`, `graphModel`, `greenhouseGraph`, `cormmss`. They are original programmatic educational diagrams. Shapes and sizes are schematic; graph values are the simulated means or illustrative data and are labelled as such. The same SVGs are copied into `Limiting factors reading.html`, `Exam-style questions.html` and `Pondweed results sheet.html`.
- Simulation design: our own build. The general predict-then-test approach is common good practice in science simulations; no PhET code, artwork, text or data are used or adapted.
- Three.js 0.160.1: https://github.com/mrdoob/three.js/tree/r160 · MIT. Pinned browser build obtained from https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js . Full licence in THREE-LICENSE.txt.
- Fonts: optional Google Fonts links inherited from the approved frame; local Georgia/system fallbacks are provided. The pupil resource pages and the lab use system fonts only.
- Curriculum: Pearson Edexcel International GCSE Biology (Modular) 4XBI1, Issue 2, September 2024. Specification points 2.20 and the oxygen-evolution part of 2.23, as shown beside the outcomes.
- All exam-style questions are original and labelled “Original exam-style question”. Mark schemes are classroom mark schemes written for these questions, not Pearson mark schemes.
- Prepared AI-style claims are authored classroom checking tasks, not transcripts or live model outputs. No pupil responses are transmitted or stored.
- UAE context: National Food Security Strategy 2051 on the official UAE Government portal, checked 16 October 2026 (the page loads and states the aims to lead the Global Food Security Index by 2051 and to enhance local production using modern technologies). The greenhouse, vertical-farm and advert tasks are expressly hypothetical; the greenhouse graph is illustrative data.
- No pupil data are stored or transmitted by the lesson, the lab or the resource pages. All data are synthetic, simulated or illustrative.
- No textbook scans, publisher illustrations or third-party photographs are reproduced.

## Source links

Specification: Pearson Edexcel International GCSE in Biology (Modular) (4XBI1), Specification – Issue 2 – September 2024, © Pearson Education Limited 2024 (local copy; section 2(e) Nutrition, flowering plants).

https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051

https://github.com/mrdoob/three.js/tree/r160
