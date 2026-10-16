# Photosynthesis and its equations: lesson assets

Created 16 October 2026 for Year 10 Triple Biology, Week 8, Lesson 1 (taught Tuesday 20 October 2026).

- Frame: local copy of Arcadia Lesson Frame 1.0.0, approved 13 September 2026, with the Edu OS lesson engine (`lesson-runtime.js`, `lesson-frame-widgets.js`, `lesson-answers.js`, `lesson-widget-answers.js`, `lesson-extensions.css`). Canonical template assets are unchanged.
- Three.js model (original geometry, not photographs or scans; positions, sizes and colours are schematic; drag, touch or arrow-key rotation; no sound; local SVG fallback if WebGL is unavailable):
  - `atom-model.js` (`atoms`): a ball-and-stick model of 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. Every atom keeps its identity, so the counts stay at carbon 6, hydrogen 12 and oxygen 18 on both sides. Glucose is drawn in its ring form with exactly 24 atoms. The model tracks atom numbers only; it does not show the real reaction pathway (in reality the oxygen released comes from water). Light energy is shown as a gold glow and falling photons, and the chloroplast as a green tint.
- SVG diagrams in `lesson-diagrams.js` are original programmatic educational diagrams: `willow`, `atomsFallback`, `balance`, `chloroplastFlow` and `examModel`. Locked series colours: light #d8b23a, CO₂ #6b7280, O₂ #24748d, water #3d7cc9, glucose/starch #bd8126, chloroplast/chlorophyll #56834b. The pupil resource pages reuse copies of these diagrams.
- Van Helmont’s willow figures (about 74 kg gained, about 0.06 kg of dry soil lost, 5 years, published 1648) are labelled “historical data, rounded”. They are widely reported historical values; the original publication is not reproduced.
- Three.js 0.160.1: https://github.com/mrdoob/three.js/tree/r160 · MIT. Pinned browser build obtained from https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js . The full licence is in THREE-LICENSE.txt.
- Fonts: optional Google Fonts links inherited from the approved frame; local Georgia/system fallbacks are provided. The resource pages use system fonts only.
- Curriculum: Pearson Edexcel International GCSE Biology (Modular) 4XBI1, Issue 2, September 2024. Specification points 2.18 and 2.19, as shown beside the outcomes. All questions are original, and their marks are classroom allocations, not Pearson mark schemes.
- AP1 feedback: the screen is a generic, teacher-run routine. No AP1 questions, marks, mark scheme or class results are reproduced or invented.
- UAE context: the Government of Dubai Media Office article “Dubai Environment and Climate Change Authority Launches Mangrove Planting Initiative in Dubai’s Sanctuaries” (25 November 2025), checked 16 October 2026; it states that the initiative “supports the UAE’s national target to plant 100 million mangrove trees by 2030”. The sentence on Abu Dhabi’s Climate Change Strategy (expanding mangrove areas using traditional methods and drones) is from the official UAE Government portal page listed below, also checked 16 October 2026. The “day and night” task is a hypothetical classroom scenario.
- Prepared AI-style claims are authored classroom checking tasks, not transcripts or live model outputs.
- No pupil data is stored or transmitted. The pages make no network calls and keep no pupil responses.
- No textbook scans, publisher illustrations or third-party photographs are reproduced. No PhET or other third-party simulation code is used.

## Source links

https://mediaoffice.ae/en/news/2025/november/25-11/dubai-environment-and-climate-change-authority

Specification: Pearson Edexcel International GCSE in Biology (Modular) 4XBI1, Issue 2, September 2024. Checked against the department’s local copy; see qualifications.pearson.com.

https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/abu-dhabi-climate-change-strategy
