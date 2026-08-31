import { useState } from "react";

const subjects = [
  {
    name: "Biology",
    colour: "#16a34a",
    light: "#dcfce7",
    topics: [
      {
        name: "Life Processes",
        source: "NC KS3 + Oak National Academy (Cells & Organisation unit, Y7)",
        los: [
          "Recall the seven life processes: MRSGREN (Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition)",
          "Describe what each life process involves and give an example for animals and plants",
          "Explain the difference between living, dead, and never-alive objects using life processes as evidence",
          "Identify life processes occurring in unicellular organisms such as Amoeba and Euglena",
          "Explain why cells are described as the fundamental unit of living organisms",
          "Describe how multicellular organisms are hierarchically organised: cells → tissues → organs → organ systems → organism",
        ],
      },
      {
        name: "Cells",
        source: "NC KS3 Programme of Study + Oak National Academy (Cells unit, Y7)",
        los: [
          "Identify and describe the functions of: cell membrane, cytoplasm, nucleus, mitochondria, cell wall, vacuole and chloroplasts",
          "State the similarities and differences between animal and plant cells",
          "Explain why plant cells have features (cell wall, vacuole, chloroplasts) that animal cells do not",
          "Describe how to prepare and observe a cell specimen using a light microscope",
          "Explain the structural adaptations of specialised cells (e.g. red blood cell, root hair cell, sperm cell) and link structure to function",
          "Describe the role of diffusion in the movement of substances in and between cells",
          "Explain how cells are organised into tissues, tissues into organs, and organs into systems (e.g. digestive system)",
        ],
      },
      {
        name: "Food Chains and Plants",
        source: "NC KS3 Programme of Study + Oak National Academy (Ecosystems Y7 + Plant Nutrition Y9)",
        los: [
          "Identify producers and consumers and explain the difference between them",
          "Construct and interpret food chain diagrams, explaining what the arrows represent (transfer of biomass)",
          "Describe and explain predator–prey relationships and how population changes ripple through a food chain",
          "Interpret food web diagrams and predict the effects of removing or increasing one population",
          "Describe how toxic materials can accumulate along a food chain (bioaccumulation)",
          "Explain why plants are producers: they make their own food through photosynthesis",
          "State the reactants and products of photosynthesis and write a word summary (carbon dioxide + water → glucose + oxygen, using light energy)",
          "Describe the adaptations of leaves for photosynthesis (large surface area, thin, chlorophyll in chloroplasts, stomata for gas exchange)",
          "Explain the dependence of almost all life on Earth on photosynthetic organisms",
          "Explain why maintaining biodiversity matters, and describe how gene banks help preserve it",
        ],
      },
    ],
  },
  {
    name: "Physics",
    colour: "#2563eb",
    light: "#dbeafe",
    topics: [
      {
        name: "Energy",
        source: "NC KS3 + Oak National Academy (Forces unit – Energy, Y7 + Conservation of Energy, Y7)",
        los: [
          "Identify the five key energy stores introduced at Y7: kinetic, gravitational potential, elastic (elastic potential), chemical, and thermal",
          "Describe what property gives an object each type of energy store",
          "Identify when stores of energy change and describe the causes of energy transfer between stores",
          "State the law of conservation of energy: energy cannot be created or destroyed, only transferred",
          "Describe the mechanisms of energy transfer: mechanical work, electrical work, heating, and radiation",
          "Identify useful and wasted energy transfers in everyday devices",
          "Explain that wasted energy is mostly dissipated to the surroundings as thermal energy",
          "Interpret Sankey diagrams: explain what arrow thickness represents and identify useful vs wasted energy",
          "Draw Sankey diagrams to represent energy transfers in a device",
          "Calculate efficiency using: efficiency = useful energy output ÷ total energy input (× 100%)",
          "Compare the efficiency of different devices using data from Sankey diagrams or written information",
        ],
      },
      {
        name: "Motion",
        source: "NC KS3 + Oak National Academy (Forces Y7 / Moving by Force Y8)",
        los: [
          "Describe what forces are and explain the effects forces can have: change shape, speed, direction",
          "Identify and describe contact forces (friction, air resistance/drag, tension, normal contact force) and non-contact forces (gravity, magnetism, electrostatic)",
          "Use a newton meter to measure force accurately; recall that force is measured in newtons (N)",
          "Draw and label force arrows (force diagrams) showing magnitude and direction",
          "Describe what a resultant force is and explain the effect of balanced and unbalanced forces on motion",
          "Define speed and state the equation: speed = distance ÷ time (v = d/t)",
          "Calculate speed, distance, or time using v = d/t, including unit conversions (m/s, km/h)",
          "Interpret distance–time graphs: identify constant speed, stationary, and changing speed sections",
          "Explain how streamlining reduces drag force",
          "Describe and explain how a resultant force causes a change in speed (acceleration or deceleration)",
        ],
      },
      {
        name: "Waves",
        source: "NC KS3 + Oak National Academy (Sound, Light and Vision Y7)",
        los: [
          "Describe how sounds are caused by vibrations and explain what determines volume (amplitude) and pitch (frequency)",
          "Explain how vibrations are transferred through the air as a sound wave to allow sounds to be heard",
          "Explain why sounds are quieter at greater distances from the source",
          "Explain why sound travels faster in solids and liquids than in gases, and cannot travel through a vacuum",
          "Describe factors affecting how much sound a material reflects or absorbs, and explain how noise can be reduced",
          "Describe what happens when light travels in straight lines and explain how shadows form",
          "Use the law of reflection to describe and investigate reflection of light from mirrors (angle of incidence = angle of reflection)",
          "Explain how we see objects using our eyes (light from luminous sources, reflection from non-luminous objects)",
          "Describe the properties of mirror images (same size, same distance behind mirror, laterally inverted)",
          "Describe the electromagnetic spectrum and state that light is a form of electromagnetic radiation that travels as a wave",
        ],
      },
      {
        name: "Forces",
        source: "Oak National Academy Forces unit Y7 (10 lessons)",
        los: [
          "Describe what forces are and what they do: change shape, speed, or direction of objects",
          "Identify and name the different kinds of force and describe their effects",
          "Measure forces accurately using newton meters and record values in newtons (N)",
          "Draw and label force arrow diagrams to accurately represent forces acting on objects",
          "Distinguish between contact forces (e.g. friction, normal force, drag) and non-contact forces (e.g. gravity, magnetism)",
          "Explain the effect of gravity: weight = mass × gravitational field strength (W = mg)",
          "Identify balanced and unbalanced (resultant) forces and predict the resulting motion",
          "Describe and explain how friction acts and how it can be increased or decreased",
          "Explain the effect of upthrust and floating/sinking in liquids",
          "Identify different energy stores and explain how they change when forces do work on objects",
          "Describe causes of energy transfer between stores when forces act",
        ],
      },
    ],
  },
  {
    name: "Chemistry",
    colour: "#9333ea",
    light: "#f3e8ff",
    topics: [
      {
        name: "States of Matter",
        source: "NC KS3 + Oak National Academy (Solid, Liquid, Gas States and Changes of State Y7)",
        los: [
          "Describe the properties of substances in the solid, liquid, and gas states (shape, volume, compressibility, flow)",
          "Use the particle model to explain the properties of solids, liquids, and gases in terms of particle arrangement and movement",
          "Explain why substances have different melting and boiling points using the particle model",
          "Measure the melting point and freezing point of a substance using a thermometer",
          "Describe what happens to particles when a substance changes state (melting, freezing, evaporation/boiling, condensation, sublimation)",
          "Explain the relationship between temperature, energy, and changes of state",
          "Explain evaporation using the particle model and describe factors that affect the rate of evaporation (temperature, surface area, air movement)",
          "Light a Bunsen burner safely and control the temperature of the flame (roaring vs safety flame)",
          "Explain gas pressure in terms of particle collisions and predict the effect of changing temperature or volume on pressure",
        ],
      },
      {
        name: "Separating Techniques",
        source: "NC KS3 + Oak National Academy (Separation Techniques Y7)",
        los: [
          "Use knowledge of solubility and particle size to select an appropriate separation technique for a given mixture",
          "Describe how filtration separates an insoluble solid from a liquid, and draw the apparatus",
          "Explain how evaporation (crystallisation) is used to separate a soluble solid from a liquid",
          "Describe how to combine filtration and evaporation to obtain pure salt from rock salt",
          "Describe how a separating funnel is used to separate two immiscible liquids",
          "Explain how simple distillation separates a liquid from a solution, using differences in boiling point",
          "Compare simple and fractional distillation and explain when each is appropriate",
          "Describe how paper chromatography works: solvent carries substances at different rates based on solubility",
          "Interpret a chromatogram to identify substances and determine whether a substance is pure",
          "Suggest how to combine separation techniques to solve a multi-step separation problem",
        ],
      },
      {
        name: "Solutions",
        source: "NC KS3 + Oak National Academy (Solutions Y7 – 11 lessons)",
        los: [
          "Describe the difference between a pure substance and a mixture",
          "Identify and name common laboratory equipment used when working with mixtures, and draw scientific diagrams",
          "Use key terms accurately: solute, solvent, solution, soluble, insoluble, dissolving",
          "Describe how dissolving affects the total mass of a mixture (mass is conserved)",
          "Explain dissolving using the particle model: solute particles spread through solvent particles",
          "Explain diffusion using the particle model: particles move from high to low concentration",
          "Investigate and describe factors that affect the rate of dissolving (temperature, particle size, stirring)",
          "Define solubility and explain how temperature affects solubility using a solubility curve",
          "Explain how diffusion applies to the movement of substances in and between cells",
          "Distinguish between soluble and insoluble substances, and explain what concentration means",
          "Describe how the concentration of a solution can be changed (adding more solute or evaporating solvent)",
        ],
      },
    ],
  },
];

