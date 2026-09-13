/* Fully authored biology content for the six Arcadia widgets. */
window.LessonWidgets=(()=>{
  const pages=pairs=>pairs.map(([heading,text])=>({heading,text}));
  const genome='https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/health/national-genome-strategy';
  const water='https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/the-uae-water-security-strategy-2036';
  function ai(current,lesson){
    const structures=lesson.number===1&&current.topic==='structures';
    const classification=lesson.number===1&&['groups','fungi'].includes(current.topic);
    const differentiation=lesson.number===1&&current.topic==='differentiation';
    const mass=lesson.number===2&&['mass','method'].includes(current.topic);
    const prompt=structures?'Explain the different jobs of the cell membrane and ribosomes.':classification?'A specimen is one cell with a nucleus and a chitin wall. Classify it using evidence.':differentiation?'Explain the difference between cell division and differentiation.':lesson.number===1?'Explain what must happen for stem-cell-derived cells to help repair a tissue.':mass?'A cylinder changes from 2.50 g to 2.20 g. Set up the percentage-change calculation.':'A model cell contains 5% sucrose, with 15% outside. Water can cross the membrane; sucrose cannot. Predict the net water direction.';
    const claim=structures?'The cell membrane makes proteins, while ribosomes control what enters the cell.':classification?'It is a bacterium because it has only one cell.':differentiation?'Differentiation just means a cell divides into two identical cells.':lesson.number===1?'Any stem cell can repair any tissue, as long as enough cells are added.':mass?'Divide the change in mass by the final mass to find the percentage change.':'Sucrose moves into the cell by osmosis to make the concentrations equal.';
    return [{id:'verify',label:'Check a claim',pages:[
      {heading:'Think first',text:prompt,note:'Write your own explanation first'},
      {heading:'Inspect the claim',quote:'“'+claim+'”',note:'Prepared AI-style claim',text:'This statement was written for this checking task. Confident wording is not evidence.'},
      {heading:'Check against the science',items:['Identify a specific error or missing condition.','Use the lesson’s model or reference as evidence.','Rewrite the explanation in your own words.']},
      {heading:'Explain your check',text:'What did you verify before accepting or rejecting the claim? Name the evidence you used.',note:'No live AI tool or personal information is needed'}
    ]}];
  }
  function uae(current,lesson){
    if(lesson.number===2)return [{id:'connect',label:'Water and growing',pages:[
      {heading:'Water security in the UAE',text:'The UAE Water Security Strategy 2036 aims to support sustainable access to water, including through water-demand management.',source:water,sourceLabel:'UAE Government · Water Security Strategy 2036'},
      {heading:'Apply osmosis to irrigation',note:'Hypothetical classroom scenario',text:'A UAE grower waters seedlings with a solution more concentrated than the root-cell sap. Predict the net water direction across the cell membranes.'},
      {heading:'Evaluate a proposal',text:'“More watering will always make the seedlings more turgid.” Explain why the concentration of the water also matters.'},
      {heading:'Ask for useful evidence',text:'What measurements and controls would help compare two irrigation solutions? Use what you know about the potato investigation.'}
    ]}];
    const groups=['groups','fungi','structures'].includes(current.topic);
    return [{id:'connect',label:'Cells and health',pages:[
      {heading:'Genomics and health in the UAE',text:'The UAE National Genome Strategy includes developing personalised, preventive and precision medicine.',source:genome,sourceLabel:'UAE Government · National Genome Strategy'},
      {heading:groups?'Identify the cells first':'Apply the cell biology',note:'Hypothetical classroom scenario',text:groups?'A UAE research team receives a sample described as “one cell with a nucleus”. Explain why that is not enough to identify its organism group.':'A UAE research team proposes producing specialised cells to replace damaged tissue. What cell type and function would the team need to establish?'},
      {heading:'Keep the evidence separate',text:'A national research ambition does not prove that a particular treatment works. Explain what biological evidence a claim about tissue repair would need.'}
    ]}];
  }
  function panel(id,current,lesson){
    const s=current.support;
    const definitions={
      resources:{title:'Resources',subtitle:'Use a reference, then return to the task.',tabs:[{id:'kit',label:'Resources',pages:lesson.resourcePages},{id:'words',label:'Key words',pages:pages(lesson.vocabulary)},{id:'models',label:'Models',pages:lesson.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Choose a check and show your reasoning.',tabs:[{id:'checks',label:'Checks',pages:lesson.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Use the support, then try without it.',tabs:[{id:'start',label:'Get started',pages:pages(s.start)},{id:'understand',label:'Build understanding',pages:pages(s.understand)}]},
      hot:{title:'Higher-order thinking',subtitle:'Explain a limit, test a claim or transfer an idea.',tabs:[{id:'reason',label:'Go further',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'Think first. Check the claim against evidence.',tabs:ai(current,lesson)},
      uae:{title:'UAE National Agenda',subtitle:'Use the science in a local context.',tabs:uae(current,lesson)}
    };
    return definitions[id];
  }
  return {panel};
})();
