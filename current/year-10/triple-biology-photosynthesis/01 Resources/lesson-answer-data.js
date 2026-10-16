/* Lesson 1 · on-demand pupil review. All questions are original; marks are local classroom allocations, not Pearson mark schemes.
   The AP1 screen has success criteria only. */
window.LessonAnswerData=(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});

  /* Atom model: one review per stage on show. */
  const stage={
    reactants:A([m('Reactant side','6 CO₂ + 6 H₂O. Carbon: 6 × 1 = 6. Hydrogen: 6 × 2 = 12. Oxygen: 6 × 2 + 6 × 1 = 18.')],[c('3 marks',['C = 6 [1]','H = 12 [1]','O = 18 [1]'])],3),
    light:A([m('Light stage','Chlorophyll absorbs light energy. Bonds break and atoms rearrange. Light supplies energy only: the atom counts do not change.')],[c('Success criteria',['Chlorophyll absorbs light','Light gives energy, not atoms','Counts unchanged'])]),
    products:A([m('Product side','C₆H₁₂O₆ + 6 O₂. Carbon 6; hydrogen 12; oxygen 6 + 12 = 18. Every count matches the reactants. Chemical energy is stored in glucose.')],[c('3 marks',['C 6 = 6 [1]','H 12 = 12 [1]','O 18 = 18 [1]'])],3)
  };

  const main={
    outcomes:A([m('What success looks like','You can explain photosynthesis as an energy transfer, write both equations, and use them to explain van Helmont’s willow and a destarched leaf.')],[c('Check at the exit',['Energy, not atoms, from light','Balanced symbol equation','Carbon from CO₂ ends in glucose'])]),

    'do-now':A([
      m('1 and 2','1. Chloroplasts absorb light and are where photosynthesis happens. 2. Diffusion is the net movement of particles from a higher to a lower concentration.'),
      m('3 and 4','3. An enzyme increases the rate of a reaction (a biological catalyst). 4. C: air, as CO₂, for most of the dry mass. B is partly right for fresh mass. We test this today.')
    ],[c('4 marks',['1. Photosynthesis / absorb light [1]','2. Net movement of particles [1]','2. Higher to lower concentration [1]','3. Increases (speeds up) the rate [1]']),c('Question 4',['Diagnostic only: no mark','C, as CO₂, for most dry mass','B partly right: water for fresh mass'])],4),

    'ap1-feedback':A([
      m('A strong fix','The rewritten sentence answers the command word, uses the key term from the model answer, and would now earn the mark you lost.')
    ],[c('Success criteria',['Question with most marks lost found','Weakest sentence rewritten in green','Key word added and underlined','Fix matches the command word'])]),

    willow:A([
      m('Not the soil','The soil lost only about 0.06 kg, but the tree gained about 74 kg, so almost none of the mass came from the soil.'),
      m('From the air','Most of the dry mass came from carbon dioxide from the air: its carbon was built into glucose, then starch and cellulose. Water also contributes.')
    ],[c('3 marks',['Soil lost only 0.06 kg [1]','Mass from carbon dioxide [1]','Built into glucose / cellulose [1]']),c('Also note',['Water adds mass too','Do not accept: “only from CO₂”','Do not accept: from sunlight'])],3),

    'equation-model':{stateKey:'stage',variants:stage,...A([
      m('Every atom counted','6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Carbon 6 → 6, hydrogen 12 → 12, oxygen 18 → 18. Light supplies energy, not atoms.')
    ],[c('Success criteria',['A count for C, H and O','Both sides equal','Light gives energy only'])])},

    balance:A([
      m('The equations','carbon dioxide + water → glucose + oxygen (light above the arrow, chlorophyll below). 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.'),
      m('Your turn','For 2 glucose: 12 CO₂ and 12 H₂O are used, and 12 O₂ are released. 12CO₂ + 12H₂O → 2C₆H₁₂O₆ + 12O₂.')
    ],[c('3 marks · your turn',['12 CO₂ [1]','12 H₂O [1]','12 O₂ [1]']),c('Do not accept',['Light as a reactant','Changed formulae, e.g. H₂O₆','CO2 with no subscript'])],3),

    chloroplast:A([
      m('The diagram','Five arrows: light energy, CO₂ (by diffusion) and water in; glucose and O₂ out. Chlorophyll absorbs the light.'),
      m('Why it matters','Light energy becomes chemical energy in glucose, which starts food chains. O₂ is released and CO₂ is removed from the air.')
    ],[c('Success criteria',['Three inputs, two outputs','Light → chemical energy','Food chains and oxygen'])]),

    'glucose-uses':A([
      m('Six uses','Respiration releases energy. Starch is an insoluble store. Sucrose is transported. Cellulose builds cell walls. Amino acids and proteins need nitrate. Oils are stored in seeds.')
    ],[c('Success criteria',['Six rows copied','A reason for each use','Nitrate for amino acids'])]),

    'photo-hinge':A([m('B is correct','Light energy is transferred to chemical energy stored in glucose. Every atom in glucose comes from carbon dioxide and water.')],[
      c('What wrong answers reveal',['A: light is energy, not atoms','C: soil lost only 0.06 kg','D: chlorophyll is not used up']),
      c('Reteach moves',['A: recount atoms in the model','C: revisit van Helmont’s willow','D: chlorophyll goes by the arrow'])
    ]),

    'exam-model':A([
      m('Model answer','In the light, the seedling photosynthesises and takes in CO₂. Light energy is used to make glucose from CO₂ and water. Glucose becomes starch and cellulose in new cells, so dry mass increases.')
    ],[c('3 marks',['Photosynthesis / takes in CO₂ [1]','Glucose made using light energy [1]','Glucose → starch / cellulose / new cells [1]']),c('Do not accept',['Food from the soil','Glucose made from light','“Makes energy”'])],3),

    'exam-independent':A([
      m('(a) and (b)','(a) carbon dioxide + water → glucose + oxygen, with light and chlorophyll by the arrow. (b) 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.'),
      m('(c)','The iodine stays orange-brown: no starch. In the dark there is no photosynthesis, so no new glucose. The stored starch was broken down to glucose and used in respiration, or moved to other parts of the plant.')
    ],[
      c('(a) and (b) · 4 marks',['(a) carbon dioxide + water [1]','(a) → glucose + oxygen [1]','(b) correct formulae [1]','(b) balanced: 6, 6, 6 [1]']),
      c('(c) · 3 marks',['Stays orange-brown / no starch [1]','No light, no photosynthesis or glucose [1]','Starch broken down to glucose/sugar and used in respiration, or moved to other parts of the plant [1]']),
      c('Do not accept',['(a) Light written as a reactant: maximum 1','CO2 or H2O without subscripts','“Chlorophyll is used up”'])
    ],7),

    exit:A([
      m('1','The carbon atoms end up in glucose. The glucose can then become starch, cellulose or other molecules in the plant.'),
      m('2 and 3','2. Energy. Every atom comes from carbon dioxide and water. 3. Making amino acids, and so proteins.')
    ],[c('4 marks',['1. In glucose [1]','1. Then starch / cellulose / biomass [1]','2. Energy [1]','3. Amino acids or proteins [1]'])],4)
  };
  return {main};
})();
