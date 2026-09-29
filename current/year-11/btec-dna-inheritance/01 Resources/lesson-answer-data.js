/* Lesson 1 · on-demand pupil review. All questions are original; marks are local classroom allocations, not Pearson mark schemes.
   Classroom practice only: not Pearson Set Assignment evidence. */
window.LessonAnswerData=(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);

  const zoomLevel={
    0:S('Cell','DNA is inside the nucleus of the cell.',['Names the nucleus','DNA is inside it']),
    1:S('Nucleus','The nucleus holds the chromosomes: 46 in a human body cell, in 23 pairs.',['46 chromosomes','23 pairs']),
    2:S('Chromosome','A chromosome is one very long DNA molecule, tightly coiled.',['One DNA molecule','Coiled']),
    3:S('DNA','Two strands twisted into a double helix, joined by base pairs.',['Two strands','Double helix','Base pairs'])
  };

  const main={
    outcomes:S('What you will be able to do','Describe where DNA is, how chromosomes, DNA and genes are related, the double helix with its base pairs, and what a mutation is.',['Three outcomes read','Kit ready']),
    'do-now':A([m('Answers','1 The nucleus controls the cell and contains the genetic material. 2 The red blood cell. 3 Its structure is adapted to carry out a particular job.')],
      [c('3 marks',['Controls the cell or holds genetic material [1]','Red blood cell [1]','Structure adapted to a job [1]'])],3),
    'zoom-model':Object.assign(S('Cell to DNA','Cell → nucleus → chromosomes (46, in 23 pairs) → DNA: a double helix joined by base pairs.',['Four levels in order','46 chromosomes in 23 pairs','DNA is a double helix']),{stateKey:'level',variants:zoomLevel}),
    'pairing-model':A([m('Strand 2','A T T G C A G C T A pairs with T A A C G T C G A T.'),m('The rule','A always pairs with T. C always pairs with G. These are complementary base pairs.')],
      [c('Success criteria',['All ten partners correct','States the pairing rule','Fixes shown in another colour'])]),
    'pairing-hinge':A([m('B: T A A C G','A pairs with T and C pairs with G, so A T T G C pairs with T A A C G.')],
      [c('What each wrong answer shows',['A: thinks both strands are the same','C: pairs A with C and T with G','D: reversed the order instead of pairing']),
       c('If you chose wrong',['Say the rule: A–T, C–G','Pair one base at a time','Try: G A C T T → C T G A A'])]),
    'genes-model':A([m('How they relate','A chromosome is one long DNA molecule. A gene is a section of that DNA carrying instructions for one characteristic.'),m('Numbers','Human body cells: 46 chromosomes in 23 pairs. Sperm and egg cells: 23.')],
      [c('Success criteria',['Gene = a section of DNA','Chromosome = one DNA molecule','46 in 23 pairs; gametes 23'])]),
    'build-model':A([m('Strand 2','G C A T T A C G pairs with C G T A A T G C.'),m('Labels','Strand; base pair; double helix; a gene bracket over several pairs.')],
      [c('Success criteria',['All eight partners correct','Four labels used','Gene spans several base pairs'])]),
    'mutation-model':A([m('Mutation','A mutation is a change in the base sequence of DNA. Most have no effect.'),m('Examples','Harmful: cystic fibrosis. Beneficial: adults who can still digest milk.')],
      [c('Success criteria',['Defines a mutation','Most have no effect','One harmful and one beneficial example'])]),
    'marked-task':A([
        m('Q1 · diagram','Two strands twisted into a double helix. The rungs are base pairs, labelled A–T and C–G.'),
        m('Q2 and Q3','Q2: in the nucleus, in the chromosomes. Q3: a section of DNA that carries the instructions for a characteristic.'),
        m('Q4 and Q5','Q4: a chromosome is one long DNA molecule; a gene is a section of it. Q5: harmful, cystic fibrosis; beneficial, digesting milk as an adult.')],
      [c('Q1 · 4 marks',['Two strands [1]','Twisted: double helix [1]','Base pairs as rungs [1]','Pairs are A–T and C–G [1]']),
       c('Q2 and Q3 · 3 marks',['Nucleus [1]','Section of DNA [1]','Instructions for a characteristic or protein [1]']),
       c('Q4 and Q5 · 4 marks',['Chromosome is one DNA molecule [1]','Gene is a section of it [1]','A harmful example [1]','A beneficial example [1]'])],11),
    exit:A([m('Answers','1 Nucleus, chromosome, gene, base. 2 G. 3 False: most mutations have no effect, and a few are beneficial.')],
      [c('3 marks',['Correct order [1]','G [1]','False, with a reason [1]'])],3)
  };
  return {main};
})();
