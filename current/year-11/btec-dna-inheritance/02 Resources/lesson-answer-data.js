/* Lesson 2 · on-demand pupil review. All questions are original; marks are local classroom allocations, not Pearson mark schemes.
   Classroom practice only: not Pearson Set Assignment evidence. */
window.LessonAnswerData=(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);

  const cross={
    'Yy-Yy':A([m('Yy × Yy','Gametes Y or y from each parent. 1 YY : 2 Yy : 1 yy. Phenotypes 3 yellow : 1 green: 75% yellow, 25% green.')],[c('4 marks',['Gametes correct [1]','Four squares correct [1]','1 : 2 : 1 genotypes [1]','3 : 1 and 75% yellow [1]'])],4),
    'Yy-yy':A([m('Yy × yy','2 Yy : 2 yy, so 1 yellow : 1 green: 50% of each.')],[c('3 marks',['Squares correct [1]','1 Yy : 1 yy [1]','50% green [1]'])],3),
    'YY-yy':A([m('YY × yy','Every square is Yy: all heterozygous, 100% yellow.')],[c('2 marks',['All Yy [1]','100% yellow [1]'])],2),
    'Ff-Ff':A([m('Ff × Ff','1 FF : 2 Ff : 1 ff. 25% chance of cystic fibrosis; 50% chance of a carrier; 75% unaffected.')],[c('3 marks',['1 : 2 : 1 [1]','25% with CF [1]','50% carriers [1]'])],3)
  };

  const main={
    outcomes:S('What you will be able to do','Use the genetics key words, fill a Punnett square for a monohybrid cross, and give the result as a ratio, a percentage and a probability.',['Three outcomes read','Marked box ready']),
    'do-now':A([m('Answers','1 T. 2 A section of DNA that carries the instructions for a characteristic. 3 46, in 23 pairs.')],
      [c('3 marks',['T [1]','Section of DNA with instructions [1]','46 (23 pairs) [1]'])],3),
    feedback:A([m('The fresh question','A chromosome is one long molecule of DNA, tightly coiled.'),m('A good fix','One clear change, in a different colour, that answers the code your teacher wrote.')],
      [c('Success criteria',['Fix matches the code','Written in a different colour','Chromosome = one long DNA molecule'])]),
    alleles:A([m('Alleles','Body cells have two copies of each gene, one from each parent. Alleles are versions of a gene. Dominant shows with one copy; recessive needs two.')],
      [c('Success criteria',['Two copies, one from each parent','Allele = version of a gene','Dominant vs recessive correct'])]),
    genotypes:A([m('Completed table','YY: homozygous dominant, yellow. Yy: heterozygous, yellow. yy: homozygous recessive, green.')],
      [c('3 marks',['YY row [1]','Yy row [1]','yy row [1]'])],3),
    'punnett-model':Object.assign(cross['Yy-Yy'],{stateKey:'cross',variants:cross}),
    'carrier-hinge':A([m('B: 25%','Ff × Ff gives 1 FF : 2 Ff : 1 ff. Only ff has cystic fibrosis: 1 in 4, so 25%.')],
      [c('What each wrong answer shows',['0%: thinks carriers cannot pass it on','50%: treats it like Ff × ff, or counts carriers','75%: counted the unaffected children']),
       c('If you chose wrong',['Draw the 2 × 2 square','Count only the ff squares','Recheck: Ff × ff gives 50%'])]),
    practice:A([
        m('Crosses 1 and 2','1 Yy × yy: 1 Yy : 1 yy; 1 yellow : 1 green; 50% green. 2 YY × yy: all Yy; all yellow; 100% yellow.'),
        m('Cross 3','Ff × Ff: 1 FF : 2 Ff : 1 ff; 3 unaffected : 1 with CF; 25% with CF.')],
      [c('Cross 1 · 3 marks',['Square correct [1]','1 : 1 ratio [1]','50% green [1]']),
       c('Cross 2 · 2 marks',['All Yy [1]','100% yellow [1]']),
       c('Cross 3 · 3 marks',['1 : 2 : 1 [1]','3 : 1 [1]','25% with CF [1]'])],8),
    'chance-model':A([m('What you should see','Each batch of 20 is close to 15 yellow : 5 green but rarely exact. As the total grows, the ratio usually gets closer to 3 : 1.')],
      [c('Success criteria',['Results recorded each time','Compares with 15 : 5','Bigger samples closer to 3 : 1'])]),
    mystery:A([m('The yellow parent is Yy','YY × yy gives all Yy (all yellow). Yy × yy gives 2 Yy : 2 yy, so green appears. Green offspring mean the parent must be Yy.')],
      [c('3 marks',['Tests YY × yy: no green [1]','Tests Yy × yy: half green [1]','Concludes Yy [1]'])],3),
    exit:A([m('Answers','1 A different version of the same gene. 2 Yy. 3 50%.')],
      [c('3 marks',['Version of a gene [1]','Yy [1]','50% [1]'])],3)
  };
  return {main};
})();