export default function App() {
  const [activeSubject, setActiveSubject] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [copyMsg, setCopyMsg] = useState("");

  const subject = subjects[activeSubject];
  const topic = subject.topics[activeTopic];

  const copyAll = () => {
    const lines = [`${subject.name} — ${topic.name}`, `Source: ${topic.source}`, ""];
    topic.los.forEach((lo, i) => lines.push(`${i + 1}. ${lo}`));
    navigator.clipboard.writeText(lines.join("\n"));
    setCopyMsg("Copied!");
    setTimeout(() => setCopyMsg(""), 2000);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f8fafc", color: "#1e293b" }}>
      {/* Header */}
      <div style={{ background: "#1e293b", color: "#f1f5f9", padding: "20px 28px 16px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 4 }}>KS3 Science · Y7</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Learning Outcomes Reference</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>NC Programme of Study + Oak National Academy · 9 topics across 3 subjects</div>
      </div>

      {/* Subject tabs */}
      <div style={{ display: "flex", gap: 0, background: "#e2e8f0", borderBottom: "1px solid #cbd5e1" }}>
        {subjects.map((s, i) => (
          <button
            key={s.name}
            onClick={() => { setActiveSubject(i); setActiveTopic(0); }}
            style={{
              flex: 1,
              padding: "12px 8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.02em",
              background: activeSubject === i ? s.colour : "transparent",
              color: activeSubject === i ? "#fff" : "#64748b",
              transition: "all 0.15s",
              borderBottom: activeSubject === i ? `3px solid ${s.colour}` : "3px solid transparent",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 130px)" }}>
        {/* Topic sidebar */}
        <div style={{ width: 200, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "12px 0", flexShrink: 0 }}>
          {subject.topics.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTopic(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: activeTopic === i ? 700 : 400,
                background: activeTopic === i ? subject.light : "transparent",
                color: activeTopic === i ? subject.colour : "#475569",
                borderLeft: activeTopic === i ? `3px solid ${subject.colour}` : "3px solid transparent",
                transition: "all 0.12s",
              }}
            >
              {t.name}
            </button>
          ))}

          {/* Count summary */}
          <div style={{ padding: "16px 16px 0", marginTop: 16, borderTop: "1px solid #e2e8f0" }}>
            {subject.topics.map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{t.name}</span>
                <span style={{ fontWeight: 700, color: subject.colour }}>{t.los.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {/* Topic header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{
                  background: subject.colour,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>{subject.name}</span>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{topic.name}</h2>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Source: {topic.source}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{topic.los.length} LOs</span>
              <button
                onClick={copyAll}
                style={{
                  padding: "6px 14px",
                  background: subject.colour,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {copyMsg || "Copy all"}
              </button>
            </div>
          </div>

          {/* LO list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topic.los.map((lo, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 14px",
                  background: "#fff",
                  border: `1px solid #e2e8f0`,
                  borderRadius: 8,
                  alignItems: "flex-start",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{
                  minWidth: 24,
                  height: 24,
                  background: subject.light,
                  color: subject.colour,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}>{i + 1}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: "#334155" }}>{lo}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
            <button
              onClick={() => {
                if (activeTopic > 0) setActiveTopic(t => t - 1);
                else if (activeSubject > 0) { setActiveSubject(s => s - 1); setActiveTopic(subjects[activeSubject - 1].topics.length - 1); }
              }}
              disabled={activeSubject === 0 && activeTopic === 0}
              style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#475569" }}
            >
              ← Previous topic
            </button>
            <span style={{ fontSize: 12, color: "#94a3b8", alignSelf: "center" }}>
              Topic {subjects.slice(0, activeSubject).reduce((a, s) => a + s.topics.length, 0) + activeTopic + 1} of {subjects.reduce((a, s) => a + s.topics.length, 0)}
            </span>
            <button
              onClick={() => {
                if (activeTopic < subject.topics.length - 1) setActiveTopic(t => t + 1);
                else if (activeSubject < subjects.length - 1) { setActiveSubject(s => s + 1); setActiveTopic(0); }
              }}
              disabled={activeSubject === subjects.length - 1 && activeTopic === subject.topics.length - 1}
              style={{ padding: "8px 16px", background: subject.colour, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
            >
              Next topic →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
