/* Lesson 1 · Biological molecules and food tests (Year 10 Triple Biology · Pearson 4XBI1 2.7, 2.8, 2.9, 2.25 selected).
   Pupil-facing content only. All questions are original. Synthetic/anonymous: no pupil data. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  window.LESSON={
    number:1,unit:'Biological molecules',unitLesson:1,spec:'Pearson 4XBI1',
    title:'Biological molecules and food tests',
    question:'What are foods made of — and how can we prove it?',
    path:['Build the big molecules','Test for them','Explain the evidence'],
    outcomes:[
      ['Identify the elements in carbohydrates, proteins and lipids and describe each as a large molecule built from smaller units.','2.7, 2.8'],
      ['Test foods for glucose, starch, protein and fat, and interpret the results against a control.','2.9 · practical (Core Practical 1)'],
      ['Describe the main function of each group in the diet.','2.25 · selected']
    ],
    vocabulary:[
      ['Element','One kind of atom. Today: C carbon, H hydrogen, O oxygen, N nitrogen, S sulfur.'],
      ['Carbohydrate','Contains C, H and O. Includes simple sugars such as glucose, and starch and glycogen.'],
      ['Glucose','A simple sugar: the small unit that builds starch, glycogen and cellulose.'],
      ['Starch','The plant storage carbohydrate: many glucose units joined together.'],
      ['Glycogen','The animal storage carbohydrate, in liver and muscle. Many glucose units; more branched than starch.'],
      ['Protein','Contains C, H, O and N (often S). A chain of amino acids folded into a specific 3D shape.'],
      ['Amino acid','The small unit of a protein. About 20 kinds join in a specific order.'],
      ['Lipid','Fats (solid at room temperature) and oils (liquid). C, H and O, with much less oxygen than carbohydrates.'],
      ['Fatty acids and glycerol','A lipid is one glycerol joined to three fatty acids.'],
      ['Reagent','A chemical added to a sample to test for a substance.'],
      ['Reducing sugar','A sugar that gives a positive Benedict’s test, e.g. glucose, maltose. Sucrose does not.'],
      ['Benedict’s test','Heat with Benedict’s: blue → green → yellow → orange → brick-red precipitate.'],
      ['Biuret test','Protein test. Add Biuret reagent, no heating: blue → purple.'],
      ['Emulsion test','Lipid test. Shake with ethanol, pour into water: cloudy white emulsion.'],
      ['Precipitate','A solid formed in a liquid, e.g. the coloured solid in a positive Benedict’s test.'],
      ['Semi-quantitative','Shows a rough amount, so samples can be ranked, but gives no exact value.'],
      ['Control','Distilled water shows a negative result. A known sample shows a positive result.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Have these ready now.',items:['Book, pen and ruler','Practical sheet','Eye protection']},
      {heading:'Food tests practical sheet',text:'Integrated table, virtual practical steps, risk assessment and results table.',href:'01%20Resources/Food%20tests%20practical%20sheet.html',linkLabel:'Open the practical sheet'},
      {heading:'Exam-style questions',text:'All the lesson’s exam questions, plus homework, with answers.',href:'01%20Resources/Exam-style%20questions.html',linkLabel:'Open the question sheet'},
      {heading:'Read the teaching input',text:'Elements, building blocks, functions and food tests.',href:'01%20Resources/Biological%20molecules%20reading.html',linkLabel:'Open the reading'}
    ],
    modelPages:[
      {heading:'Build and split molecules',text:'Break each molecule into its building blocks.',action:{id:'build-model',label:'Open the molecule model'}},
      {heading:'Run the food tests',text:'Add each reagent. Compare with the water control.',action:{id:'tests-model',label:'Open the food-test model'}},
      {heading:'Read the Benedict’s scale',text:'Rank samples by colour.',action:{id:'benedict-scale',label:'Open the colour scale'}},
      {heading:'A modelled 6-mark method',text:'One creditworthy line at a time.',action:{id:'exam-model',label:'Open the worked example'}}
    ],
    checkPages:[
      {heading:'Check the building blocks',text:'Four-option hinge.',action:{id:'molecules-hinge',label:'Open the molecules hinge'}},
      {heading:'Interpret three samples',text:'Deduce the nutrients in X, Y and Z. 6 marks.',action:{id:'results-interpret',label:'Open the question'}},
      {heading:'Why the water tube?',text:'A hinge on controls.',action:{id:'control-hinge',label:'Open the control hinge'}},
      {heading:'Plan a test on your own',text:'Test a sports drink’s claim. 6 marks.',action:{id:'exam-independent',label:'Open the question'}},
      {heading:'Rank by colour',text:'Benedict’s results. 4 marks.',action:{id:'semi-quant',label:'Open the question'}},
      {heading:'Show what you know',text:'Three exit questions. 5 marks.',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      molecules:{
        prompt:'In one sentence, explain how a lipid is built.',
        claim:'Lipids are chains of glycerol.',
        checks:['Split the lipid in the model','Count the pieces and kinds','Rewrite the claim accurately'],
        answer:A([
          m('Not a chain','A lipid is one glycerol joined to three fatty acids: two kinds of unit, four pieces. It is not a chain of one repeating unit, unlike starch.')
        ],[c('A strong check',['Glycerol + three fatty acids','Not one repeating unit','Names the model as evidence'])])
      },
      tests:{
        prompt:'Explain how you would show that a food contains glucose.',
        claim:'Any sugar turns Benedict’s red.',
        checks:['Check the Benedict’s method','Check the positive result','Check which sugars react'],
        answer:A([
          m('Three errors','It needs heating in a water bath (about 80 °C). The positive is a colour sequence to a brick-red precipitate. Only reducing sugars react; sucrose does not.')
        ],[c('A strong check',['Adds water-bath heating','Brick-red precipitate, not “red”','Reducing sugars only'])])
      },
      exam:{
        prompt:'Write the first line of a 6-mark food-test method.',
        claim:'Just list reagents for 6 marks.',
        checks:['Look at what earns each mark','Is every reagent relevant?','Rewrite as better advice'],
        answer:A([
          m('Why a list fails','Marks go to method steps and results: preparing the sample, the reagent, volumes, heating and the colour change. Tests the question did not ask for earn nothing.')
        ],[c('A strong check',['Marks need steps and results','Only relevant tests earn credit','Uses the cake model as evidence'])])
      }
    },
    uae:{
      label:'Food security',
      pages:[
        {heading:'National Food Security Strategy 2051',text:'The UAE aims to improve nutrition, cut food waste and grow more food locally.',source:'https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051',sourceLabel:'Read the u.ae page',note:'Official UAE Government source · checked 27 Sep 2026'},
        {heading:'Test a snack label',note:'Hypothetical classroom scenario',text:'A local chickpea snack says “source of protein, no starch”. Iodine turned blue-black; Biuret turned purple. Is each claim supported?',answer:A([
          m('Protein: only partly','Biuret turned purple, so protein is present. The test shows presence, not amount.'),
          m('No starch: contradicted','Iodine turned blue-black, so starch is present.')
        ],[c('4 marks · protein claim',['Purple: protein present [1]','Amount not tested, so only partly supported [1]']),c('4 marks · starch claim',['Blue-black: starch present [1]','“No starch” claim contradicted [1]'])],4)},
        {heading:'More than energy',note:'Hypothetical classroom scenario',text:'A planner says a food basket needs only carbohydrate “because it gives energy”. Use protein and lipid functions to explain why not.',answer:A([
          m('Protein','Protein is needed for growth and repair, and to make enzymes and antibodies.'),
          m('Lipid','Lipid stores energy, insulates, protects organs and forms cell membranes. Carbohydrate cannot do these jobs.')
        ],[c('Success criteria',['A protein function','A lipid function beyond energy','Carbohydrate cannot replace them'])])},
        {heading:'Dates and a sucrose sweet',note:'Hypothetical classroom scenario',text:'With heated Benedict’s, date paste gives a brick-red precipitate; a sucrose sweet stays blue. A pupil says the sweet has no sugar. Evaluate.',answer:A([
          m('Date paste','Brick-red: date paste contains a lot of reducing sugar, such as glucose.'),
          m('The sweet','Sucrose is a sugar but not a reducing sugar, so it stays blue. Blue means no reducing sugar, not no sugar.')
        ],[c('Success criteria',['Interprets the brick-red result','Benedict’s detects reducing sugars only','Rejects “no sugar”'])])}
      ]
    },

    phases:[
      p('title','Title','title','Biological molecules and food tests','molecules'),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','molecules',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Start from memory','molecules',{nav:'Do now',mins:4,items:[
        'Ribosomes make ______.',
        'Plants store carbohydrate as ______. Animals store it as ______.',
        'Plant cell walls are made of ______.',
        '<strong>Predict:</strong> which releases most energy per gram — sugar, butter or egg white? Why?'
      ],doThis:['Write answers 1–4 in your book.','Circle your prediction for question 4.']}),

      /* ---------- Build the big molecules ---------- */
      p('elements','Input','content','Which elements?','molecules',{nav:'Elements · 2.7',mins:2,diagram:'elements',secondaryDiagram:true,caption:'Elements in each group. Schematic.',items:[
        '<strong>Carbohydrates:</strong> C, H, O.',
        '<strong>Proteins:</strong> C, H, O and <strong>N</strong>; many also S.',
        '<strong>Lipids:</strong> C, H, O — much less oxygen than carbohydrates.'
      ],doThis:['Copy the three lists. Circle the element only proteins contain.'],
      support:{
        start:[
          ['Pre-teach the symbols','An <strong>element</strong> is one kind of atom. Write each symbol beside its name: C carbon, H hydrogen, O oxygen, N nitrogen, S sulfur.',S('Symbol key','C carbon · H hydrogen · O oxygen · N nitrogen · S sulfur.',['All five matched','Sulfur spelt with an f'])],
          ['Find the extra element','Use the diagram. Find the group with an extra element. Complete: “Proteins contain C, H, O and ___.”',S('Nitrogen','Proteins contain C, H, O and nitrogen (N). Many also contain sulfur (S).',['Names nitrogen','Many, not all, contain S'])]
        ],
        understand:[
          ['Same elements, new amounts','Carbohydrates and lipids both contain C, H and O. Complete: “Lipids contain a much smaller proportion of ___.”',S('Less oxygen','Lipids contain a much smaller proportion of oxygen than carbohydrates.',['Names oxygen','Same three elements for both'])],
          ['Elements from memory','Close this panel and cover the screen. Write the elements in each group. Then check.',S('All three groups','Carbohydrates C, H, O. Proteins C, H, O, N (often S). Lipids C, H, O with much less oxygen.',['Three correct lists','N only in proteins'])]
        ],
        hot:[
          ['Only C, H and O','A molecule contains only C, H and O. Why can’t this tell you if it is a carbohydrate or a lipid? What evidence would help?',S('Same elements','Both groups contain only C, H and O. The proportion of oxygen differs: much less in lipids. A food test would also decide.',['Both share the elements','Oxygen proportion as evidence','Suggests a food test'])],
          ['Follow the nitrogen','A plant grows poorly in soil short of nitrate ions. Use the elements in proteins to explain why.',S('Nitrate gives nitrogen','Nitrate supplies nitrogen, needed to make amino acids and so proteins such as enzymes. Less protein means less growth.',['Nitrate → nitrogen','N needed for proteins','Less protein → poor growth'])]
        ]
      }}),

      p('build-model','Input','model3d','Big molecules from small units','molecules',{nav:'Build and split · 2.8',mins:4,model:'molecules',fallback:'moleculesFallback',
        steps:[
          '<strong>Starch</strong>: <strong>glucose</strong> units.',
          '<strong>Protein</strong>: <strong>amino acids</strong>.',
          '<strong>Lipid</strong>: <strong>glycerol</strong> + 3 <strong>fatty acids</strong>.'
        ],
        stepStates:[{molecule:'starch'},{molecule:'protein'},{molecule:'lipid'}],
        doThis:['Split each. Write “___ is made from ___.”'],
      support:{
        start:[
          ['Split one molecule first','Choose Starch. Press “Break apart”. Are the pieces all the same? Complete: “Starch → many ___ units.”',S('Starch → glucose','Starch → many glucose units. Every piece is the same simple sugar.',['Names glucose','Pieces are identical'])],
          ['One stem, four molecules','Use for each molecule: “___ is a large molecule made from ___.” Read the labels on the split pieces.',S('Four lines','Starch and glycogen: glucose. Protein: amino acids. Lipid: glycerol and three fatty acids.',['Four correct building blocks','Lipid: both parts named'])]
        ],
        understand:[
          ['Same pieces or different?','Split starch, then protein. Why are the protein pieces different colours but the starch pieces the same?',S('One kind vs twenty','Starch has one kind of unit, glucose. Proteins use about 20 kinds of amino acid, in a specific order.',['Starch: one kind of unit','Protein: about 20 kinds'])],
          ['Four molecules, no model','Close the model. From memory, write the building blocks of starch, glycogen, protein and lipid. Then check.',S('Recalled','Starch and glycogen: glucose. Protein: amino acids. Lipid: one glycerol, three fatty acids.',['All four without help','Glycogen from glucose'])]
        ],
        hot:[
          ['Is a lipid a polymer?','A student writes: “A lipid is a long chain of glycerol units.” Use the split lipid to explain why this is wrong.',S('Four pieces, two kinds','A lipid splits into one glycerol and three fatty acids: two kinds, four pieces. It is not a long chain of one repeating unit, unlike starch.',['One glycerol, three fatty acids','Not one repeating unit','Contrast with starch'])],
          ['Why so branched?','Glycogen is more branched than starch. Suggest why this helps a muscle cell that suddenly needs glucose for respiration.',S('More ends','Glucose units are removed from the ends of branches. More branches give more ends, so glucose is released faster.',['More branches, more ends','Faster glucose release'])]
        ]
      }}),

      p('carbohydrates','Input','content','Glucose builds the stores','molecules',{nav:'Carbohydrates',mins:2,diagram:'carbs',secondaryDiagram:true,caption:'Glucose units as hexagons. Schematic.',items:[
        '<strong>Starch:</strong> many <strong>glucose</strong> units — the plant store.',
        '<strong>Glycogen:</strong> many glucose units, more branched — the animal store (liver, muscle).'
      ],ladder:[['Secure','Both made of glucose.'],['Strong','Adds organism and site.'],['Grade 8–9','Compares branching, use.']],
      doThis:['Draw linked hexagons; label starch and glycogen.'],
      support:{
        start:[
          ['Draw before you write','Draw one hexagon: “glucose”. A chain of hexagons: “starch — plants”. A branched chain: “glycogen — animals”.',S('Three sketches','One hexagon is glucose. A chain is starch in plants. A branched chain is glycogen in animals.',['Each sketch labelled','Glycogen more branched'])],
          ['Where is it stored?','Use the diagram. Complete: “Starch is stored in ___. Glycogen is stored in the ___ and ___.”',S('Stores','Starch is stored in plants, e.g. potato. Glycogen is stored in the liver and muscles.',['Plants for starch','Liver and muscle'])]
        ],
        understand:[
          ['Same unit, two stores','Complete: “Starch and glycogen are both made of ___. Glycogen is more ___ and is found in ___.”',S('Compared','Both are made of glucose. Glycogen is more branched and is found in animals.',['Glucose for both','Branching','Animals'])],
          ['Compare without stems','Close this panel. In two sentences, compare starch and glycogen: unit, organism and branching.',S('Independent','Both are made of many glucose units. Starch is the plant store, whereas glycogen is the animal store and is more branched.',['Unit named','Organism for each','A comparison word'])]
        ],
        hot:[
          ['Glucose that is not a store','Cellulose is also made from glucose, but it is not an energy store. Suggest why, using where it is found.',S('A structural job','Cellulose is in plant cell walls, where its job is support. Same unit, different arrangement and job.',['In cell walls','Support, not storage'])],
          ['Why a big molecule?','Plants could store glucose itself. Suggest one advantage of storing it as large starch molecules.',S('Large and insoluble','Starch is insoluble, so it stays in the cells and does not draw in water by osmosis. It is a compact store.',['Insoluble','Links to osmosis'])]
        ]
      }}),

      p('proteins-lipids','Input','content','Order, shape and job','molecules',{nav:'Proteins and lipids',mins:2,diagram:'proteinLipid',secondaryDiagram:true,caption:'Schematic. Bead colours show different amino acids.',items:[
        '<strong>Protein:</strong> amino-acid order → <strong>specific 3D shape</strong> → function.',
        '<strong>Lipid:</strong> one <strong>glycerol</strong> + three <strong>fatty acids</strong>. Fats are solid, oils liquid at room temperature.'
      ],ladder:[['Secure','Names the units.'],['Strong','Order sets shape.'],['Grade 8–9','Changed order → lost function.']],
      doThis:['Write the protein chain. Sketch and label the lipid.'],
      support:{
        start:[
          ['Beads on a string','Each bead is an amino acid. Complete: “Change the order → change the ___ → change the ___.”',S('Order → shape → job','Change the order of amino acids → change the 3D shape → change the function.',['Shape second','Function third'])],
          ['Draw the E-shape','Draw an upright bar: “glycerol”. Draw three lines from it, each “fatty acid”. That is one lipid.',S('One lipid','One glycerol with three fatty acids attached, like the letter E.',['One glycerol','Three fatty acids'])]
        ],
        understand:[
          ['Why order matters','Two proteins use the same kinds of amino acid in different orders. Explain why they do different jobs.',S('Different shape','A different order folds into a different specific 3D shape. Shape decides function.',['Order → folding','Shape → function'])],
          ['Order to job, unaided','Close this panel. From memory, write the protein chain and the parts of a lipid. Then check.',S('Recalled','Amino-acid order → specific 3D shape → function. Lipid: one glycerol, three fatty acids.',['Chain in order','Both lipid parts'])]
        ],
        hot:[
          ['One amino acid swapped','A mutation swaps one amino acid in haemoglobin. Suggest why it may carry oxygen less well.',S('New order, new shape','The chain may fold into a different shape. Haemoglobin’s job depends on its shape, so oxygen may bind less well.',['Changed folding','Shape linked to job'])],
          ['Solid or liquid?','Butter is solid at 20 °C; olive oil is liquid. Can “solid or liquid” tell you if a food is a lipid? Explain.',S('State is not a test','No. Fats and oils are both lipids, and many non-lipids are solids or liquids. Use the emulsion test.',['Both are lipids','State cannot decide','Emulsion test'])]
        ]
      }}),

      p('functions','Input','table','What each group does','molecules',{nav:'Functions · 2.25',mins:1,reveal:true,columns:['Group','Built from','Main function','Example foods'],rows:[
        ['Carbohydrate','Glucose','Main energy source (released in respiration)','Rice, dates'],
        ['Protein','Amino acids','Growth and repair; enzymes','Fish, eggs'],
        ['Lipid','Glycerol + fatty acids','Energy store (≈37 vs ≈17 kJ/g); insulation','Butter, nuts']
      ],doThis:['Copy the headings. Fill each row as it appears. Check your do-now prediction.'],
      support:{
        start:[
          ['One row at a time','Cover all rows but one. Say the group, its building block and its job. Then move down.',S('Row by row','Carbohydrate: glucose, energy. Protein: amino acids, growth and repair. Lipid: glycerol and fatty acids, energy store.',['Group + building block','One job each'])],
          ['A stem for the jobs','Complete: “Carbohydrate is used for ___. Protein is used for ___. Lipid is used as an ___ store.”',S('Completed','Energy; growth and repair; energy store.',['Three correct jobs'])]
        ],
        understand:[
          ['Releases, not makes','Rewrite correctly: “Carbohydrates make energy.” Use “releases” and name the process.',S('Correct wording','Carbohydrates release energy in respiration.',['Uses “releases”','Names respiration'])],
          ['Table from memory','Close this panel and cover the table. Write one job and one food per group. Then check.',S('Recalled','Carbohydrate: energy, rice. Protein: growth and repair, fish. Lipid: energy store, nuts.',['One job each','One food each'])]
        ],
        hot:[
          ['Pack for a hike','A hiker packs 100 g of nuts (mostly lipid), not 100 g of dried fruit (mostly carbohydrate). Explain the advantage.',S('More energy per gram','Lipid releases about 37 kJ/g; carbohydrate about 17 kJ/g. The same mass of nuts releases about twice the energy.',['Approximate values','Per gram comparison'])],
          ['Protein for energy?','The body can respire protein if carbohydrate and lipid run out. Suggest why this is a problem.',S('Using up tissue','Proteins are needed for growth, repair and enzymes. Respiring them breaks down tissue such as muscle.',['Protein has other jobs','Tissue broken down'])]
        ]
      }}),

      p('molecules-hinge','Assess','hinge','Which statement is correct?','molecules',{nav:'Molecules hinge',mins:2,secure:true,options:[
        'Glycogen is a chain of amino acids.',
        'Starch and glycogen are both made from glucose.',
        'A lipid is a long chain of glycerol units.',
        'Proteins contain only C, H and O.'
      ],correct:1,task:'Hold up A, B, C or D. Then explain one wrong option.'}),

      /* ---------- Test for them ---------- */
      p('tests-table','Input','table','One table, four tests','tests',{nav:'Food tests table · 2.9',mins:4,reveal:true,columns:['Substance','Reagent','Method','Positive result','Interpretation'],rows:[
        ['Starch','Iodine','A few drops; no heat','Orange-brown → blue-black','Blue-black = starch'],
        ['Glucose','Benedict’s','Equal volume; water bath, 80 °C, 5 min','Blue → green → yellow → orange → brick-red precipitate','Further along = more glucose'],
        ['Protein','Biuret','Add, mix; no heat','Blue → purple','Purple = protein'],
        ['Fat','Ethanol, then water','Shake; pour into water','Cloudy white emulsion','Cloudy = lipid']
      ],doThis:['Copy the five headings. Complete each row as it appears.'],
      support:{
        start:[
          ['One row, said aloud','Copy only the Starch row. Say it aloud: “Iodine, a few drops, no heat, orange-brown to blue-black.” Then do the next row.',S('Starch row','Iodine · a few drops, no heat · orange-brown → blue-black · negative stays orange-brown.',['All cells filled','Both colours'])],
          ['Find the heated test','Circle the only method that needs heating. Write “HEAT” beside it.',S('Benedict’s only','Benedict’s is heated in a water bath, about 80 °C, for 5 minutes.',['Benedict’s circled','Water bath, not a flame'])]
        ],
        understand:[
          ['Before and after','For each test write “starts ___ → positive ___”. A result is a change, so give both colours.',S('Four changes','Orange-brown → blue-black. Blue → brick-red precipitate. Blue → purple. Clear → cloudy white.',['Both colours each time','Brick-red, not “red”'])],
          ['Cover the table','Cover the table. Say each reagent and positive result. Uncover and check row by row.',S('Recall check','Iodine blue-black; Benedict’s (heated) brick-red; Biuret purple; ethanol then water cloudy white.',['Four reagents','Four results'])]
        ],
        hot:[
          ['Why does it go cloudy?','Explain why the ethanol goes cloudy in water if lipid is present.',S('Droplets scatter light','Lipid dissolves in ethanol but not in water. In water it forms tiny droplets, an emulsion, which scatter light.',['Soluble in ethanol','Insoluble in water: droplets','Light scattered'])],
          ['Sugar that stays blue','Sucrose (table sugar) stays blue with Benedict’s. Why is “no sugar present” the wrong conclusion?',S('Reducing sugars only','Benedict’s detects reducing sugars such as glucose. Sucrose is not a reducing sugar, so it stays blue.',['Reducing sugars only','Sucrose is non-reducing'])]
        ]
      }}),

      p('tests-model','Input','model3d','Predict, test, compare','tests',{nav:'Virtual food tests',mins:2,model:'foodtests',fallback:'foodTestsFallback',modelState:{set:'known'},
        doThis:['Predict, add reagent, then compare with water.'],
      support:{
        start:[
          ['Predict first','Before pressing anything, point to the tube you think will change. Write its name and the colour you expect.',S('A prediction','“The starch tube will turn blue-black; the rest stay orange-brown.”',['Names a tube','Names a colour'])],
          ['Start with the water tube','After adding the reagent, look at the water tube first. Any tube that looks different has changed.',S('Using the control','The water tube shows a negative. Tubes that differ from it are positive.',['Compares with water','Positive and negative used'])]
        ],
        understand:[
          ['Benedict’s needs heat','Choose Benedict’s and add it. Nothing changes. Now heat. Explain why heating was needed.',S('Heat is needed','Benedict’s only changes colour when heated, at about 80 °C. Then the glucose tube forms a brick-red precipitate.',['Heating needed','Glucose tube changes'])],
          ['Record all four unaided','Close this panel. Run each reagent. Record the positive tube and its colour.',S('Known samples','Iodine: starch blue-black. Benedict’s: glucose brick-red. Biuret: egg white purple. Ethanol: oil cloudy white.',['One positive each','Water negative'])]
        ],
        hot:[
          ['Crack the mystery set','Switch to Mystery. Run all four reagents. Deduce what X, Y, Z and W contain.',S('Mystery samples','X: starch and glucose. Y: protein. Z: lipid and protein. W: none — it matches water.',['All four correct','Colour evidence'])],
          ['One tube, two tests','Z is purple with Biuret and cloudy with ethanol. Why are two separate tests needed?',S('Each test is specific','Each reagent detects one group. A positive for one test says nothing about the others.',['Each test detects one group'])]
        ]
      }}),

      p('benedict-scale','Input','content','Benedict’s shows how much','tests',{nav:'Semi-quantitative',mins:2,optional:true,diagram:'benedictScale',secondaryDiagram:true,caption:'Colour after heating with Benedict’s. Illustrative.',items:[
        'Further towards brick-red = <strong>more</strong> reducing sugar.',
        '<strong>Semi-quantitative:</strong> ranks only. A <strong>colorimeter</strong> gives a value.'
      ],ladder:[['Secure','Colour order.'],['Strong','Ranks; semi-quantitative.'],['Grade 8–9','Subjective → colorimeter.']],
      doThis:['Write the five colours in order. Arrow: “more glucose”.'],
      support:{
        start:[
          ['Build a colour ladder','Write the colours in a column: blue at the bottom, brick-red at the top. Draw an arrow up: “more glucose”.',S('Colour ladder','Bottom to top: blue, green, yellow, orange, brick-red.',['Five colours in order','Arrow to brick-red'])],
          ['Pre-teach the word','“Quantitative” = measured as a number. “Semi-quantitative” = a rough amount: enough to rank, not to measure.',S('In your words','It shows roughly how much, so samples can be ranked, but gives no actual value.',['Ranking','No exact number'])]
        ],
        understand:[
          ['Rank two tubes','Tube P is green; tube Q is orange. Complete: “___ has more glucose because ___ is further along.”',S('Q has more','Q, because orange is further along the sequence than green.',['Chooses Q','Uses the sequence'])],
          ['Explain without the ladder','Close this panel. In two sentences, explain why Benedict’s is semi-quantitative.',S('Explained','The colour shows the relative amount, so samples can be ranked. It gives no actual concentration.',['Relative amount','No actual value'])]
        ],
        hot:[
          ['Make it fair','Two students compare glucose in two juices. Name three variables to keep the same and explain one.',S('Controls','Same sample volume, Benedict’s volume, temperature and heating time. Longer heating makes more precipitate.',['Three variables','One explained'])],
          ['Judge the colorimeter','Why does a colorimeter give better evidence than judging colour by eye?',S('A number','Colour judgement is subjective. A colorimeter gives a value that can be compared with known concentrations.',['Eye is subjective','Gives a number'])]
        ]
      }}),

      p('practical','Thinking','model3d','Virtual practical: the mystery samples','tests',{nav:'Core Practical 1 (virtual)',mins:8,model:'foodtests',fallback:'foodTestsFallback',modelState:{set:'mystery',reagent:'iodine'},
      caption:'Virtual practical. In the lab: eye protection; Biuret is corrosive; no flames near ethanol.',
      doThis:['Test X, Y, Z, W with each reagent.','Record colours against the water.'],
      support:{
        start:[
          ['One reagent, one row','Choose one reagent at a time. Find its row in your table, read the positive colour, then check each tube.',S('Using the table','Each result is checked against the table, one reagent at a time.',['One test at a time','Compared with the table'])],
          ['A results sentence','Use: “Sample __ turned __ with __, so it contains __. The water control stayed __.”',S('Example','Sample Y turned purple with Biuret, so it contains protein. The water control stayed blue.',['Sample, colour, reagent','Nutrient','Control colour'])]
        ],
        understand:[
          ['Change or no change?','In a real lab, a tube is faintly green after heating with Benedict’s. Compare it with the water control. Decide, and give a reason.',S('A small positive','It changed: green is further along than the blue control, so a little reducing sugar is present.',['Compares with control','Green = a little'])],
          ['Two results unaided','Close this panel. Record and interpret your next two results in full sentences.',S('Independent','Each sentence names the sample, reagent, colour, nutrient and control colour.',['Two full sentences','Control used'])]
        ],
        hot:[
          ['Why the same volumes?','Why do Benedict’s comparisons need equal volumes and the same heating time?',S('Only glucose varies','Colour depends on how much precipitate forms. Other differences would change it, so the comparison would not be valid.',['Colour depends on precipitate','Valid comparison'])],
          ['A coloured food','Beetroot juice is dark red. Why is its Benedict’s result hard to judge? Suggest an improvement.',S('Masked colour','Its colour masks the change. Dilute it, or filter and weigh the precipitate.',['Colour masks change','A sensible fix'])]
        ]
      }}),

      p('results-interpret','Assess','cases','Interpret the evidence [6]','tests',{nav:'Interpret results',mins:3,label:'Original exam-style question · 6 marks',cases:[
        ['X','Iodine blue-black · Benedict’s orange · Biuret blue · ethanol clear'],
        ['Y','Iodine orange-brown · Benedict’s blue · Biuret purple · ethanol clear'],
        ['Z','Iodine orange-brown · Benedict’s blue · Biuret lilac · ethanol cloudy']
      ],task:'<strong>Deduce</strong> the nutrients, with evidence. [2 each]',doThis:['Write X, Y, Z: nutrient(s) + colour.'],
      support:{
        start:[
          ['Tick the positives','For X, find each positive colour in your table. Tick each test that is positive.',S('X: two ticks','Iodine blue-black ✓. Benedict’s orange ✓. Biuret and ethanol negative.',['Two positives','Two negatives'])],
          ['A two-mark sentence','Use: “X contains ___ and ___ because iodine turned ___ and Benedict’s turned ___.”',S('X','X contains starch and glucose: iodine blue-black, Benedict’s orange.',['Both nutrients','Both colours'])]
        ],
        understand:[
          ['Evidence for each nutrient','Z has two positives. Check you name both nutrients and a colour for each.',S('Z','Z contains protein (lilac Biuret) and lipid (cloudy emulsion).',['Two nutrients','A colour each'])],
          ['Answer Y on your own','Close this panel. Write Y’s answer with the same pattern, without the stem.',S('Y','Y contains protein only: Biuret turned purple.',['Protein','Purple Biuret'])]
        ],
        hot:[
          ['Which has more glucose?','X turned orange; another sample turned green. What can you conclude? What must be the same for this to be valid?',S('Fair ranking','X has more reducing sugar. Valid only with equal volumes and the same heating time and temperature.',['X has more','Two controls'])],
          ['If the control changed','Suppose the water control turned purple with Biuret. What would this mean for Y and Z?',S('Contamination','The water or tubes contain protein. The Biuret results cannot be trusted; repeat with clean equipment.',['Contamination','Repeat cleanly'])]
        ]
      }}),

      p('control-hinge','Assess','hinge','Why include the water tube?','tests',{nav:'Control hinge',mins:1,secure:true,options:[
        'To make the reagent react faster.',
        'To dilute the food so colours are easier to see.',
        'To show the colour with no nutrient present, for comparison.',
        'To prove the food contains water.'
      ],correct:2,task:'Choose one. What would a known glucose sample add?'}),

      /* ---------- Explain the evidence ---------- */
      p('exam-model','Input','model','<strong>Describe</strong> how to test cake for glucose and starch [6]','exam',{nav:'Modelled 6-mark answer',mins:3,label:'Original exam-style question · 6 marks',diagram:'testMethod',secondaryDiagram:true,caption:'Schematic. Copy each line; tick each mark.',steps:[
        '“Grind the cake with distilled water.” [1]',
        '“Decant or filter off the liquid.” [1]',
        '“Put equal volumes of the liquid into two test tubes.” One test per tube.',
        '“Add an equal volume of Benedict’s [1]; water bath, about 80 °C, 5 min [1]. Brick-red precipitate = glucose [1].”',
        '“Add a few drops of iodine [1]. Blue-black = starch [1].” Maximum 6. Add a water control.'
      ],
      support:{
        start:[
          ['Plan in four boxes','Draw four boxes: Prepare · Starch · Glucose · Control. Put one short step in each before writing.',S('Four-box plan','Prepare: grind, decant. Starch: iodine, blue-black. Glucose: Benedict’s, heat, brick-red. Control: water.',['Four boxes in order','Reagent + result'])],
          ['Start with a verb','Begin each line with an action: “Grind…”, “Add…”, “Heat…”. One action + one detail = one line.',S('Action lines','Grind with water. Add iodine. Add an equal volume of Benedict’s. Heat at about 80 °C.',['Verb first','A detail each'])]
        ],
        understand:[
          ['Add the missing detail','“Add Benedict’s and heat.” Rewrite it with the volume, the heating method and a temperature.',S('Precise line','Add an equal volume of Benedict’s and heat in a water bath at about 80 °C for 5 minutes.',['Equal volume','Water bath, ~80 °C'])],
          ['Rewrite it unaided','Close this panel and cover the screen. Write the cake method from memory. Then tick against the steps.',S('Independent','Grind, decant; iodine → blue-black; equal volume Benedict’s; water bath ~80 °C; brick-red; water control.',['Six points','Nothing irrelevant'])]
        ],
        hot:[
          ['Why grind with water?','Why must cake be ground with water for Benedict’s, when iodine can go straight onto solid cake?',S('A solution is needed','Grinding dissolves the sugars in water. Benedict’s must mix with a liquid and be heated. Iodine reacts with starch on a solid surface.',['Sugars dissolve','Benedict’s needs liquid'])],
          ['Add a positive control','How would testing a known glucose solution alongside the cake improve the method?',S('Proves it works','If known glucose turns brick-red, the reagent and heating work, so a blue cake result is a true negative.',['Shows method works','Trust a negative'])]
        ]
      }}),

      p('exam-independent','Assess','content','Test the sports-drink claim [6]','exam',{nav:'Independent 6-mark question',mins:6,timer:6,secure:true,label:'Original exam-style question · 6 marks',
        text:'A sports drink label claims it contains <strong>glucose</strong> and <strong>protein</strong> but <strong>no fat</strong>.',
        items:['<strong>Describe</strong> how to test each part of this claim, including results that would support it. [6]'],
        doThis:['Work alone, in silence, in your book. One mark-earning step per line.']}),

      p('semi-quant','Assess','content','Rank the glucose [4]','exam',{nav:'Semi-quantitative question',mins:3,label:'Original exam-style question · 4 marks',diagram:'benedictResults',secondaryDiagram:true,caption:'Tubes after heating with Benedict’s. Illustrative.',
        text:'Heated with Benedict’s: A brick-red, B green, C blue, D orange.',
        items:['(a) Rank A–D, most glucose first. [1]','(b) Explain why the test is <strong>semi-quantitative</strong>. [2]','(c) Suggest a way to measure the glucose. [1]'],
        doThis:['Answer (a)–(c) in your book.'],
      support:{
        start:[
          ['Place the tubes','Write blue → green → yellow → orange → brick-red. Write each tube letter under its colour.',S('Placed','C blue, B green, D orange, A brick-red.',['All four placed'])],
          ['A stem for (b)','Use: “The colour shows ___ amounts, so samples can be ___, but it does not give ___.”',S('Completed','Relative amounts; ranked; an actual concentration.',['Ranking','No actual value'])]
        ],
        understand:[
          ['What does blue mean?','C stayed blue. What does this show about the glucose in C?',S('None detected','No reducing sugar was detected in C: blue is the reagent’s own colour.',['No reducing sugar detected'])],
          ['Answer (c) alone','Close this panel. Name one method that gives a number for glucose. Say what it measures.',S('Quantitative','A colorimeter measures light absorbed; or filter, dry and weigh the precipitate.',['A valid method','What it measures'])]
        ],
        hot:[
          ['Is the ranking valid?','Suppose A was heated 8 min, the others 5. Evaluate the claim that A has the most glucose.',S('Unfair test','Longer heating makes more precipitate, so A’s colour may reflect time, not glucose. Repeat with 5 minutes for all.',['Time affects colour','Fair repeat'])],
          ['Time the first change','A student times how long each drink takes to turn green. Why does a shorter time mean more glucose?',S('Faster change','More reducing sugar forms precipitate faster, so the colour changes sooner. Keep temperature and volumes the same.',['More glucose, faster','A control'])]
        ]
      }}),

      p('exit','Assess','content','Exit: three quick checks','exam',{nav:'Exit check',mins:2,secure:true,items:[
        'Name the building blocks of a lipid. [1]',
        'Which test needs heating? Why no flames in the ethanol test? [2]',
        'Iodine turns blue-black; Benedict’s stays blue after heating. Interpret. [2]'
      ],doThis:['Answer 1–3 in your book, on your own.']})
    ]
  };
})();
