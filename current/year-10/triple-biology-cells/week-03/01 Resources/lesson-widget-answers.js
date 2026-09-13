/* Answers for the actual extension, adaptation, AI and local-context prompts. */
window.LessonWidgetAnswers=(()=>{
  const D=LessonAnswerData, S=D.simple;
  const hot={
    'Connect two structures':S('Protein production needs both','Ribosomes synthesise proteins. Aerobic respiration in mitochondria releases energy for cell activities, including making and processing proteins.',['Name each structure’s different role.','Connect both roles to protein production.']),
    'Challenge the claim':S('Respiration without mitochondria','Bacteria can release energy by respiration without mitochondria; relevant processes occur in their cytoplasm and cell membrane. Absence of one organelle does not prove absence of respiration.',['Reject the incorrect inference.','Explain that respiration can occur at other cellular sites.']),
    'What is missing?':D.l1['classify-model'],
    'Test a rule':D.l1.protoctists,
    'Use the exception':S('Yeast is still a fungus','A nucleus supports eukaryotic classification and a chitin wall supports fungus. Yeast can be identified as fungal without a mycelium; a hyphal network is not a universal requirement.',['Use chitin, not just unicellularity.','Recognise variation within the fungal group.']),
    'Explain the mechanism':S('Digestion and absorption differ','Enzymes break large molecules down outside the fungus. Small soluble products are then absorbed across cell membranes. This differs from taking a whole piece of food into the organism before digestion.',['Locate digestion outside the organism.','Separate enzymatic breakdown from absorption.']),
    'Compare specialisms':S('Different jobs need different features','A nerve cell’s long axon carries impulses over a distance. A palisade cell’s many chloroplasts absorb light for photosynthesis. Each feature suits a different task.',['Explain both feature–function links.','Compare the jobs, not just the shapes.']),
    'Think about genes':S('Same genes, different activity','Most nucleated body cells contain the same genes, but different genes can be active. This leads to different proteins being made, helping cells develop different structures and functions.',['Link gene activity to protein production.','Link different proteins to specialised structures or functions.','Do not claim normal differentiation requires each cell to acquire different genes.']),
    'Is the evidence enough?':S('Blood cells do not identify the source','Both embryonic stem cells and adult blood-forming stem cells can produce blood cells. That result alone cannot distinguish the sources. Evidence about a wider range of cell types and reliable source records would help.',['Recognise that both sources fit the observation.','Request evidence that could distinguish them.']),
    'Separate number and function':S('Which ability is supported?','An increasing population that remains unspecialised supports self-renewal if the cells retain stem-cell properties. It does not yet show differentiation into specialised cells.',['Identify stem-cell maintenance.','Explain the missing evidence for differentiation.']),
    'Evaluate the proposal':S('Division alone is insufficient','The cells must become the correct specialised type, survive and function in the damaged tissue, and grow under control. Rapid division alone establishes none of those outcomes.',['Give at least two further requirements.','Explain why cell number does not establish repair.']),
    'Weigh evidence':S('More cells are not proof of repair','An increased cell count does not demonstrate that cells perform the tissue’s job. Evidence of improved function and appropriate survival/integration is needed, alongside safety evidence.',['Distinguish cell count from tissue function.','Name relevant further evidence.']),
    'Separate laboratory and patient evidence':S('Contraction in a dish is limited evidence','Researchers need evidence that the cells survive after transplantation, connect and contract in coordination with the heart, improve pumping and remain safe without uncontrolled growth.',['Identify at least two limits of the laboratory result.','Link proposed evidence to function or safety in a patient.']),
    'Make the judgement conditional':S('New evidence can change a judgement','Poor survival would weaken the proposed benefit. Uncontrolled division would increase the risk of tumours. Either could justify delaying the proposal or investigating another source, even if the cells form the desired type.',['Use a specific new finding.','Explain its effect on benefit or risk.','Revise the judgement consistently.']),
    'At equal concentration':D.l2['net-movement'],
    'Test the model boundary':S('A changed membrane changes the model','If sucrose can also cross, its movement changes the concentrations on the two sides. The original prediction assumes sucrose stays on its side; permeability and the changing gradients would need to be considered.',['Identify the changed permeability assumption.','Explain that solute redistribution alters the gradients.']),
    'Compare cell types':S('The plant cell wall matters','A plant cell wall resists expansion as water enters, allowing turgor to develop. An animal cell lacks this supporting wall, so sufficient water entry can make it swell and burst.',['Compare the presence of the cell wall.','Connect the wall to resistance to expansion.']),
    'Explain an unchanged mass':D.l2['net-movement'],
    'Make a fair comparison':D.l2['practical-measure'],
    'Challenge the inference':S('Zero change does not mean no sucrose','A 0% mass change indicates no overall measured mass change under those conditions. It does not reveal the complete chemical contents. Water can still move both ways with no net movement.',['Do not infer absence of sucrose from a mass balance.','Distinguish no net change from no molecular movement.']),
    'Evaluate a method':S('Unequal time confounds the comparison','Time affects how much water can move. If exposure differs, the mass difference could be due to time as well as concentration. Keep time equal before attributing the difference to concentration.',['Identify the uncontrolled variable.','Explain why it provides an alternative cause.']),
    'Separate precision and validity':S('Repeats do not fix every error','Similar repeated readings show consistency, but surface liquid still contributes to mass. Repeating the same wet-weighing procedure does not remove this systematic problem. Blot consistently before weighing.',['Distinguish consistency from the intended tissue-mass measurement.','Identify the persistent surface-liquid contribution.','Suggest consistent blotting.'])
  };
  const adaptation={
    'Find the job':D.l1.structures,'Build your sentence':D.l1.structures,'Separate membrane and wall':D.l1['structure-recheck'],'Try again without the key':D.l1.structures,
    'Sort the evidence':D.l1['classify-model'],'Build a decision':D.l1['classify-model'],'One cell is not one group':D.l1['bacteria-yeast'],
    'Unpack the new words':D.l1.fungi,'Follow the food':D.l1.fungi,'Keep the location clear':D.l1.fungi,'Say it independently':D.l1.fungi,
    'Feature → function':D.palisade,'Use a sentence opening':D.palisade,'Two different changes':D.differentiation,'Fade the scaffold':D.palisade,
    'Start with the missing change':D.differentiation,'Connect to the organism':D.differentiation,'Explain importance, not only meaning':D.differentiation,'Try without the prompt':D.differentiation,
    'Two abilities':D.l1['stem-abilities'],'Compare the range':D.sources,'Restricted does not mean one':D.sources,'Remove the branch labels':D.l1['stem-abilities'],
    'Build a benefit chain':D.repair,'Build a risk chain':D.l1['repair-risk'],'Separate two kinds of concern':D.l1['repair-risk'],'Close and explain':D.answer([...D.repair.models,...D.l1['repair-risk'].models],[D.c('Benefit and biological risk',['Explain replacement cells restoring a tissue function.','Explain a biological risk and its consequence.'])]),
    'Label before explaining':D.osmosisCases,'Build a sentence':D.osmosisCases,'Name the moving substance':D.osmosis,'Close and recheck':D.l2['osmosis-hinge'],
    'Follow water first':D.potato,'Build the plant-cell chain':D.l2.turgor,'Wall and membrane differ':D.l2['plant-tissue'],'Recheck without the chain':D.potato,
    'Find the change first':D.l2['mass-practice'],'Choose the denominator':D.l2['mass-practice'],'Interpret the sign':D.l2['mass-practice'],'Try it unaided':D.l2['mass-practice'],
    'Separate the variables':D.controls,'Explain one control':D.controls,'Think about the balance':D.l2['practical-measure'],'Fade the list':D.answer([...D.controls.models,D.m('Why repeat?','Repeats reveal variation between samples and allow a mean to be calculated. They do not automatically remove a systematic error.')],D.controls.criteria)
  };
  function ai(p,l){
    if(l.number===1){
      if(p.topic==='structures')return S('Correct the swapped functions','The claim reverses the jobs. The cell membrane regulates exchange; ribosomes synthesise proteins. I checked each function against the labelled cell model.',['Identify the specific reversal.','State both correct functions.','Name the model/reference used to check.']);
      if(['groups','fungi'].includes(p.topic))return S('Use the decisive evidence','The claim wrongly treats one cell as proof of bacteria. A nucleus and chitin wall support a single-celled fungus such as yeast. I checked nuclear organisation and wall material, not just cell number.',['Reject the single-cell rule.','Use nucleus and chitin evidence.','Rewrite the classification with a reason.']);
      if(p.topic==='differentiation')return S('Differentiate the processes','Mitosis produces more cells. Differentiation develops specialised structures and functions, helping produce the cell types needed in tissues and organs. I checked the claim against the differentiation model.',['Identify the division/differentiation confusion.','Correct both meanings.','Explain how the model supports the correction.']);
      return S('Test the repair claim','Not every stem cell can form every cell type. Repair needs the appropriate specialised cells, survival, function and controlled growth. I checked source potential and tissue requirements before accepting the claim.',['Identify the overclaim about range or guaranteed repair.','Use a relevant source/function limitation.','Rewrite as a conditional, evidence-based explanation.']);
    }
    if(['mass','method'].includes(p.topic))return S('Use the initial mass','The denominator should be the initial mass. (2.20 − 2.50) ÷ 2.50 × 100 = −12%. I checked the formula and starting value; dividing by final mass would answer a different proportional question.',['Identify the denominator error.','Show the corrected calculation and negative sign.','Explain what was checked.']);
    return S('Water moves by osmosis','The claim names the wrong substance. In this model sucrose cannot cross. There is net water movement from 5% inside to 15% outside through the partially permeable membrane. I checked both concentrations and membrane permeability.',['Identify the water/solute error.','Give the correct net direction and membrane explanation.','Name the evidence used to check.']);
  }
  function uae(p,l,page){
    if(l.number===2){
      if(page===3)return S('Compare irrigation solutions fairly','Change the solution concentration and compare percentage mass changes in similar living tissue after equal times. Control tissue source, dimensions, solution volume and temperature; blot consistently and use repeats. These comparisons can test an osmosis prediction.',['Identify a relevant measure.','Control competing explanations.','Use repeats and consistent measurements.']);
      return S('Concentration matters for irrigation','If the outside solution is more concentrated than the root-cell sap, net water leaves the cells by osmosis. The cells can lose turgor despite being watered. More water volume alone does not guarantee that water enters the cells.',['Compare solution and cell-sap concentrations.','Explain net water movement through membranes.','Link water loss to reduced turgor.']);
    }
    if(page===1&&['groups','fungi','structures'].includes(p.topic))return D.l1['classify-model'];
    return S('Research aims need biological evidence','For heart repair, cells must become working heart-muscle cells and contribute to pumping. Evidence of survival, integration, function and controlled growth is needed. A national research aim alone does not establish that a proposed treatment is effective.',['Name a required specialised cell type and function.','Identify evidence of effectiveness and safety.','Separate a research ambition from a demonstrated result.']);
  }
  function get(widget,p,l,tab,page){
    if(widget==='hot')return hot[p.support.hot[page]?.[0]];
    if(widget==='adaptation'){
      const rows=tab===0?p.support.start:p.support.understand;
      if(['Build a decision','Sort the evidence','Remove the support'].includes(rows[page]?.[0]))return l.number===1?D.l1[p.id]:D.l2[p.id];
      return adaptation[rows[page]?.[0]]||(l.number===1?D.l1[p.id]:D.l2[p.id]);
    }
    if(widget==='ai')return ai(p,l);
    if(widget==='uae'&&page>0)return uae(p,l,page);
    return null;
  }
  return {get};
})();
