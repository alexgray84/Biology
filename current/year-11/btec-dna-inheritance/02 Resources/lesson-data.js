/* Lesson 2 · Alleles and Punnett squares (BTEC International Level 2 Applied Science · Unit 1 Learning aim A2 · A.P2, A.M2).
   Core path 40 minutes (Year 11 Thursday); the two optional screens bring it to 50 minutes (Year 10 Friday).
   Pupil-facing content only. All questions are original. Classroom practice: not Pearson Set Assignment evidence. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  window.LESSON={
    number:2,unit:'DNA and inheritance',unitLesson:2,
    course:'Year 11 BTEC Applied Science',spec:'BTEC Unit 1',
    title:'Alleles and Punnett squares',
    question:'Can we predict what offspring will inherit?',
    path:['Name the alleles','Fill the square','Read the odds'],
    outcomes:[
      ['Use the terms allele, dominant, recessive, genotype, phenotype, homozygous and heterozygous.','A2 · A.P2, A.M2'],
      ['Use a Punnett square to predict the offspring of a monohybrid cross.','A2 · A.M2'],
      ['Give the outcome as a ratio, a percentage and a probability.','A2 · A.M2']
    ],
    vocabulary:[
      ['Allele','A different version of the same gene, e.g. Y (yellow seed) or y (green seed).'],
      ['Dominant','An allele that shows its effect even if only one copy is present. Written as a capital letter.'],
      ['Recessive','An allele that only shows its effect with two copies. Written as a lower-case letter.'],
      ['Genotype','The alleles an organism has, e.g. Yy.'],
      ['Phenotype','The characteristic that shows, e.g. yellow seeds.'],
      ['Homozygous','Two identical alleles, e.g. YY or yy.'],
      ['Heterozygous','Two different alleles, e.g. Yy.'],
      ['Monohybrid cross','A cross that follows the inheritance of one gene.'],
      ['Punnett square','A grid showing every equally likely combination of the parents’ gametes.'],
      ['Carrier','A person with one recessive disease allele who does not have the disease.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Have these ready now.',items:['Book, pen and ruler','Two coloured pens','Your marked box from Lesson 1']},
      {heading:'Punnett square practice',text:'Practice crosses, the lesson questions and full answers.',href:'02%20Resources/Punnett%20square%20practice.html',linkLabel:'Open the practice sheet'}
    ],
    modelPages:[
      {heading:'Meet the alleles',text:'Two copies of each gene.',action:{id:'alleles',label:'Open the allele diagram'}},
      {heading:'Fill a Punnett square',text:'Step by step.',action:{id:'punnett-model',label:'Open the Punnett model'}},
      {heading:'Test the ratio',text:'Breed offspring and count.',action:{id:'chance-model',label:'Open the breeding model'}}
    ],
    checkPages:[
      {heading:'Carrier parents',text:'Four-option hinge.',action:{id:'carrier-hinge',label:'Open the hinge'}},
      {heading:'Three crosses',text:'Peer-checked practice.',action:{id:'practice',label:'Open the crosses'}},
      {heading:'Show what you know',text:'Three exit questions.',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      alleles:{
        prompt:'Explain what a dominant allele is.',
        claim:'Dominant means most common.',
        checks:['Check what dominant means','Find a counterexample','Rewrite the claim'],
        answer:A([m('Wrong meaning','Dominant means the allele shows its effect even with one copy. It says nothing about how common it is: the allele for Huntington’s disease is dominant but rare.')],
          [c('A strong check',['Shows with one copy','Not about how common','Uses a counterexample'])])
      },
      crosses:{
        prompt:'Two carriers have four children. Predict the outcome.',
        claim:'Exactly one child in four will have CF.',
        checks:['Check what a ratio means','Think about each child separately','Rewrite the claim'],
        answer:A([m('Chance, not a count','Each child has a 25% chance, separately. A family of four could have no children, one or more with cystic fibrosis.')],
          [c('A strong check',['25% for each child','Each birth is separate','Ratio is not an exact count'])])
      }
    },
    uae:{
      label:'Genomics',
      pages:[
        {heading:'Emirati Reference Genome Programme',text:'Abu Dhabi’s Department of Health built a reference genome of Emiratis to help doctors understand inherited disease risk.',source:'https://www.doh.gov.ae/en/research/the-emirati-reference-genome-programme',sourceLabel:'Read the official page',note:'Official source: Department of Health – Abu Dhabi · checked 29 Sep 2026'},
        {heading:'Two carrier parents',note:'Hypothetical classroom scenario',text:'Beta thalassaemia is caused by a recessive allele (t). Two healthy parents are both carriers (Tt). Use a Punnett square to find the chance their child has thalassaemia, and the chance the child is a carrier.',answer:A([
          m('Punnett square','Tt × Tt gives 1 TT : 2 Tt : 1 tt.'),
          m('Chances','Thalassaemia (tt): 25%. Carrier (Tt): 50%.')
        ],[c('3 marks',['Correct square [1]','25% thalassaemia [1]','50% carrier [1]'])],3)},
        {heading:'Why test before starting a family?',note:'Hypothetical classroom scenario',text:'Suggest why a couple might choose a blood test to find out if they are carriers.',answer:S('Informed choices','Two carriers have a 25% chance of an affected child with each pregnancy. Knowing early lets them get advice and plan care.',['Links carriers to the 25% chance','Advice or planning'])}
      ]
    },
    phases:[
      p('title','Title','title','Alleles and Punnett squares','alleles'),
      p('outcomes','Learning outcome','outcome','What you will learn','alleles',{nav:'Outcomes'}),
      p('do-now','Do now','content','Do now: DNA recap','alleles',{nav:'Do now',mins:4,timer:4,
        items:['1 Which base pairs with A?','2 What is a <strong>gene</strong>?','3 How many chromosomes are in a human body cell?'],
        doThis:['Write the three answers in your book.','No notes: this is retrieval.']}),
      p('feedback','Assess','content','Improve your marked box','alleles',{nav:'Feedback',mins:5,secure:true,
        label:'Feedback response · classroom practice',
        items:['<strong>R</strong> Retrieve: add the missing fact.','<strong>L</strong> Link: add a “because” or “so”.','<strong>V</strong> Vocabulary: swap a vague word for the key term.','<strong>M</strong> Method: redraw the base pairs A–T and C–G.'],
        doThis:['Find the code your teacher wrote by your box.','Below the box, in another colour, make that one fix.','Then answer: what is a chromosome made of?']}),
      p('alleles','Input','model','Genes come in versions: alleles','alleles',{nav:'Alleles',mins:6,diagram:'allele-pair',
        steps:['Chromosomes come in <strong>pairs</strong>, so body cells have <strong>two copies</strong> of each gene: one from each parent.',
          'Different versions of the same gene are <strong>alleles</strong>. Pea seed colour has a yellow allele (<strong>Y</strong>) and a green allele (<strong>y</strong>).',
          'A <strong>dominant</strong> allele (capital letter) shows its effect even if only one copy is present.',
          'A <strong>recessive</strong> allele (lower case) only shows its effect when there are two copies.'],
        doThis:['Press Next for each step.','Copy the four bold words, each with a one-line meaning.'],
        support:{
          start:[
            ['Two copies','Look at the diagram. Point to the two copies of the gene. Where did each copy come from?',S('One from each parent','One copy came from the mother and one from the father.',['Two copies','One from each parent'])],
            ['Capital or small','Copy: “Capital letter = dominant. Small letter = recessive.” Which allele is dominant: Y or y?',S('Y is dominant','Y (capital) is dominant: yellow. y (small) is recessive: green.',['Y dominant','y recessive'])]
          ],
          understand:[
            ['Which colour shows?','A plant has one Y and one y. Which seed colour does it have? Explain using the word dominant.',S('Yellow','Yellow, because Y is dominant, so one copy is enough to show its effect.',['Yellow','Uses dominant correctly'])],
            ['When does green show?','Explain why a plant needs two y alleles to have green seeds.',S('Two copies','y is recessive, so it only shows when there is no Y: the plant must be yy.',['Recessive needs two copies','No dominant allele present'])]
          ],
          hot:[
            ['Hidden allele','A yellow plant might be carrying a hidden green allele. Explain how that is possible.',S('Masked by Y','A Yy plant is yellow because Y is dominant, but it still carries y and can pass it on.',['Yy is yellow','y is carried and passed on'])],
            ['Link to DNA','Alleles of the same gene differ in their DNA. Suggest what is different about the two alleles.',S('Base sequence','The order of bases differs, so the instructions differ slightly. A new allele can arise from a mutation.',['Different base sequence','Links to mutation'])]
          ]
        }}),
      p('genotypes','Input','table','Genotype and phenotype','alleles',{nav:'Genotypes',mins:4,reveal:true,
        lead:'<strong>Genotype</strong>: the alleles an organism has. <strong>Phenotype</strong>: the characteristic that shows.',
        columns:['Genotype','Alleles','Homozygous or heterozygous?','Phenotype'],
        rows:[['YY','two yellow','homozygous dominant','yellow seeds'],['Yy','one of each','heterozygous','yellow seeds'],['yy','two green','homozygous recessive','green seeds']],
        doThis:['Copy the table headings.','Predict each row before it is revealed.'],
        support:{
          start:[
            ['Same or different?','Homo means same; hetero means different. Is YY homozygous or heterozygous?',S('YY is homozygous','YY has two identical alleles, so it is homozygous.',['Homozygous','Two identical alleles'])],
            ['Genotype or phenotype?','Sort these two: “Yy” and “yellow seeds”. Which is the genotype?',S('Letters vs looks','Yy is the genotype (the alleles). Yellow seeds is the phenotype (what shows).',['Yy genotype','Yellow seeds phenotype'])]
          ],
          understand:[
            ['Two ways to be yellow','Name both genotypes that give yellow seeds. Explain why both do.',S('YY and Yy','YY and Yy are both yellow because each contains at least one dominant Y allele.',['YY and Yy','At least one Y'])],
            ['Describe yy fully','Describe the genotype yy using three key words.',S('Three words','yy is homozygous recessive, and its phenotype is green seeds.',['Homozygous','Recessive','Green phenotype'])]
          ],
          hot:[
            ['Same look, different genes','Two yellow plants look identical. Explain why their genotypes might differ, and why that matters when breeding.',S('YY or Yy','One could be YY and the other Yy. Only Yy can pass on y, so only it can produce green offspring.',['YY or Yy','Only Yy passes on y'])],
            ['Human example','Cystic fibrosis is recessive (f). Give the genotype of a carrier and explain why they are unaffected.',S('Ff','A carrier is Ff. The dominant F allele works normally, so one copy is enough.',['Ff','Dominant F works'])]
          ]
        }}),
      p('punnett-model','Input','model3d','Predict with a Punnett square','crosses',{nav:'Punnett',mins:8,
        model:'punnett',fallback:'punnett-grid',modelState:{cross:'Yy-Yy',filled:false,tools:'square'},
        steps:['Write each parent’s <strong>gametes</strong>: a Yy parent makes Y or y, half of each.',
          'Fill each square: one allele from the top, one from the side.',
          'Count the <strong>genotypes</strong>: 1 YY : 2 Yy : 1 yy.',
          'Count the <strong>phenotypes</strong>: 3 yellow : 1 green, a <strong>75%</strong> chance of yellow.'],
        stepStates:[{filled:false},{filled:true},{filled:true},{filled:true}],
        doThis:['Draw a 2 × 2 grid. Fill it in with the model.'],
        ladder:[['Secure','Fills the square correctly.'],['Strong','Gives genotype and phenotype ratios.'],['Stretch','Turns the ratio into a percentage and a probability.']],
        caption:'Original 3D model. Each square is one equally likely combination of gametes.',
        support:{
          start:[
            ['Gametes first','A gamete gets one allele from each pair. Write the two gametes a Yy parent can make.',S('Y or y','A Yy parent makes Y gametes and y gametes, in equal numbers.',['Y','y'])],
            ['One square at a time','Fill the top-left square: the allele above it plus the allele beside it. Then move right.',S('Top row','Top row: YY and Yy. Bottom row: Yy and yy.',['Capital letter first','Four squares filled'])]
          ],
          understand:[
            ['Count and compare','Count your four squares. How many are YY, Yy and yy? Write it as a ratio.',S('1 : 2 : 1','1 YY : 2 Yy : 1 yy.',['Counts all four','Ratio 1 : 2 : 1'])],
            ['Ratio to percentage','Three of the four squares are yellow. Turn 3 out of 4 into a percentage and a probability.',S('75%','3 ÷ 4 = 0.75, so 75%, or a probability of 0.75 (3 in 4).',['75%','0.75 or 3 in 4'])]
          ],
          hot:[
            ['What the square really shows','Explain why each square is equally likely.',S('Equal chances','Each parent makes Y and y gametes in equal numbers, and fertilisation is random, so every combination is equally likely.',['Equal gamete numbers','Random fertilisation'])],
            ['Genotype vs phenotype ratio','Explain why the genotype ratio (1 : 2 : 1) differs from the phenotype ratio (3 : 1).',S('Dominance hides Yy','YY and Yy look the same because Y is dominant, so two genotypes share one phenotype.',['YY and Yy both yellow','Dominance explained'])]
          ]
        }}),
      p('carrier-hinge','Assess','hinge','Hinge: carrier parents','crosses',{nav:'Hinge',mins:3,secure:true,
        text:'Both parents are carriers of cystic fibrosis (<strong>Ff</strong>). What is the chance their child has cystic fibrosis?',
        options:['0%','25%','50%','75%'],correct:1,
        doThis:['Decide on your own: sketch the square if it helps.','Show 1, 2, 3 or 4 fingers when your teacher says.'],
        task:'No talking until everyone has chosen.'}),
      p('practice','Thinking','content','Your turn: three crosses','crosses',{nav:'Practice',mins:7,timer:7,
        items:['1 <strong>Yy × yy</strong> (pea seed colour)','2 <strong>YY × yy</strong> (pea seed colour)','3 <strong>Ff × Ff</strong> (cystic fibrosis: f is recessive)',
          'For each: genotype ratio, phenotype ratio, percentage.'],
        doThis:['Work alone for five minutes.','Swap books and check with the answers.','Correct in a different colour.'],
        support:{
          start:[
            ['Start with cross 1','For Yy × yy, write the gametes: top Y and y; side y and y. Now fill the four squares.',S('Cross 1 square','Yy, yy, Yy, yy: 2 Yy : 2 yy.',['Gametes placed','Four squares filled'])],
            ['Yellow or green?','For each square in cross 1, write yellow if it has a Y and green if it has none.',S('Two of each','2 yellow : 2 green, which simplifies to 1 : 1.',['Two yellow, two green','Simplified to 1 : 1'])]
          ],
          understand:[
            ['Cross 2 on your own','Do YY × yy. What do you notice about every offspring?',S('All the same','Every square is Yy, so all offspring are heterozygous with yellow seeds: 100% yellow.',['All Yy','100% yellow'])],
            ['Cross 3 in words','For Ff × Ff, give the chance of a child who is a carrier.',S('50% carriers','1 FF : 2 Ff : 1 ff. Carriers are Ff: 2 in 4, so 50%.',['Ff is the carrier','50%'])]
          ],
          hot:[
            ['Which cross gives green?','Which of the three pea crosses can give green seeds? Explain why cross 2 cannot.',S('Cross 1 only','Only cross 1 (Yy × yy) gives green (50%). In cross 2 every offspring gets a Y from the YY parent.',['Cross 1 gives green','YY always passes on Y'])],
            ['Unaffected but at risk','In cross 3, what fraction of the unaffected children are carriers? Explain.',S('Two in three','Of the three unaffected squares (FF, Ff, Ff), two are carriers: 2 in 3.',['Counts only unaffected squares','2 in 3'])]
          ]
        }}),
      p('chance-model','Thinking','model3d','Why real results are not exactly 3 : 1','crosses',{nav:'Chance',mins:6,optional:true,
        model:'punnett',fallback:'punnett-grid',modelState:{cross:'Yy-Yy',filled:true,tools:'breed'},
        lead:'A ratio is a <strong>probability</strong> for each offspring, not a promise.',
        doThis:['Breed 20 three times. Record each count.'],
        caption:'Each offspring is chosen at random from the parents’ gametes.',
        support:{
          start:[
            ['What to expect','Out of 20 seeds, how many yellow would a perfect 3 : 1 ratio give?',S('15 yellow','3 : 1 means 3 in 4 are yellow: 20 × 0.75 = 15 yellow, 5 green.',['15 yellow','5 green'])],
            ['Record like this','Draw a three-column table: total bred, yellow, green. Add one row each time you breed.',S('Table','Total bred | yellow | green, with one row per press.',['Three columns','A row per press'])]
          ],
          understand:[
            ['Close, not exact','Compare your first 20 with 15 : 5. Why is it probably not exact?',S('Random chance','Each seed is a separate chance event, so small samples vary around the prediction.',['Separate chance events','Small samples vary'])],
            ['Bigger samples','After 60 seeds, is the ratio closer to 3 : 1? Explain.',S('Closer with more','Usually yes: random variation evens out as the sample gets bigger.',['Usually closer','Variation evens out'])]
          ],
          hot:[
            ['Families are small','Use this idea to explain why a family of four with carrier parents rarely shows exactly 3 unaffected : 1 affected.',S('Small samples','Four children is a tiny sample; each child has its own 25% chance, so any number can be affected.',['Four is a small sample','25% each child'])],
            ['Checking a real cross','A real cross gives 290 yellow and 110 green seeds. Does this support 3 : 1? Show your working.',A([m('Working','Total 400. Expected 3 : 1 is 300 : 100. 290 : 110 is close, so it supports 3 : 1.')],[c('2 marks',['Expected 300 : 100 [1]','Close, so supported [1]'])],2)]
          ]
        }}),
      p('mystery','Thinking','content','Stretch: the mystery parent','crosses',{nav:'Stretch',mins:4,optional:true,
        items:['A yellow pea plant is crossed with a green plant (<strong>yy</strong>).','Some of the offspring have green seeds.','What is the yellow parent’s genotype? Prove it with a Punnett square.'],
        doThis:['Try both possible genotypes: YY and Yy.','Keep the one that can give green offspring.'],
        support:{
          start:[
            ['Two suspects','A yellow plant is either YY or Yy. Draw the square for YY × yy first.',S('YY × yy','All Yy: all yellow, so YY cannot give green.',['All Yy','No green'])],
            ['Second suspect','Now draw Yy × yy. Can it give green?',S('Yy × yy','2 Yy : 2 yy, so half are green. Yy can give green.',['Half green','Yy works'])]
          ],
          understand:[
            ['Decide','Which genotype fits the evidence? Write one sentence with “because”.',S('It is Yy','The parent is Yy, because only Yy can pass on a y allele to make yy offspring.',['Yy','Reason uses passing on y'])],
            ['Name the green seeds','Give the genotype of the green offspring and say where each allele came from.',S('yy','yy: one y from each parent.',['yy','One y from each parent'])]
          ],
          hot:[
            ['All yellow?','If all 50 offspring were yellow, could you be sure the parent is YY? Explain.',S('Very likely, not certain','Very likely YY, but a Yy parent could by chance give no green in 50. More offspring would make it surer.',['Very likely YY','Chance means not certain'])],
            ['Why use yy?','Explain why breeders cross an unknown plant with a yy plant to find its genotype.',S('Nothing to hide','yy only passes on y, so any recessive allele from the unknown parent shows in the offspring.',['yy only gives y','Hidden y becomes visible'])]
          ]
        }}),
      p('exit','Assess','content','Exit: show what you know','crosses',{nav:'Exit',mins:3,secure:true,
        items:['1 What is an allele? [1]','2 Give the genotype of a heterozygous yellow pea plant. [1]','3 Yy × yy: what percentage of offspring have green seeds? [1]'],
        doThis:['Answer in your book or on a mini-whiteboard.','Show your teacher when asked.']})
    ]
  };
})();
