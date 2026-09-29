/* Lesson 1 · DNA, genes and chromosomes (BTEC International Level 2 Applied Science · Unit 1 Learning aim A2 · A.P2).
   Pupil-facing content only. All questions are original. Classroom practice: not Pearson Set Assignment evidence.
   Synthetic/anonymous: no pupil data. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  window.LESSON={
    number:1,unit:'DNA and inheritance',unitLesson:1,
    course:'Year 10 BTEC Applied Science',spec:'BTEC Unit 1',
    title:'DNA, genes and chromosomes',
    question:'What is DNA, and how does it carry instructions?',
    path:['Zoom in to DNA','Pair the bases','Change one base'],
    outcomes:[
      ['Describe where DNA is found and how chromosomes, DNA and genes are related.','A2 · A.P2'],
      ['Describe the structure of DNA: a double helix joined by complementary base pairs.','A2 · A.P2'],
      ['Describe what a mutation is, with a harmful and a beneficial example.','A2 · A.P2']
    ],
    vocabulary:[
      ['DNA','The genetic material. Two strands twisted into a double helix.'],
      ['Double helix','The shape of DNA: two strands twisted around each other.'],
      ['Base','One of four chemicals in DNA: A, T, C and G.'],
      ['Complementary base pairs','A always pairs with T. C always pairs with G.'],
      ['Gene','A section of DNA that carries the instructions for one characteristic.'],
      ['Chromosome','One long, coiled DNA molecule. Human body cells have 46, in 23 pairs.'],
      ['Nucleus','The part of the cell that contains the chromosomes.'],
      ['Mutation','A change in the base sequence of DNA. Most have no effect; some are harmful; a few are beneficial.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Have these ready now.',items:['Book, pen and ruler','Two coloured pens','Two paper strips for the model']},
      {heading:'DNA questions and answers',text:'Practice questions, the marked-box task and full answers.',href:'01%20Resources/DNA%20questions.html',linkLabel:'Open the question sheet'}
    ],
    modelPages:[
      {heading:'Zoom from cell to DNA',text:'Four steps, largest first.',action:{id:'zoom-model',label:'Open the zoom model'}},
      {heading:'Pair the bases',text:'Predict, then reveal.',action:{id:'pairing-model',label:'Open the base-pair model'}},
      {heading:'Find a gene',text:'A section of DNA.',action:{id:'genes-model',label:'Open the gene model'}},
      {heading:'Make a mutation',text:'Change one base.',action:{id:'mutation-model',label:'Open the mutation model'}}
    ],
    checkPages:[
      {heading:'Find the partner strand',text:'Four-option hinge.',action:{id:'pairing-hinge',label:'Open the hinge'}},
      {heading:'Explain DNA',text:'Teacher-marked box. 11 marks.',action:{id:'marked-task',label:'Open the task'}},
      {heading:'Show what you know',text:'Three exit questions.',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      structure:{
        prompt:'Describe DNA in one sentence.',
        claim:'DNA is one flat strand of bases.',
        checks:['Count strands','Check shape','Rewrite it'],
        answer:A([m('Two errors','DNA has two strands, not one, twisted into a double helix. The rungs are base pairs: A–T and C–G.')],
          [c('A strong check',['Two strands','Twisted: double helix','Uses the model as evidence'])])
      },
      genes:{
        prompt:'Explain what a gene is.',
        claim:'A gene is a whole chromosome.',
        checks:['Find the gene band on the model','Compare it with a chromosome','Rewrite the claim'],
        answer:A([m('Wrong size','A gene is a short section of DNA. A chromosome is one long DNA molecule carrying hundreds of genes.')],
          [c('A strong check',['Gene = a section of DNA','A chromosome carries many genes','Evidence from the model'])])
      },
      mutation:{
        prompt:'Are mutations good or bad?',
        claim:'All mutations are harmful.',
        checks:['Check the three outcomes','Find a beneficial example','Rewrite the claim'],
        answer:A([m('Overgeneralised','Most mutations have no effect. Some are harmful (cystic fibrosis); a few are beneficial (digesting milk as an adult).')],
          [c('A strong check',['Most have no effect','A harmful example','A beneficial example'])])
      }
    },
    uae:{
      label:'Genomics',
      pages:[
        {heading:'Emirati Reference Genome Programme',text:'Abu Dhabi’s Department of Health built a reference genome of Emiratis to find DNA variants linked to disease risk.',source:'https://www.doh.gov.ae/en/research/the-emirati-reference-genome-programme',sourceLabel:'Read the official page',note:'Official source: Department of Health – Abu Dhabi · checked 29 Sep 2026'},
        {heading:'One different base',note:'Hypothetical classroom scenario',text:'Scientists read one gene from a volunteer and find a single base that differs from most people. The volunteer is healthy. Name the change and suggest why it causes no harm.',answer:A([
          m('A mutation','A change in the base sequence is a mutation. Most mutations have no effect: the protein may still work normally.')
        ],[c('2 marks',['Mutation [1]','Most have no effect / protein still works [1]'])],2)},
        {heading:'Why read DNA?',note:'Hypothetical classroom scenario',text:'Suggest one way knowing a person’s DNA could help doctors prevent illness.',answer:S('Earlier action','If a harmful mutation is found early, the person can be checked regularly or offered treatment or advice before symptoms start.',['Finds a harmful mutation','Action before symptoms'])}
      ]
    },
    phases:[
      p('title','Title','title','DNA, genes and chromosomes','structure'),
      p('outcomes','Learning outcome','outcome','What you will learn','structure',{nav:'Outcomes'}),
      p('do-now','Do now','content','Do now: cells recap','structure',{nav:'Do now',mins:5,timer:5,
        items:['1 What does the <strong>nucleus</strong> do?','2 Which specialised cell has <strong>no nucleus</strong>?','3 What does <strong>specialised</strong> mean?'],
        doThis:['Write the three answers in your book.','No notes: this is retrieval.']}),
      p('zoom-model','Input','model3d','From cell to DNA','structure',{nav:'Cell to DNA',mins:6,
        model:'dna',fallback:'dna-zoom',modelState:{view:'zoom',level:0},
        steps:['Most body cells have a <strong>nucleus</strong>. It holds the genetic material.',
          'Inside are <strong>chromosomes</strong>: 46 in a human body cell, in 23 pairs.',
          'Each chromosome is one long, coiled <strong>DNA</strong> molecule.',
          'DNA is a <strong>double helix</strong>: two strands joined by pairs of <strong>bases</strong>.'],
        stepStates:[{level:0},{level:1},{level:2},{level:3}],
        doThis:['Press Next to zoom in. Write the four words, largest first.'],
        caption:'Original 3D model, not to scale. Drag to rotate.',
        support:{
          start:[
            ['Picture strip: cell to DNA','Watch each zoom step. Copy the four words in order, largest first: cell, nucleus, chromosome, DNA.',S('Largest first','Cell → nucleus → chromosome → DNA.',['Four words in order','Cell largest, DNA smallest'])],
            ['Finish two stems','Finish each stem: “The nucleus contains…” and “A chromosome is…”',S('Model stems','The nucleus contains chromosomes. A chromosome is one long, coiled DNA molecule.',['Nucleus contains chromosomes','Chromosome is made of DNA'])]
          ],
          understand:[
            ['Count the pairs','A human body cell has 46 chromosomes. How many pairs is that? Where did each chromosome in a pair come from?',S('23 pairs','46 ÷ 2 = 23 pairs. One chromosome of each pair came from each parent.',['23 pairs','One from each parent'])],
            ['Zoom without help','Cover the model. Write the zoom sequence from cell to DNA with one fact for each step.',S('Four steps, four facts','Cell: has a nucleus. Nucleus: holds chromosomes. Chromosome: one long DNA molecule. DNA: a double helix of paired bases.',['Four steps in order','One correct fact each','No notes used'])]
          ],
          hot:[
            ['Red blood cells','Red blood cells have no nucleus. Explain what they cannot do that most cells can.',S('No nucleus, no DNA','With no nucleus there is no DNA, so the cell cannot divide or make new proteins. It has more room for haemoglobin.',['No DNA or genes','Cannot divide or make new proteins','Links to its job'])],
            ['Why coil it?','Each human cell holds about 2 metres of DNA. Suggest why DNA is coiled into chromosomes.',S('Fit and sort','Coiling packs a very long molecule into a tiny nucleus and keeps it organised, so it can be copied and shared out when cells divide.',['Fits in the nucleus','Organised for cell division'])]
          ]
        }}),
      p('pairing-model','Input','model3d','Complementary base pairs','structure',{nav:'Base pairs',mins:5,
        model:'dna',fallback:'dna-ladder',modelState:{view:'helix',partners:false,gene:false,mutated:false,tools:'partners'},
        lead:'Four <strong>bases</strong>: A, T, C, G. <strong>A pairs with T</strong>; <strong>C pairs with G</strong>.',
        doThis:['Write each partner, then reveal them.'],
        caption:'Original 3D model. Colours show the pairing rule.',
        support:{
          start:[
            ['The pairing rule','Use the model colours. Copy: “A pairs with T; C pairs with G.” Then write the partner of A, then of C.',S('Partners','A pairs with T. C pairs with G.',['A–T','C–G'])],
            ['One base at a time','Cover all but the first base of strand 1. Write its partner. Move down one base and repeat.',S('Strand 2','A T T G C A G C T A pairs with T A A C G T C G A T.',['One base at a time','Every pair is A–T or C–G'])]
          ],
          understand:[
            ['Check with the model','Press Show partner bases. Tick each pair you got right. Fix any wrong pair in another colour.',S('Self-check','All ten pairs are A–T or C–G. Fixes are in a different colour.',['Ticks and fixes shown','Rule used for each fix'])],
            ['Pair a new strand','Without the model, write the partner strand for: C C G A T T.',A([m('Answer','G G C T A A.')],[c('1 mark',['G G C T A A, all six correct [1]'])],1)]
          ],
          hot:[
            ['Why complementary?','When a cell copies DNA, the two strands separate. Explain how the pairing rule gives an identical copy.',S('A template','Each base has only one partner, so the order of bases on one strand fixes the order on the new strand. The copy is identical.',['Strands separate','Each base has one partner','So the copy matches'])],
            ['Count the bases','A DNA sample is 30% A. What percentage is T? What percentage is C? Show your reasoning.',A([m('Working','A pairs with T, so T = 30%. A + T = 60%, so C + G = 40%. C = G, so C = 20%.')],[c('2 marks',['T = 30% [1]','C = 20% [1]'])],2)]
          ]
        }}),
      p('pairing-hinge','Assess','hinge','Hinge: find the partner strand','structure',{nav:'Hinge',mins:3,secure:true,
        text:'One DNA strand reads <strong>A T T G C</strong>. Which is the complementary strand?',
        options:['A T T G C','T A A C G','C G G T A','C G T T A'],correct:1,
        doThis:['Decide on your own.','Show 1, 2, 3 or 4 fingers when your teacher says.'],
        task:'No talking until everyone has chosen.'}),
      p('genes-model','Input','model3d','Genes and chromosomes','genes',{nav:'Genes',mins:5,
        model:'dna',fallback:'dna-ladder',modelState:{view:'helix',partners:true,gene:true,mutated:false,tools:'gene'},
        lead:'A <strong>gene</strong> is a section of DNA. A <strong>chromosome</strong> carries hundreds of genes.',
        doThis:['Write: chromosome → DNA → gene.'],
        ladder:[['Secure','Says a gene is a section of DNA.'],['Strong','Links gene → instructions → characteristic.'],['Stretch','Explains why the order of bases matters.']],
        caption:'Original 3D model: the gold band marks one gene.',
        support:{
          start:[
            ['Gene in one line','Finish: “A gene is a section of … that carries the instructions for …”',S('Model line','A gene is a section of DNA that carries the instructions for one characteristic.',['Section of DNA','Instructions for a characteristic'])],
            ['Sort the sizes','Put in order, largest first: gene, chromosome, nucleus. Find the gene band on the model first.',S('Largest first','Nucleus → chromosome → gene.',['Nucleus largest','Gene smallest'])]
          ],
          understand:[
            ['Numbers check','How many chromosomes are in (a) a skin cell and (b) a sperm cell? Explain the difference.',A([m('Answers','(a) 46, in 23 pairs. (b) 23: one from each pair, so fertilisation makes 46 again.')],[c('3 marks',['46 [1]','23 [1]','Fertilisation restores 46 [1]'])],3)],
            ['Say it to a partner','Close your book. Explain how a chromosome, DNA and a gene are related. Then swap.',S('The relationship','A chromosome is one long DNA molecule. A gene is a section of that DNA.',['Chromosome = one DNA molecule','Gene = a section of it'])]
          ],
          hot:[
            ['Same genes, different cells','A nerve cell and a muscle cell contain the same genes. Suggest why they look and work differently.',S('Different genes used','Each cell type uses different genes, so it makes different proteins and becomes specialised.',['Same DNA in both','Different genes used','Different proteins, different jobs'])],
            ['Why order matters','Two genes contain the same bases in a different order. Explain why they give different instructions.',S('Order is the code','The instructions are in the order of the bases, like letters in a word. A different order codes for a different protein.',['Order carries the instructions','Different order, different protein'])]
          ]
        }}),
      p('build-model','Thinking','content','Build a paper DNA model','structure',{nav:'Build it',mins:6,timer:6,
        items:['Strand 1: <strong>G C A T T A C G</strong>.','Write strand 2 beside it using the base-pair rule.','Twist the strips into a helix. Bracket four pairs as a “gene”.'],
        doThis:['Work in pairs: one paper strip each.','Write both strands, then twist and label.','Check your partner’s pairs against the rule.'],
        support:{
          start:[
            ['First four bases','Just do the first four bases: G C A T. Write the partner beside each one.',S('First four','G C A T pairs with C G T A.',['C beside G','T beside A'])],
            ['Two colours only','Colour A–T pairs one colour and C–G pairs another. Every rung should be one of the two colours.',S('Two colours','Every pair is A–T or C–G, so only two colours appear.',['Two colours only','No A–C or T–G pairs'])]
          ],
          understand:[
            ['Finish the strand','Now write the partner for the last four bases: T A C G.',A([m('Answer','T A C G pairs with A T G C. Full strand 2: C G T A A T G C.')],[c('1 mark',['A T G C [1]'])],1)],
            ['Label your model','Label your model: strand, base pair, double helix, gene. Use each word once.',S('Four labels','Strand on one side; base pair on one rung; double helix on the twist; gene bracket over four pairs.',['Four labels used','Gene spans several pairs'])]
          ],
          hot:[
            ['Model limits','Give two ways your paper model is not like real DNA.',S('Limits','Real DNA is millions of bases long, far thinner, and coiled around proteins. Paper does not show the bonds between bases.',['Length or scale','Coiling, proteins or bonds'])],
            ['Improve the model','Suggest one change that would let the model show how DNA is copied.',S('Show copying','Separate the strips down the middle, then build a new partner strand on each half using the pairing rule.',['Separate the strands','Build new partners with the rule'])]
          ]
        }}),
      p('mutation-model','Input','model3d','Mutations: a change in the bases','mutation',{nav:'Mutations',mins:6,
        model:'dna',fallback:'dna-ladder',modelState:{view:'helix',partners:true,gene:false,mutated:false,tools:'mutate'},
        lead:'A <strong>mutation</strong> is a change in the base sequence. Most have <strong>no effect</strong>.',
        doThis:['Change one base. Copy the two examples.'],
        caption:'Original 3D model: the ring marks the changed base pair.',
        support:{
          start:[
            ['Spot the change','Press Change one base. Which pair changed? Write the pair before and after.',S('Pair 4','Pair 4 changed from G–C to A–T.',['Pair number','Before and after'])],
            ['Three outcomes','Copy and finish: “A mutation can have no effect, or be … or be …”',S('Three outcomes','No effect (most), harmful or beneficial.',['No effect','Harmful','Beneficial'])]
          ],
          understand:[
            ['Harmful example','Cystic fibrosis is caused by a faulty gene. Explain how a change in the bases can cause a disease.',S('Faulty protein','The changed bases give the wrong instructions, so the protein is faulty or not made. The body cannot work normally.',['Base sequence changes','Wrong or no protein','Body affected'])],
            ['Beneficial example','Some adults can still digest milk because of a mutation. Explain why this is beneficial.',S('Milk as food','The mutation keeps the milk-digesting gene working in adults, so they can use milk as a food source.',['Gene keeps working','Extra food source'])]
          ],
          hot:[
            ['Harmful or helpful?','One faulty copy of the sickle-cell gene gives more resistance to malaria. Two copies cause sickle cell disease. Is this mutation harmful or beneficial? Justify.',S('It depends','Both. Where malaria is common, one copy helps survival; two copies cause disease. The effect depends on copies and environment.',['Beneficial with one copy','Harmful with two','Depends on environment'])],
            ['No change at all','A mutation changes one base, but the person is unaffected. Suggest two reasons.',S('No effect','The change may be outside a gene, or the protein may still be made the same or still work.',['Outside a gene','Protein unchanged or still works'])]
          ]
        }}),
      p('marked-task','Assess','content','Teacher-marked box: explain DNA','structure',{nav:'Marked box',mins:11,secure:true,timer:11,
        label:'Classroom practice · teacher-marked · not PSA evidence',
        items:['1 Draw and label DNA: two strands, double helix, four base pairs. [4]',
          '2 Where is DNA found in a cell? [1]','3 What is a gene? [2]',
          '4 How are chromosomes, DNA and genes related? [2]','5 Name a harmful and a beneficial mutation. [2]'],
        doThis:['Rule off a highlighted box. Work alone, then self-assess when told.']}),
      p('exit','Assess','content','Exit: show what you know','structure',{nav:'Exit',mins:3,secure:true,
        items:['1 Put in order, largest first: gene, nucleus, base, chromosome. [1]','2 Which base pairs with C? [1]','3 True or false: all mutations are harmful. Explain. [1]'],
        doThis:['Answer in your book or on a mini-whiteboard.','Show your teacher when asked.']})
    ]
  };
})();
