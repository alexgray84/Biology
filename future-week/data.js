/* Arcadia Future Week: activity data (v2, led by Dubai Future Week).
   One object per activity. Timings must sum to less than the slot:
   9 of 10, 18 of 20, 27 of 30, 45 of 50. Run `node check.mjs` after editing. */
window.AFW = {
  tracks: {
    live: {
      n: "01", word: "live", label: "Live", img: "assets/live.jpg",
      alt: "A small future neighbourhood of white homes with gold domes among lavender and orange dunes",
      questions: [
        "What will make future cities feel like home?",
        "How will we move through the cities of 2050?",
        "Can our homes take care of us?"
      ]
    },
    think: {
      n: "02", word: "think", label: "Think", img: "assets/think.jpg", alt: "",
      questions: [
        "What will learning look like when AI knows everything?",
        "How do we stay curious in an age of answers?",
        "Who decides what machines should decide?"
      ]
    },
    innovate: {
      n: "03", word: "innovate", label: "Innovate", img: "assets/innovate.jpg", alt: "",
      questions: [
        "What will humans make next?",
        "Which discoveries will define the next decade?",
        "How fast is too fast for innovation?"
      ]
    },
    feel: {
      n: "04", word: "feel", label: "Feel", img: "assets/feel.jpg", alt: "",
      questions: [
        "What does it mean to be well in 2050?",
        "Will we live to 150, and should we?",
        "Can technology make us happier?"
      ]
    },
    business: {
      n: "05", word: "do business", label: "Do business", img: "assets/business.jpg", alt: "",
      questions: [
        "What will money mean in a cashless world?",
        "Where will tomorrow’s value be created?",
        "How will we work when machines do more?"
      ]
    }
  },

  order: ["L10", "L20", "L30", "L50", "T10", "T20", "T30", "T50", "I10", "I20", "I30", "I50", "F10", "F20", "F30", "F50", "B10", "B20", "B30", "B50", "FS"],

  acts: {

    /* ───────────── How we'll live ───────────── */

    L10: {
      track: "live", mins: 10, team: "alone", years: [7, 11], group: "On your own, then pairs", kit: "Paper",
      title: "Can our homes take care of us?",
      blurb: "Design one way a 2050 Dubai home could look after the people who live in it.",
      question: "Can our homes take care of us?",
      from: "Dubai Future Week “How we’ll live” question 3. Topic: smart and sustainable homes.",
      drop: "Old Dubai houses had a wind tower called a barjeel. Its openings catch the wind and send it down into the room. Warm air rises and leaves through the tower. It uses no electricity. Today scientists are making paints and tiles that cool a building by reflecting sunlight. They use no electricity either.",
      example: "“A front door that notices Grandma hasn’t opened it by 10am and messages the family.”",
      steps: [
        { m: 1, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. What does the door notice, and who does it help?" },
        { m: 3, who: "On your own", t: "List three ways", d: "List three ways a 2050 home in Dubai could look after the people in it. One helps the body. One helps the mind. One helps the planet." },
        { m: 3, who: "In pairs", t: "Pick the best and sketch it", d: "Choose your strongest idea. Make one sketch between you and label how it works." },
        { m: 1, who: "In pairs", t: "Check it", d: "Check your sketch with the checklist. Tick each point it meets. Fix anything that is missing." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about homes of the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "One labelled sketch on paper.",
      checklist: ["It says who it cares for.", "It says how it works.", "It still works on a 45°C summer day."],
      model: {
        intro: "A strong sketch shows a bedroom window with a small sensor beside the bed, and three labels:",
        marks: [
          "<b>Who:</b> “For my little brother, who has asthma.”",
          "<b>How:</b> “The sensor measures dust in the air. When a sandstorm starts, the window seals itself and the air filter switches on.”",
          "<b>At 45°C:</b> “The glass has a coating that reflects the sun’s heat, so the room stays cooler even on the hottest afternoon.”"
        ]
      },
      support: "Start with: “My home would notice… and then…”",
      stretch: "Who owns the data your home collects?",
      fewer: "On your own: do the pairs steps yourself, then ask someone to check your sketch with the checklist. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    L20: {
      track: "live", mins: 20, team: "alone", years: [7, 9], group: "Pairs", kit: "A4 paper",
      title: "Who is this street for?",
      blurb: "Redesign the road outside Arcadia’s gate for someone who finds it hard to use.",
      question: "What will make future cities feel like home?",
      from: "Dubai Future Week “How we’ll live” question 1, and the Big Stage session “What If Cities Belonged to Everyone?” on 19 November.",
      drop: "Dubai has a plan for 2040. It wants a “20-minute city”. This means people can reach most of the things they need each day in 20 minutes, on foot or by bicycle.",
      example: "Person card: “Grandparent with a walking stick.” One fix: a shaded bench every 100 metres.",
      cards: {
        title: "The four person cards",
        note: "",
        items: ["A pupil on a scooter", "A grandparent with a walking stick", "A delivery rider", "A parent with a pram (a baby’s pushchair) in August"]
      },
      steps: [
        { m: 2, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Why does a bench every 100 metres matter to this person?" },
        { m: 4, who: "In pairs", t: "Map the street at 3pm", d: "Sketch the road outside Arcadia’s gate at 3pm, when school ends. Who uses it? Mark who finds it hard to use, and where." },
        { m: 7, who: "In pairs", t: "Redesign it for one person", d: "Pick one person card. Draw the street again so it works for them." },
        { m: 3, who: "In pairs", t: "Swap and check", d: "Swap with another pair, or show it to someone who has not seen it. They check it with the checklist and tell you one thing to fix." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about who streets are for. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A before-and-after street sketch on A4.",
      checklist: ["It names the person.", "It fixes a real problem for them.", "It doesn’t make the street worse for someone else."],
      model: {
        intro: "A finished before-and-after for the delivery rider:",
        marks: [
          "<b>The person:</b> “Delivery rider, on a motorbike, at 3pm.”",
          "<b>Before, the real problem:</b> “Nowhere to stop. He waits on the edge of the pavement in full sun while cars stop all around him.” <b>After:</b> “A marked, shaded rider bay (a place to stop) 20 metres from the gate, with a water point.”",
          "<b>Not worse for others:</b> “The bay is cut into the road, not the pavement, so prams and walking sticks keep a clear path.”"
        ]
      },
      support: "Draw this first: two pavements, one road and one gate. Then add to it.",
      stretch: "Redesign the street for two person cards at once.",
      fewer: "On your own: draw both streets yourself, then ask someone at home or a friend to do the check in step 4. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    L30: {
      track: "live", mins: 30, team: "alone", years: [7, 9], group: "On your own, then pairs", kit: "A4 paper",
      title: "The journey to school, 2050",
      blurb: "Draw your journey to Arcadia today, then redesign it for 2050.",
      question: "How will we move through the cities of 2050?",
      from: "Dubai Future Week “How we’ll live” question 2. Topic: mobility and transport.",
      drop: "Dubai Metro has run without drivers since it opened in September 2009. In 2050, today’s Year 7s will be about 35.",
      example: "A journey strip is a row of boxes, one box for each part of the journey. Each box says four things: <b>time</b> · <b>how you travel</b> · <b>how it feels</b> · <b>cost to the planet</b> (how much pollution it makes). For example: “7:10 · car · sleepy, stuck in traffic · high: one car for one pupil.”",
      steps: [
        { m: 3, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the worked journey strip. Name the four things in each box." },
        { m: 5, who: "On your own", t: "Draw today’s journey", d: "Draw your last journey to school as a strip of boxes, one box for each part of the journey. Each box needs the time, how you travel, how it feels, and the cost to the planet." },
        { m: 10, who: "In pairs", t: "Redesign it for 2050", d: "Choose one journey from your pair. Draw a new strip underneath for the year 2050." },
        { m: 5, who: "Everyone", t: "Swap and check", d: "Swap strips with another pair, or show yours to someone who has not seen it. They check the 2050 strip with the checklist and write one comment on the back." },
        { m: 3, who: "In pairs", t: "Improve it", d: "Go back to your own strip. Use the comment to change one thing." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about how we will travel. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "Two journey strips on A4: now and 2050.",
      checklist: ["It works in August heat.", "It works for someone who can’t drive.", "It says whether it is faster, cleaner or kinder than today."],
      model: {
        intro: "A 2050 strip with three boxes:<br>“7:20 · walk four minutes to the neighbourhood stop · awake, chatting · none.”<br>“7:25 · shared electric shuttle with eleven others · calm, time to read · low.”<br>“7:45 · walk in through the shaded gate · ready for the day · none.”<br>The three checks are labelled:",
        marks: [
          "<b>August heat:</b> “The path to the stop is shaded the whole way, and the stop is cooled.”",
          "<b>Can’t drive:</b> “Nobody on the shuttle needs a licence, so my cousin, who is 12, can use it too.”",
          "<b>Faster, cleaner or kinder:</b> “Cleaner: one shuttle replaces twelve cars. Not faster: it takes five minutes longer than today, and I say so.”"
        ]
      },
      support: "Draw four empty boxes in a row. In each one write the four headings: time, travel, feels, planet.",
      stretch: "Whose job disappears in your 2050 journey, and what do they do instead?",
      rules: "Nobody comments on how anyone travels today. Comments are about the 2050 strip only.",
      fewer: "On your own: draw both strips yourself, then ask someone at home or a friend for the comment in step 4. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    L50: {
      track: "live", mins: 50, team: "group", years: [7, 11], group: "Groups of four", kit: "A3 paper, or two A4 sheets taped together, and pens in two colours", comp: "Years 7 to 11",
      title: "If I owned a city of the future",
      blurb: "Plan one Dubai neighbourhood for 2050. Test it with a problem. Then present it.",
      question: "What will an ordinary day feel like in the cities, homes and communities of the future?",
      from: "The Dubai Future Week schools workshop “If I Owned a City of the Future: Dubai Edition”, held at Emirates Towers from 18 November. The team roles are borrowed from 500 Future Minds. The big question is from the Dubai Media Office’s announcement of the week.",
      drop: "Dubai Future Week is bringing 500 people together to plan for possible futures. They include teachers, emergency workers, people who start businesses and people who design cities. Your group plays four of those roles.",
      example: "One block of a neighbourhood, with an “ordinary day” timeline for a 13-year-old: “6:45 the shutters open as it gets light · 7:20 walk to school along the shaded path · 3:15 football under the solar canopy (a roof of solar panels) · 6:00 dinner from the rooftop farm · 8:30 the street lights dim so you can see the stars.”",
      qLabel: "the guiding question",
      cards: {
        title: "The three questions your neighbourhood must answer",
        note: "",
        items: ["What will make future cities feel like home?", "How will we move through the cities of 2050?", "Can our homes take care of us?"]
      },
      cards3: {
        title: "The four roles",
        note: "",
        items: [
          { k: "ROLE", t: "Planner", d: "Designs the streets and spaces. Where do people walk, and is it shaded?" },
          { k: "ROLE", t: "Entrepreneur", d: "A person who starts new businesses. What new business does this neighbourhood need?" },
          { k: "ROLE", t: "Teacher", d: "Looks after learning. Where and how do children learn here?" },
          { k: "ROLE", t: "Responder", d: "An emergency worker, such as a paramedic or firefighter. How does help reach someone fast?" }
        ]
      },
      cards2: {
        title: "Stress-test cards",
        pick: true,
        note: "",
        items: ["A 50°C day", "A power cut", "10,000 new residents"]
      },
      steps: [
        { m: 4, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example timeline. Which part of that day would you most want?" },
        { m: 6, who: "In your group", t: "Choose your roles", d: "Each person chooses one role: planner, entrepreneur, teacher or responder. Together, pick one problem for your neighbourhood to solve: heat, getting around, or feeling at home. (You still answer all three questions.)" },
        { m: 15, who: "In your group", t: "Design the neighbourhood", d: ["Draw one neighbourhood on A3. Label the parts.", "Show where your map answers the three questions in the box above. Write HOME where it feels like home. Write MOVE where people travel. Write CARE where a home looks after people.", "Under the map, write a timeline of an ordinary day for one person who lives there."] },
        { m: 6, who: "In your group", t: "Stress test", d: "A stress test is a sudden problem that tests your design. One of you presses “Pick one for us” on the stress-test cards, once. Work out what stops working in your neighbourhood." },
        { m: 6, who: "In your group", t: "Fix it", d: "Change your map so the neighbourhood survives the stress test. Mark the change in a different colour. Then check your map with the checklist." },
        { m: 6, who: "With another group", t: "One-minute pitch", d: "A pitch is a short talk to persuade people. Present your neighbourhood in one minute to another group, or to anyone who has not seen it. Ask them to ask you one difficult question. Answer it." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about cities of the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "An A3 neighbourhood map with an ordinary-day timeline.",
      checklist: ["It answers all three questions: home, move and care.", "It survived the stress test.", "Every role’s idea is on the page."],
      model: {
        intro: "A labelled map of a neighbourhood built to solve heat. Each of the three questions is marked where the map answers it:",
        marks: [
          "<b>Home, move and care:</b> “Home: a shaded square in the middle where every path meets. Move: nobody lives more than five minutes’ walk from the shuttle stop. Care: each building has a cool room that neighbours can use.”",
          "<b>Stress test, power cut:</b> “Added in red: wind towers on the cool rooms, so they still work with no electricity.”",
          "<b>Every role:</b> “Planner: shaded paths. Entrepreneur: a repair café on the square. Teacher: an outdoor classroom under the canopy. Responder: one clear route wide enough for an ambulance.”"
        ]
      },
      support: "Answer your own role card’s question first, and put that answer on the map.",
      stretch: "Add what the city costs and who pays.",
      fewer: ["Three of you: one person takes two roles.", "Two of you: take two roles each.", "On your own: think about all four roles yourself. Then present to someone at home.", "Nobody to present to? Read it aloud. Then write one difficult question a visitor might ask, and answer it."]
    },

    /* ───────────── How we'll think ───────────── */

    T10: {
      track: "think", mins: 10, team: "alone", years: [7, 11], group: "On your own, then pairs", kit: "Paper",
      title: "Who decides what machines should decide?",
      blurb: "Sort six real decisions and write your own rule for when a machine may decide.",
      question: "Who decides what machines should decide?",
      from: "Dubai Future Week “How we’ll think” question 3. Topic: ethics and trust in AI.",
      drop: "Software already makes decisions, or helps to make them: which advert you see, which route a car takes, what a search shows first.",
      example: "“Marking my homework: the machine suggests, the teacher decides, because a teacher can ask me what I meant.”",
      cards: {
        title: "The six decision cards",
        note: "",
        items: ["1. Which song plays next", "2. Your exam grade", "3. Which patient a doctor sees first", "4. When a traffic light changes", "5. Who makes the football team", "6. When a driverless car brakes"]
      },
      steps: [
        { m: 1, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Who decides in the example, and why?" },
        { m: 3, who: "On your own", t: "Place the six cards", d: "Draw a line across your page. Label the left end “machine decides”, the middle “machine suggests, human decides” and the right end “human only”. Write each card’s number where it belongs." },
        { m: 3, who: "In pairs", t: "Explain one card, then write your rule", d: ["Find one card you put in different places. Each explain why.", "Then each write two sentences.", "Sentence 1: “A machine should only decide when… because…”", "Sentence 2: “If it goes wrong, … is responsible.”"] },
        { m: 1, who: "In pairs", t: "Check it", d: "Check your rule with the checklist. Tick each point it meets. Fix anything that is missing." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about machines and decisions. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "Two sentences on paper: “A machine should only decide when… because…” and “If it goes wrong, … is responsible.”",
      checklist: ["It gives a reason.", "It says who is responsible if it goes wrong.", "It gives a sensible answer for at least two of the six cards."],
      model: {
        plain: true, intro: "Two strong rules that disagree with each other:",
        marks: [
          "<b>Rule A:</b> “A machine should only decide when a mistake can be undone, because then a person can put it right. If it goes wrong, the company that built it is responsible.” It works for the next song, and for the football team, because the team can be changed next week.",
          "<b>Rule B:</b> “A machine should only decide when it is safer than a person and there is no time to ask, because waiting would cause harm. If it goes wrong, whoever switched it on is responsible.” It works for a braking car and for traffic lights.",
          "<b>Where they disagree:</b> the braking car. Rule A says no, because a crash can’t be undone. Rule B says yes."
        ]
      },
      support: "Place three cards instead of six: cards 1, 2 and 6.",
      stretch: "Invent a new decision card that your rule gives a bad answer for.",
      fewer: "On your own: place the cards, then write your two sentences. Ask someone to pick one card and test your rule on it. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    T20: {
      track: "think", mins: 20, team: "partner", years: [9, 11], group: "Pairs", kit: "Paper",
      title: "Prompt grandmaster",
      blurb: "Write instructions so exact that your partner, playing the machine, draws the hidden picture. (A grandmaster is a top-level expert.)",
      question: "How do people and machines work best together?", ownQ: true,
      from: "Named after the AI Grandmaster Challenge at Dubai Future Week on 18 November. There, 20 AI experts compete in live challenges to become AI Grandmaster. This activity is Arcadia’s own design.",
      drop: "A prompt is the instruction you give to an AI. An AI can’t see what is in your head. It only has your words. Strong prompts say the task, the details, what to leave out and what the result should look like.",
      example: "<b>Weak:</b> “Draw a flag.”<br><b>Strong:</b> “Draw a straight vertical line on the left of the page, about as long as your finger. Draw a rectangle on the right side of the line, touching its top half. Make the rectangle twice as wide as it is tall. Leave the rectangle empty. Do not draw a base, wind lines or a pattern.”",
      targets: true,
      steps: [
        { m: 2, who: "Everyone", t: "Read the fact and the example", d: ["Read “Know this first” and compare the weak and strong prompts. What did the strong one add?", "Choose who is the prompter (writes the instructions) and who is the machine (draws). The prompter is also the timekeeper."] },
        { m: 3, who: "Prompter", t: "Write version 1", d: ["Prompter: open this page on your own device. Do not let your partner see the screen.", "Tap a target to see it. Target A is the easiest.", "Write instructions for drawing it. Use shapes, sizes and positions only. Do not say what the picture is.", "Partner (the machine): do not open the targets."] },
        { m: 2, who: "Machine", t: "Draw exactly what it says", d: "Prompter: tap “Hide”. Partner (the machine): read the prompt and draw exactly what the words say. No guessing, no questions." },
        { m: 2, who: "Prompter", t: "Compare, without telling", d: "Prompter: look at the target again. Do not let your partner see. Compare it with the drawing. What was missing from your prompt? Do not tell your partner." },
        { m: 3, who: "Prompter", t: "Write version 2", d: "Prompter: rewrite the prompt to fix what went wrong. Circle everything you changed. Partner (the machine), while you wait: write down what made version 1 hard to follow." },
        { m: 2, who: "Machine", t: "Redraw", d: "Prompter: tap “Hide” again. Partner (the machine): draw again from version 2 only, on a fresh piece of paper." },
        { m: 2, who: "In pairs", t: "Score it", d: "Now both look at the target. Score version 2 with the checklist, one point for each. Is the second drawing closer than the first?" },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about giving instructions to a machine. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "Prompt version 1 and version 2 on paper, with what changed circled.",
      checklist: ["One instruction in each sentence.", "It says size and position.", "It says what to leave out."],
      model: {
        plain: true,
        intro: "A grandmaster-level prompt for each target. Read the one for the picture you used:",
        marks: [
          "<b>Target A:</b> “Draw a tall, thin rectangle standing in the middle of the page, about as tall as your hand. Draw a second rectangle sitting on top of it, a little wider and a little less than half as tall. Inside the top rectangle, draw four short vertical lines, evenly spaced. Draw one horizontal line under the tall rectangle, touching its bottom edge and wider than the whole shape. Do not add doors, windows or people.”",
          "<b>Target B:</b> “Draw a large oval lying on its side in the centre of the page, about as wide as your hand. Draw a smaller oval inside it, the same shape, so the gap between them is about one finger wide all the way round. Draw one straight horizontal line under the large oval, a little wider than it and touching its lowest point. Leave the middle empty. Do not add windows, doors or shading.”",
          "<b>Target C:</b> “Near the top of the page, draw a rectangle that is wider than it is tall. Inside it, draw two small circles side by side. From the middle of its top edge, draw a short vertical line upwards with a small circle on the end. Just below the first rectangle, leaving a small gap, draw a bigger rectangle that is wider than the first. Draw one short horizontal line out from each side of the bigger rectangle, near its top. Draw two vertical lines down from its bottom edge. Do not draw a mouth, hands or feet.”"
        ]
      },
      support: "Use the word bank: above, below, left, right, centre, inside, touching, half as wide, twice as tall, circle, oval, square, rectangle, straight line.",
      stretch: "Optional. After you have scored version 2, type it into Gemini or the AI tool you normally use. Ask it to draw the picture. Compare its drawing with the target.",
      fewer: "Three of you: one prompter and two machines. More than three: work in pairs, each with a different target. On your own: ask someone at home to be the machine."
    },

    T30: {
      track: "think", mins: 30, team: "alone", years: [7, 9], group: "On your own, then pairs", kit: "Paper",
      title: "Catch the confident mistake",
      blurb: "Find three errors hidden in a paragraph that sounds completely sure of itself.",
      question: "How do we stay curious in an age of answers?",
      from: "Dubai Future Week “How we’ll think” question 2. Topic: knowledge and information.",
      drop: "AI chatbots write smooth, confident answers whether they are right or wrong. Sounding sure is not the same as being right.",
      example: "“Dubai Metro opened in 1999 and has always been driverless.” A claim is something said as a fact. The three-step check:<br><b>1</b> Underline each claim you could check: the year, and “driverless”.<br><b>2</b> Ask where you would look: the Dubai transport website.<br><b>3</b> Check it. The Metro opened in 2009, so the year is wrong.",
      paragraph: true,
      steps: [
        { m: 3, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Name the three steps of the check." },
        { m: 6, who: "On your own", t: "Find three hidden errors", d: ["Read the paragraph about the UAE’s Hope probe. (A probe is a spacecraft with no people on board.)", "Three facts in the paragraph are wrong. They were hidden on purpose.", "Do not look anything up yet.", "Copy down the three claims you most want to check."] },
        { m: 4, who: "In pairs", t: "How would you check?", d: "Compare your three. For each one, write where you would look to check it." },
        { m: 8, who: "In pairs", t: "Question storm", d: "Write ten questions the paragraph makes you want to ask. Put a star next to one question you could look up. Put a star next to one question nobody can answer yet." },
        { m: 4, who: "In pairs", t: "Reveal, then check", d: "Now tap “Underline the errors” under the paragraph. How many did you catch? Then check your own work with the checklist." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about answers that sound confident. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "The three claims you think are wrong, each with a way to check it, and two starred questions.",
      checklist: ["Each claim you chose has a way to check it.", "Ten questions are written.", "One starred question can be looked up. One has no answer yet."],
      model: {
        plain: true,
        intro: "The three hidden errors, corrected. You could check each one on the website of the Mohammed bin Rashid Space Centre, which runs the mission.",
        marks: [
          "<b>“Blasted off from a launch pad in the UAE”</b> is wrong. Hope launched from the Tanegashima Space Center in Japan, on a Japanese H-IIA rocket.",
          "<b>“Landed safely on the surface of Mars”</b> is wrong. Hope is an orbiter, a spacecraft that circles a planet. It entered orbit around Mars on 9 February 2021 and has never landed.",
          "<b>“Five scientific instruments”</b> is wrong. Hope carries three: a camera, an infrared spectrometer and an ultraviolet spectrometer."
        ],
        after: "Everything else in the paragraph is true: the launch in July 2020, the journey of about 493 million kilometres in about seven months, the first mission to another planet by an Arab nation, and the study of Mars’s atmosphere and weather. A strong starred pair of questions: “How far is Mars from the Sun?” (you could look it up) and “Will people ever live on Mars?” (nobody can answer yet)."
      },
      support: "Look at the places and the numbers first. Those are the easiest claims to check.",
      stretch: "Write your own paragraph with one hidden error for a partner to find.",
      fewer: "On your own: do steps 3 and 4 by yourself."
    },

    T50: {
      track: "think", mins: 50, team: "group", years: [7, 11], group: "Groups of four", kit: "A3 paper, or two A4 sheets taped together, and pens in two colours", comp: "Years 7 to 11",
      title: "School when AI knows everything",
      blurb: "Design one school day at Arcadia in 2040, and say who does the thinking.",
      question: "What will learning look like when AI knows everything?",
      from: "Dubai Future Week “How we’ll think” question 1. The Dubai Media Office says this theme is about curiosity, judgement, memory and creativity.",
      drop: "An AI can give you an answer. It cannot learn for you. You think better about a topic when you already know some facts about it.",
      example: "One period from a 2040 Arcadia timetable. “Period 3, Science. <b>Pupil:</b> predicts what would happen to a plant on Mars, then argues about it with a partner. <b>AI:</b> checks the facts each pupil recalled from memory and sets each one a different follow-up question. <b>Teacher:</b> listens, picks the two best disagreements and runs the debate.”",
      steps: [
        { m: 4, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example period. Who is doing the thinking in it?" },
        { m: 6, who: "In your group", t: "Sort a school day", d: "List what you did in your last full day at school. Sort it into two columns: “AI could already do this” and “This needs a human”." },
        { m: 15, who: "In your group", t: "Design one day in 2040", d: ["Draw a one-day timetable on A3 for a Year 9 pupil at Arcadia in 2040.", "Your day must include a time for each of four things: curiosity (wanting to find out), judgement (deciding what is right or best), memory and creativity.", "Under each period, write one line: who does the thinking?", "Keep one thing from school today, and write why."] },
        { m: 6, who: "In your group", t: "The head teacher’s question", d: "Imagine the head teacher reads your timetable and asks: “How will you know the pupils learned anything?” Work out your answer." },
        { m: 6, who: "In your group", t: "Fix it", d: "Change your timetable so it answers the head teacher’s question. Mark the change in a different colour. Then check it with the checklist." },
        { m: 6, who: "With another group", t: "Pitch it", d: "A pitch is a short talk to persuade people. Present your school day in one minute to another group, or to anyone who has not seen it. Ask them to ask you one difficult question. Answer it." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about school and AI. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A one-day timetable on A3, with a line under each period saying who does the thinking.",
      checklist: ["It has a time for each of the four: curiosity, judgement, memory and creativity.", "It answers the head teacher’s question.", "It keeps one thing from school today, and says why."],
      model: {
        intro: "An annotated 2040 day with five periods:",
        marks: [
          "<b>All four words:</b> “Period 1: memory quiz, no devices (memory). Period 2: maths. The AI tutor sets each pupil their next problem. Pupils explain their method to a partner (judgement). Period 3: wonder hour. Pupils work on their own question (curiosity). Period 4: design studio. Build something new (creativity). Period 5: sport.”",
          "<b>The head teacher’s question:</b> “Added in red: every Friday, pupils answer questions out loud with no AI, so the teacher hears what they actually know.”",
          "<b>What it keeps:</b> “The teacher at the front for part of every lesson, because a person notices when you are confused before you say so.”"
        ]
      },
      support: "Draw a grid with five periods. Under each one write “Who does the thinking?” and answer that first.",
      stretch: "Write Arcadia’s school rule on AI use for 2040.",
      fewer: ["Two of you: do every step together. One of you pitches. The other plays a visitor and asks one difficult question.", "On your own: pitch to someone at home. Nobody there? Read it aloud. Then write one difficult question a visitor might ask, and answer it."]
    },

    /* ───────────── How we'll innovate ───────────── */

    I10: {
      track: "innovate", mins: 10, team: "alone", years: [9, 11], group: "On your own, then pairs", kit: "Paper",
      title: "Ten technologies for the next ten years",
      blurb: "Ten new technologies. Pick the one that matters most for the UAE.",
      question: "Which discoveries will define the next decade?",
      from: "Dubai Future Week “How we’ll innovate” question 2. The cards come from the Top 10 Emerging Technologies of 2026, a World Economic Forum report produced with Frontiers, with the Dubai Future Foundation helping to choose the list.",
      drop: "Every year a World Economic Forum report names ten new technologies that could soon change everyday life. The Dubai Future Foundation helped to choose the 2026 list.",
      example: "“I pick passive radiative cooling materials for the UAE. In summer, air conditioning is one of the biggest uses of electricity in our homes and buildings. The people who are helped first are those who work outdoors or live without good cooling.”",
      cards: {
        title: "The ten technology cards",
        note: "",
        items: [
          { k: "1", t: "Everything-to-grid energy", d: "Electric cars and buildings store electricity. They send it back to the power grid (the network that carries electricity) when it is needed." },
          { k: "2", t: "Direct lithium extraction", d: "Pulling the lithium for batteries out of salty water in hours, not waiting months for ponds to dry out." },
          { k: "3", t: "Passive radiative cooling materials", d: "Paints, films and tiles that reflect sunlight and send heat out to space, cooling a surface with no electricity." },
          { k: "4", t: "PFAS destruction", d: "“Forever chemicals” do not break down in nature. These are ways to break them apart completely, not just filter them out of water." },
          { k: "5", t: "Precision fermentation", d: "Microbes are tiny living things. In tanks, they are changed so that they make chosen ingredients for food and medicine." },
          { k: "6", t: "Exosome drug delivery", d: "Using tiny natural parcels made by our own cells to carry medicine to the cells that need it." },
          { k: "7", t: "Personalised mRNA cancer vaccines", d: "A vaccine made for one patient that trains their body’s defences to find and attack their own tumour." },
          { k: "8", t: "Quantum simulation for drug discovery", d: "Using a quantum computer (a new, very powerful kind of computer) to test how possible medicines behave, so the best ones are found faster." },
          { k: "9", t: "World models in AI", d: "AI that learns how the physical world behaves from video and sensors, so it can predict what happens next." },
          { k: "10", t: "Lattice-based cryptography", d: "New maths-based codes designed to keep data safe, even from future quantum computers." }
        ]
      },
      steps: [
        { m: 1, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Notice it names a technology and a real UAE problem." },
        { m: 3, who: "On your own", t: "Pick your three", d: "Read the ten cards. Write down the three that matter most for the UAE." },
        { m: 3, who: "In pairs", t: "Agree on one", d: "Compare lists and agree on one technology. Write a card together: “We pick… because… The people who are helped first are…”" },
        { m: 1, who: "In pairs", t: "Check it", d: "Check your card with the checklist. Tick each point it meets. Fix anything that is missing." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about which discoveries matter. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "One “We pick… because…” card.",
      checklist: ["It names the technology correctly.", "It links it to a real UAE problem.", "It says who is helped first."],
      model: {
        plain: true,
        intro: "Two model cards that picked different technologies:",
        marks: [
          "<b>Pair A:</b> “We pick everything-to-grid energy, because the UAE has strong sunshine by day but uses a lot of electricity in the evening. Electricity stored in car batteries could be sent back when it is needed. Families with electric cars and solar panels are helped first.”",
          "<b>Pair B:</b> “We pick lattice-based cryptography, because Dubai now makes about nine in every ten payments without cash, so keeping payment data safe matters more each year. Anyone who pays by phone or card is helped first.”",
          "<b>Notice:</b> both name the technology exactly as the card does, both link it to something true about the UAE, and both say who is helped first."
        ]
      },
      support: "Too many cards? Use cards 1 to 5 only.",
      stretch: "Which of the ten could go wrong, and how?",
      fewer: "On your own: pick your three, choose one, and write the card yourself."
    },

    I20: {
      track: "innovate", mins: 20, team: "partner", years: [9, 11], group: "Teams of two to four", kit: "Paper",
      title: "How fast is too fast?",
      blurb: "Driverless taxis are coming to Arcadia’s gate. Write the rules and choose how fast to bring them in.",
      question: "How fast is too fast for innovation?",
      from: "Dubai Future Week “How we’ll innovate” question 3, The Policy Room, and the Big Stage session “How Do We Legislate the Unknown?” on 20 November.",
      drop: "Dubai’s target is for one in every four transport trips to be driverless by 2030. Rules usually arrive after the technology does.",
      example: "One rule for delivery drones: “No flights over school grounds between 7am and 4pm.” It protects a named group, pupils, at a named time.",
      steps: [
        { m: 2, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example rule. Who does that rule protect?" },
        { m: 4, who: "In your team", t: "Who gains, who could be hurt?", d: "Driverless taxis start picking up at Arcadia’s gate. Draw two columns: who it helps, and who could be hurt." },
        { m: 6, who: "In your team", t: "Write three rules and choose the pace", d: ["You are a policy team: a team that writes rules.", "Write three rules for the taxis on one sheet. This is your policy card.", "Choose your pace: how fast to bring the taxis in. Ban, trial (test them first) or go.", "Say why."] },
        { m: 4, who: "With another team", t: "Meet the unknown", d: ["Swap cards with another team, or give yours to someone who has not seen it.", "They play “the unknown”: they find one problem your rules did not think of.", "Take your card back. Add a fix for that problem.", "Check your card with the checklist."] },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about how fast new technology should arrive. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A policy card: three rules, a pace and one fix.",
      checklist: ["Each rule protects a named person.", "You say why you chose your pace.", "You added a fix for the problem the other team found."],
      model: {
        intro: "A policy card that chose “trial”, with conditions:",
        marks: [
          "<b>Three rules, each for a named person:</b> “1. Taxis stop only in the marked bay, to protect pupils crossing. 2. Maximum 15 km/h within 200 metres of the gate, to protect younger children. 3. Every taxi has a button that calls a human operator, to protect a passenger who needs help.”",
          "<b>Why this pace:</b> “Trial: six taxis for one term, because we don’t yet know how they behave at 3pm when the road is busiest.”",
          "<b>The fix:</b> “The other team asked: what happens in a sandstorm? Added rule: taxis stop running when drivers cannot see 100 metres ahead.”"
        ]
      },
      support: "Use the rule starters: “Nobody may…”, “Every… must…”, “Between… and…, taxis must…”",
      stretch: "Who should make sure people follow your rules?",
      rules: "This is about how to bring in new technology safely, not about whether Dubai’s plan is right.",
      fewer: "Just two of you: you are one team. Ask a friend or someone at home to play “the unknown”. Nobody else around? Each of you, on your own, writes one problem the rules did not think of. Swap, and fix both."
    },

    I30: {
      track: "innovate", mins: 30, team: "partner", years: [7, 9], group: "Pairs", kit: "Paper, scissors and tape", comp: "Years 7 to 9",
      title: "Prototype for humanity",
      blurb: "Build a paper prototype for one real person, then let someone else test it.",
      question: "What will humans make next?",
      from: "Dubai Future Week “How we’ll innovate” question 1, and The Prototype Floor.",
      drop: "A prototype is a rough first version built to be tested, not to look good. Its job is to show you what is wrong.",
      example: "A paper sun visor (a cap with no top) for a lifeguard. The test showed one thing: it blew off as soon as she turned her head. So version 2 has a chin strap.",
      cards: {
        title: "The three person cards",
        note: "",
        items: ["A gardener working outside in the heat", "A new Year 7 lost on campus", "An astronaut growing food on a Mars mission"]
      },
      steps: [
        { m: 3, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. What did the test show that the maker had missed?" },
        { m: 4, who: "In pairs", t: "Pick a person and a problem", d: "Choose one person card. Write down one problem that person has, and sketch one thing that could help." },
        { m: 12, who: "In pairs", t: "Build it from paper", d: "Build a rough version from paper, scissors and tape. It only has to be good enough to test." },
        { m: 5, who: "With a tester", t: "Silent test", d: ["Find a tester: someone who has not seen it. In a room of pairs, swap with the pair next to you.", "Tell them only who it is for.", "Stay silent. Do not explain. Watch them try to use it.", "Write down what goes wrong.", "Then test theirs."] },
        { m: 2, who: "In pairs", t: "Fix one thing", d: "Change one thing the test showed you. Write a label: who it is for, and what the test showed." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about making things. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A paper prototype with a label: who it is for, and what the test showed.",
      checklist: ["It is made for a named person.", "Someone else tested it.", "One change was made after the test."],
      model: {
        intro: "A prototype before and after its test:",
        marks: [
          "<b>Named person:</b> “For a new Year 7 lost on campus: a folded pocket map of Arcadia.”",
          "<b>The test:</b> “Another pair tried to find the science labs with it. They held it upside down and couldn’t tell where they were standing.”",
          "<b>The change:</b> “Version 2 has a ‘You are here’ arrow at the main gate and a coloured line along each corridor.”"
        ]
      },
      support: "Cut three simple shapes first: a long strip, a loop and a flap. Tape them together and see what they could become.",
      stretch: "What would version 3 need that paper can’t do?",
      fewer: "On your own: build it yourself, then ask someone at home to be the tester in step 4. Just two of you: build one prototype each. Do not show each other. Then test each other’s."
    },

    I50: {
      track: "innovate", mins: 50, team: "group", years: [9, 11], group: "Three teams (six or more people)", kit: "Paper", comp: "Years 9 to 11",
      title: "The Future Generations Trial",
      blurb: "Put a policy on trial. The people of 2050 argue against it.",
      question: "What future did you promise us?",
      from: "“The Future Generations Trial: What Future Did You Promise Us?” at Dubai Future Week on 20 November. In this pretend courtroom, young people speak for future generations, leaders defend today’s decisions, and a jury of different ages decides.",
      drop: "People in 2050 will still live with the decisions we make today. In this courtroom, the people of 2050 can reply.",
      example: "A different policy, to show how each side argues: “Schools may replace PE lessons with extra computer lessons.” <b>Prosecution (the side against the policy), speaking from 2050:</b> “In 2050 this means adults who sat still through eleven years of school. You gave us more screen time and took away the habit of moving.” <b>Defence (the side for it), speaking today:</b> “By 2050 most jobs need digital skills. Pupils who had more time to learn them are better prepared, and they can still play sport after school.”",
      cards: {
        title: "The policy on trial",
        pick: true,
        note: "",
        items: ["“AI may be used for all homework.”", "“Delivery robots may use every pavement in Dubai.”"]
      },
      cards2: {
        title: "Courtroom words",
        note: "",
        items: [{"k": "WORD", "t": "Policy", "d": "A rule made by leaders."}, {"k": "WORD", "t": "Judge", "d": "The person in charge of the court. Here, the judge is also the timekeeper."}, {"k": "WORD", "t": "Prosecution", "d": "The side that says the policy is wrong."}, {"k": "WORD", "t": "Defence", "d": "The side that says the policy is right."}, {"k": "WORD", "t": "Jury", "d": "The group that listens and decides."}, {"k": "WORD", "t": "Verdict", "d": "The jury’s decision."}, {"k": "WORD", "t": "Amendment", "d": "A change that makes the policy better."}]
      },
      steps: [
        { m: 4, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first”, the two example arguments and the courtroom words. Which side is speaking from 2050?" },
        { m: 3, who: "Everyone", t: "Take your roles", d: ["One person presses “Pick one for us” once and reads the policy out.", "Count 1, 2, 3 round the room. 1s are the prosecution: the people of 2050. 2s are the defence: today’s decision-makers. 3s are the jury.", "The jury chooses one judge. The judge is the timekeeper from now on.", "The judge times each speech with a stopwatch on a second device."] },
        { m: 12, who: "In your team", t: "Prepare the case", d: ["Prosecution: split into two halves. Defence: do the same.", "Each half plans one two-minute speech and chooses its speaker.", "Use evidence in each speech: a real example you have seen, or a fact from this page.", "Jury: write three questions for each side."] },
        { m: 10, who: "Everyone", t: "The speeches", d: "The judge calls two speeches from each side, taking turns, prosecution first. About two minutes each." },
        { m: 6, who: "Everyone", t: "Jury questions", d: "The jury questions both sides. Anyone on that team may answer. The judge keeps it fair." },
        { m: 8, who: "Everyone", t: "Verdict and amendment", d: ["The jury votes: is this policy fair to the people of 2050, yes or no?", "The judge counts hands. If the votes are equal, the judge decides.", "The jury gives its reasons. It writes one amendment that would make the policy still fair in 2050.", "Everyone writes three headings and fills them in: Decision. Strongest argument. Amendment.", "Check yours with the checklist."] },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about decisions that last. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A verdict sheet: the decision, the strongest argument heard, and the amendment. Each person can enter their own sheet.",
      checklist: ["Both sides used evidence.", "The jury gave reasons.", "The amendment would change something by 2050."],
      model: {
        intro: "A completed verdict sheet for the example policy, “Schools may replace PE lessons with extra computer lessons”:",
        marks: [
          "<b>Strongest argument from each side:</b> “Prosecution: habits you build as a child are the ones you keep as an adult. Defence: most jobs already need digital skills, and that will only grow.”",
          "<b>Decision, with reasons:</b> “Not fair to 2050 as written. The word ‘replace’ is the problem: it swaps health for skills, when the adults of 2050 will need both.”",
          "<b>The amendment:</b> “Schools may add computer lessons only if PE time stays the same. By 2050 that means adults who have the skills and still have the habit of moving.”"
        ]
      },
      support: "Use the argument frames: “In 2050 this means…”, “The evidence for this is…”, “The other side forgot that…”",
      stretch: "The side that lost can ask for a second trial. Write their reasons.",
      rules: ["These policies are invented. Argue about the policy, not about real leaders or authorities.", "You are playing a role. You may be arguing a side you don’t agree with.", "Disagree with the argument, never with the person.", "No interrupting. The judge can stop a speaker."],
      fewer: ["Three to five of you: one prosecutor, one defender, and everyone else is the jury.", "One speech each side, three minutes each.", "You can use people at home as your jury."]
    },

    /* ───────────── How we'll feel ───────────── */

    F10: {
      track: "feel", mins: 10, team: "alone", years: [7, 11], group: "Everyone, then pairs", kit: "Paper",
      title: "Can technology make us happier?",
      blurb: "Sort six everyday technologies and write the rule for when they help.",
      question: "Can technology make us happier?",
      from: "Dubai Future Week “How we’ll feel” question 3. The check-in copies “Are You Well?”, a wellbeing check-in at the event.",
      drop: "The same app can connect you or leave you out. What matters is how it is used, who you use it with, and for how long.",
      example: "“Video calls: happier, when it’s my cousins abroad. It depends on who and why.”",
      cards: {
        title: "The six technology cards",
        note: "",
        items: ["Group chat", "Step counter", "Video feed that never ends", "Family video call", "Gaming with friends", "Sleep tracker"]
      },
      steps: [
        { m: 1, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. What does the answer depend on?" },
        { m: 2, who: "Everyone", t: "Check-in", d: ["Think about yesterday. After using technology, how did you feel? 1 = tired, 5 = full of energy.", "Write your number on a small piece of paper. No names.", "Fold it and put it in a pile.", "One person reads the numbers out. In a big room, read only ten.", "Are they mostly high or mostly low?"] },
        { m: 3, who: "In pairs", t: "Sort the six cards", d: "Write each of the six cards under one of three headings: happier, depends, less happy. Say why for each." },
        { m: 2, who: "On your own", t: "Write your rule, then check it", d: "Write one rule: “Technology makes us happier when…” Check it with the checklist." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about technology and happiness. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "One rule on paper: “Technology makes us happier when…”",
      checklist: ["It uses a real example.", "It says what it depends on.", "A younger pupil could follow it."],
      model: {
        plain: true, intro: "Three rules from different points of view:",
        marks: [
          "<b>From a pupil:</b> “Technology makes us happier when it brings me closer to people I already care about, like gaming with my friends on a Friday. It depends on whether I stop when they do.”",
          "<b>From a parent:</b> “Technology makes us happier when it gives us time back, like a video call instead of a two-hour drive. It depends on what we do with the time.”",
          "<b>From a grandparent:</b> “Technology makes us happier when I choose it and it doesn’t choose me. A family call, yes. A feed that never ends, no.”"
        ]
      },
      support: "Sort three cards instead of six: family video call, video feed that never ends, group chat.",
      stretch: "Design the feature that would move one card to “happier”.",
      rules: ["This is about technology, not private feelings. Nobody has to explain their number.", "Don’t ask who uses which app or for how long.", "If something online is upsetting you, tell your tutor or another adult you trust."],
      fewer: "Two or three of you: write your number and keep it to yourself. On your own: write your number, then sort the cards and write your rule. Ask someone to check the rule with the checklist. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    F20: {
      track: "feel", mins: 20, team: "alone", years: [9, 11], group: "Everyone, then on your own", kit: "Paper",
      title: "Live to 150?",
      blurb: "Could we, and should we? Choose a corner, argue it, then write your verdict (your final decision).",
      question: "Will we live to 150, and should we?",
      from: "Dubai Future Week “How we’ll feel” question 2. Topic: living longer and staying healthy.",
      drop: "The oldest person ever, with an age that was checked and proved, was Jeanne Calment of France. She lived to 122. “Could we?” is a science question. “Should we?” is a question about fairness, family and the planet.",
      example: "The first two sentences of a verdict, a claim and then a reason: “I don’t think most of us will reach 150, and I’m not sure we should try. The longest life ever checked and proved is 122, and nobody has reached 120 since.”",
      cards: {
        title: "The four corners",
        note: "",
        items: ["Yes, for everyone", "Yes, if we stay healthy", "Only if it is fair", "No"]
      },
      steps: [
        { m: 2, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Which sentence is the claim, and which is the reason?" },
        { m: 3, who: "On your own", t: "One hope, one worry", d: "Write one hope and one worry about a world where people live to 150." },
        { m: 6, who: "Everyone", t: "Four corners", d: ["One person reads out the four corners and points to a corner of the room for each.", "Stand in the corner that matches your view.", "Each corner chooses one speaker, who has 30 seconds. If a corner is empty, anyone may argue for it.", "Move if you are persuaded."] },
        { m: 5, who: "On your own", t: "Write your verdict", d: "Write four sentences: your claim, your reason, the best argument against you, and your condition (“only if…”). Check it with the checklist." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about living longer. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A four-sentence verdict on paper.",
      checklist: ["It answers both halves: will we, and should we.", "It includes the argument against.", "It states a condition (“only if…”)."],
      model: {
        plain: true, intro: "Two full verdicts that disagree. Each one meets all three checks:",
        marks: [
          "<b>Verdict A:</b> “I don’t think most of us will reach 150, and I don’t think we should aim to. The longest proved life is 122, and extra years are only worth having if they are healthy ones. The best argument against me is that medicine has surprised us before. My condition: put the effort into more healthy years, not just more years.”",
          "<b>Verdict B:</b> “I think some people may one day live to 150, and we should try. More years means more time with family and more time to put things right. The best argument against me is that only the rich might get them. My condition: it has to be available to everyone, or to no one.”",
          "<b>Notice:</b> both answer “will we” and “should we” separately, both name the argument against, and both end with a condition."
        ]
      },
      support: "Use the sentence frames: “I think we will / won’t… and we should / shouldn’t…”, “My reason is…”, “The best argument against me is…”, “My condition is…”",
      stretch: "What changes at school, at work and at home if living to 150 is normal?",
      rules: ["Nobody has to share a personal story.", "Answers that come from faith are welcome and are not debated.", "If this topic is hard for you today, choose a different activity.", "If it brings up something upsetting, talk to your tutor or another adult you trust."],
      fewer: "Fewer than eight of you, or on your own: skip the standing. Write the best argument for each of the four corners, then choose yours."
    },

    F30: {
      track: "feel", mins: 30, team: "alone", years: [7, 11], group: "Everyone, then on your own", kit: "A4 paper", comp: "Years 7 to 11",
      title: "Lunch in 2050",
      blurb: "Vote on four future foods, then design the Arcadia canteen tray of 2050.",
      question: "What does it mean to be well in 2050?",
      from: "Dubai Future Week “How we’ll feel” question 1. Topic: food and nutrition. The Dubai Media Office says this theme includes vertical farming and lab-grown proteins. New food companies also present their ideas during the week.",
      drop: "Microbes are tiny living things, such as yeast. In precision fermentation, scientists change microbes so that they make one chosen ingredient, for example the proteins found in milk. No animal is needed. It is on a 2026 list of ten important new technologies.",
      example: "One item on a 2050 Arcadia canteen tray, with its label: “Salad leaves. Grown in a vertical farm in Dubai (a building where plants grow indoors on stacked shelves). On the tray because they were picked this morning.”",
      cards: {
        title: "Four foods to vote on",
        note: "",
        items: ["Salad from a vertical farm", "Milk protein made by fermentation", "Cultivated meat, grown from cells", "Flour made from insects"]
      },
      steps: [
        { m: 3, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example label. What three things does the label tell you?" },
        { m: 5, who: "Everyone", t: "Would Dubai eat it?", d: "One person reads out each of the four foods. Hands up: would most people in Dubai eat this in 2050? After each vote, hear one reason for yes and one for no." },
        { m: 12, who: "On your own", t: "Design the tray", d: "Draw a 2050 Arcadia lunch tray on A4. Label every item: what it is, where it was grown or made, and why it’s on the tray." },
        { m: 4, who: "In pairs", t: "Swap and check", d: "Swap trays. Check your partner’s with the checklist and tell them one thing to improve." },
        { m: 2, who: "On your own", t: "Improve it", d: "Use the feedback to change one thing on your tray." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about the food of the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A labelled tray drawing on A4.",
      checklist: ["Every item says where it came from.", "At least one food is grown within the UAE.", "It works for classmates with different food rules, such as halal, vegetarian or an allergy."],
      model: {
        intro: "A full labelled tray with four items:",
        marks: [
          "<b>Where it came from:</b> “Tomatoes: rooftop greenhouse at Arcadia. Wrap filling: cultivated chicken, grown from cells in a food factory in Abu Dhabi. Yoghurt: milk protein made by fermentation in a factory in Dubai. Dates: palm grove, Al Ain.”",
          "<b>Grown in the UAE:</b> “The tomatoes and the dates. Both were grown inside the UAE.”",
          "<b>Different food rules:</b> “The wrap comes with a falafel filling too, and every label shows whether the food is halal, vegetarian and nut-free, so each classmate can choose.”"
        ]
      },
      support: "Draw a tray with four empty spaces and a label line under each. Fill one space at a time.",
      stretch: "Give your tray a price. Say who can afford it.",
      rules: ["Judge trays on where the food comes from, the planet, taste and culture.", "Do not count calories. Do not comment on bodies.", "Faith, family and allergy are all good reasons. Nobody has to explain a no.", "Don’t argue about whether a food is halal. Religious scholars are still deciding."],
      fewer: "On your own: for each of the four foods, write one reason for yes and one for no. Then ask someone to check your tray in step 4. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    F50: {
      track: "feel", mins: 50, team: "partner", years: [7, 9], group: "Pairs, in three test groups", kit: "30 cm rulers, graph or squared paper, and a calculator (your device has one)",
      title: "The focus lab",
      blurb: "Run a real experiment: does movement or calm breathing make your reactions faster?",
      question: "What helps a human perform at their best?", ownQ: true,
      from: "Dubai Future Week “How we’ll feel” topics: sport and human performance, and mental health. The event also has movement sessions.",
      drop: "Reaction time is how long your brain and body take to respond. You can measure it with a falling ruler. If you react slowly, the ruler falls a long way before you catch it. If you react quickly, it falls only a short way. So a smaller number means a faster reaction.",
      example: "One pupil’s five catches: 18 cm, 21 cm, 16 cm, <b>34 cm</b>, 19 cm. The 34 is the odd one out, and she knows why: she looked away. Circle it and leave it out. The mean is the average. Mean = (18 + 21 + 16 + 19) ÷ 4 = 74 ÷ 4 = <b>18.5 cm</b>. Only leave a catch out if you know what went wrong.",
      steps: [
        { m: 4, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the worked example. Why is the 34 cm catch left out of the mean?" },
        { m: 5, who: "In pairs", t: "First test: five ruler drops", d: ["Hold the ruler at the top so it hangs straight down.", "Your partner holds an open finger and thumb at the 0 cm end. They must not touch the ruler.", "Let go without warning.", "Your partner catches it. Read the number just above their thumb.", "If they miss, drop it again.", "Take turns until you each have five catches.", "Each work out your mean. Check your partner’s."] },
        { m: 3, who: "Everyone", t: "Get your group", d: ["Stay in your pairs. The timekeeper also types the results, and does the test too.", "Count the pairs 1, 2, 3 round the room.", "Pairs numbered 1 are the movement group: jog on the spot.", "Pairs numbered 2 are the breathing group: sit and breathe in for a count of 4 and out for a count of 6.", "Pairs numbered 3 are the still group: sit still and silent. This is the control: the group that changes nothing, so we can compare."] },
        { m: 8, who: "In pairs", t: "Do it, then test again", d: ["The timekeeper starts this step’s timer and says “go”.", "Everyone does their activity for 2 minutes.", "The timer counts down. When it shows 6:00, the timekeeper says “stop”.", "Straight away, do the ruler drop again. Take turns, one drop each.", "Stop when you both have five new catches.", "Work out your new mean."] },
        { m: 10, who: "Everyone", t: "Shared results", d: ["The results table is below the steps. Timekeeper: if old results are showing, press “Clear all”.", "Start with the movement group. One person from each pair reads out four numbers: each partner’s mean before and mean after.", "Timekeeper: choose “Movement” in the table, type each person’s two numbers and press “Add result”.", "Do the same for the breathing group, then the still group.", "Timekeeper: read out the mean change for each of the three groups. Everyone writes them down.", "Draw a bar chart with one bar for each group. If a group got slower, its bar goes below zero."] },
        { m: 8, who: "On your own", t: "Write your conclusion", d: "What changed, and by how much? Was it a fair test? Use numbers from the results table, then check your conclusion with the checklist." },
        { m: 5, who: "In pairs", t: "Tip card", d: "Write one tip for Arcadia pupils about reacting quickly, based on what the results showed. Add one thing the data cannot tell us." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about focus. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "Your results, a bar chart, a conclusion and a tip card.",
      checklist: ["Your mean is correct. Your partner has checked it.", "The conclusion uses the numbers.", "It names one thing that made the test unfair."],
      model: {
        intro: "A model conclusion. The numbers here are made up to show the method. Use your own group’s results.",
        marks: [
          "<b>Means:</b> “Movement group after: three pupils’ means were 17.5, 16.8 and 17.0 cm, so the mean is 51.3 ÷ 3 = 17.1 cm. Movement group: 19.2 cm before, 17.1 cm after. Breathing group: 19.5 cm before, 18.6 cm after. Still group: 19.0 cm before, 18.4 cm after.”",
          "<b>Uses the numbers:</b> “All three groups got faster, even the still group. So some of the change is just practice. Movement improved most: 2.1 cm, compared with 0.6 cm for the still group. But one person’s catches can differ by more than 2 cm. So we cannot be sure that movement caused it.”",
          "<b>Not a fair test:</b> “There were different people in each group, and everyone had practised by the second test. To be fairer, every pupil should try all three on different days.”"
        ]
      },
      support: "Draw your axes first: the three groups along the bottom, and mean change in cm up the side, from −3 to +3.",
      stretch: "Design a fairer experiment. Say what you would change.",
      rules: ["Do this indoors, in a clear space. Jog on the spot (run without moving forward).", "Use a plastic or wooden 30 cm ruler. A 15 cm ruler is too short. Drop it at waist height, away from faces.", "Catch with finger and thumb only.", "If you feel dizzy, out of breath or unwell, stop, sit down and tell an adult straight away.", "If you should not exercise, join the still group. You don’t need to give a reason.", "Give the breathing group the quietest corner."],
      results: true,
      fewer: ["Just two of you: one does movement and the other sits still as the control. Try breathing another day.", "Three to six of you: at least one person in each of the three groups.", "Type every result into the table."]
    },

    /* ───────────── How we'll do business ───────────── */

    B10: {
      track: "business", mins: 10, team: "alone", years: [7, 11], group: "On your own, then pairs", kit: "Paper",
      title: "The job that doesn’t exist yet",
      blurb: "Split a job you know into machine and human parts, then invent its 2040 version.",
      question: "How will we work when machines do more?",
      from: "Dubai Future Week “How we’ll do business” question 3. Topic: future of work.",
      drop: "Apple’s App Store opened in July 2008. Before then, hardly anyone had the job “app developer”. KHDA checks Dubai’s schools. In September 2026 one of its leaders said this: many jobs that today’s pupils will have do not exist yet.",
      example: "“Pilot, 2040. <b>Machine:</b> flies the route. <b>Human:</b> decides in an emergency. <b>New task:</b> watches over five aircraft at once.”",
      cards: {
        title: "Jobs to choose from",
        note: "",
        items: ["Nurse", "Chef", "Bus driver", "Shopkeeper", "Teacher", "Footballer", "Vet"]
      },
      steps: [
        { m: 1, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Which part does the human keep?" },
        { m: 3, who: "On your own", t: "Split a job into three", d: "Pick a job from the list, or another you know well. Write three lines for the year 2040: the machine does…, the human does…, the new task is…" },
        { m: 3, who: "In pairs", t: "Invent the 2040 job", d: "Choose one of your two jobs. Give it a 2040 job title and write a one-line advert for it. Make one job card between you." },
        { m: 1, who: "In pairs", t: "Check it", d: "Check your job card with the checklist. Tick each point it meets. Fix anything that is missing." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about the jobs of the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A job card on paper: three lines, a job title and a one-line advert.",
      checklist: ["The human part needs care, judgement (deciding what is best) or new ideas.", "The new task says exactly what the person does.", "The title would make sense to a parent."],
      model: {
        plain: true, intro: "Two finished job cards:",
        marks: [
          "<b>Card 1:</b> “Nurse, 2040. Machine: tracks every patient’s readings all night. Human: notices who is frightened and explains what is happening. New task: checks the AI’s alerts and decides which ones are real. Title: Ward lead, people and AI. Advert: ‘Calm in a crisis? Lead a team of six nurses and one very busy AI.’”",
          "<b>Card 2:</b> “Chef, 2040. Machine: chops, weighs and times everything. Human: tastes, and invents the dish. New task: designs menus around what the vertical farm picked that morning. Title: Farm-to-table chef. Advert: ‘The robots do the chopping. You do the tasting.’”",
          "<b>Notice:</b> in both, the human keeps the part that needs judgement or care, and the new task is something you could picture someone doing on a Monday morning."
        ]
      },
      support: "Copy the three line starters from the example and finish each one: Machine: … Human: … New task: …",
      stretch: "Which school subject prepares you for your 2040 job, and why?",
      fewer: "On your own: do the pairs steps yourself, then ask someone to check your job card with the checklist. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    B20: {
      track: "business", mins: 20, team: "alone", years: [7, 9], group: "Pairs", kit: "Paper",
      title: "A day without cash",
      blurb: "List every payment in a Dubai teenager’s day and find who gets left out.",
      question: "What will money mean in a cashless world?",
      from: "Dubai Future Week “How we’ll do business” question 1. Topic: future of money and finance.",
      drop: "Cashless means paying with no notes or coins. Dubai set a target for 90% of payments to be cashless by 2026. In October 2026 the government said it had passed that target. Every digital payment leaves a record. Cash does not.",
      example: "One entry on a payment timeline: “8:05 · canteen · card tap. Who can see it: the school, the bank, a parent.”",
      steps: [
        { m: 2, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example entry. Who can see that payment?" },
        { m: 4, who: "In pairs", t: "Build the timeline", d: "Draw a timeline of one day. Add every payment a 13-year-old in Dubai might make, with the time, the place and how they pay." },
        { m: 6, who: "In pairs", t: "Who sees it, who is left out?", d: "Under each payment, write who can see it. Then choose one person who is left out if cash disappears: a grandparent, a tourist, an 8-year-old or a market seller." },
        { m: 4, who: "In pairs", t: "Design a fairness fix", d: "Design one rule or one feature that makes paying without cash fair for the person you chose. Check your work with the checklist." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about money. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A payment timeline with one fairness fix.",
      checklist: ["It has at least five payments.", "It names who is left out.", "The fix helps that person."],
      model: {
        intro: "A finished timeline and fix:",
        marks: [
          "<b>Five payments, and who can see them:</b> “7:30 Metro, Nol card (the transport authority). 10:30 break-time snack, school card (the school, a parent). 1:10 vending machine, phone (the bank). 4:20 corner shop, phone (the bank, the shop). 7:00 game add-on, a parent’s saved card, with permission (the game company, the bank, the parent).”",
          "<b>Who is left out:</b> “An 8-year-old. She has no phone and no card, so she can’t buy her own snack from the shop.”",
          "<b>The fix:</b> “A wristband her parents top up, with a daily limit and no bank account behind it. She can pay, and she can’t overspend.”"
        ]
      },
      support: "Start with five moments: on the way to school, break, lunch, after school, evening. Add one payment to each.",
      stretch: "If money is only numbers on a screen, what makes it worth anything?",
      rules: "This is an invented teenager. Nobody says what they spend or how much pocket money they get.",
      fewer: "On your own: do every step yourself, then ask someone to check your timeline with the checklist. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    },

    B30: {
      track: "business", mins: 30, team: "group", years: [9, 11], group: "Teams of two to four", kit: "Paper", comp: "Years 9 to 11",
      title: "The Pitch",
      blurb: "Sixty seconds to pitch a new Dubai company. The other teams decide whether to invest.",
      question: "Where will tomorrow’s value be created?",
      from: "Dubai Future Week “How we’ll do business” question 2, and The Pitch, where start-ups pitch live to investors and get feedback from experts.",
      drop: "A start-up is a new, small company. Investors are people who give money to help it grow. A pitch is a short talk to persuade them. Investors look for a real problem first, then a good idea. A pitch answers five things: what problem, for whom, what solution, why now, and what do you need?",
      example: "A 60-second pitch with its five parts labelled. <b>Problem:</b> “People who work outdoors in Dubai’s summer need to know when to rest and drink.” <b>For whom:</b> “Gardeners, builders and delivery riders.” <b>Solution:</b> “CoolBand, a wristband that warns you before your body overheats and tells your supervisor to call a break.” <b>Why now:</b> “Summers are getting hotter, and sensors are now cheap enough to give to every worker.” <b>What we need:</b> “Fifty wristbands and one building site to test them on next July.”",
      steps: [
        { m: 3, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example pitch. Find its five parts." },
        { m: 9, who: "In your team", t: "Write your pitch", d: "Invent a start-up that could exist in Dubai by 2035. Write a 60-second pitch with all five parts, and choose who will speak. Read it aloud and time it. Write it on one sheet. This is your pitch card." },
        { m: 6, who: "Everyone", t: "Round one", d: ["More than eight teams? First split the room into two halves. Each half runs its own rounds.", "Number the teams. Teams 1, 3, 5 and so on pitch first. Each has 60 seconds.", "The other teams are the panel: the people who listen and judge.", "Each panel member has three Arcadia dirhams (pretend money) to invest.", "After the last pitch, the pitching teams put their pitch cards on a table.", "Panel members walk round. Draw one tick on a card for each dirham you give. Give one team no more than two ticks."] },
        { m: 6, who: "Everyone", t: "Round two", d: "Swap. The panel teams pitch, and the first teams invest." },
        { m: 2, who: "Everyone", t: "Panel feedback", d: "Each person writes one strength and one question on a pitch card they invested in. Teams count their ticks (dirhams) and read their feedback." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about what makes an idea worth giving money to. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A pitch card with the five parts, plus the dirhams you won.",
      checklist: ["The problem is real and local.", "It says why now.", "It fits in 60 seconds. You have timed it."],
      model: {
        intro: "The example pitch as a five-box card. Read aloud at a steady pace, it takes about 45 seconds:",
        marks: [
          "<b>Real and local:</b> “Problem: people who work outdoors in Dubai’s summer need to know when to rest and drink. For whom: gardeners, builders, delivery riders.”",
          "<b>Why now:</b> “Summers are getting hotter, and sensors are now cheap enough for every worker to wear one.”",
          "<b>Fits in 60 seconds:</b> “Solution: CoolBand, a wristband that warns you before you overheat. We need: fifty wristbands and one site to test on.” Five short boxes, no extra detail."
        ]
      },
      support: "Use the five-box pitch frame: Problem · For whom · Solution · Why now · What we need.",
      stretch: "Who loses if your start-up wins?",
      fewer: ["Only one team: pitch to another group, to friends or to people at home. They are your panel.", "Each panel member has three dirhams and writes one strength and one question. Skip round two.", "Nobody else around? One of you pitches and the rest are the panel."]
    },

    B50: {
      track: "business", mins: 50, team: "group", years: [7, 11], group: "A whole class, in five expert groups", kit: "A3 paper, or two A4 sheets taped together, and pens", comp: "Years 7 to 11",
      title: "Arcadia Future Minds",
      blurb: "Five expert groups work on one possible future. You finish with three priorities (the most important things), two ideas and one promise.",
      question: "What would you do if this future arrived?", ownQ: true,
      from: "This copies 500 Future Minds, an event at Dubai Future Week. It brings together 100 people from each of five groups to plan for possible futures. It is the biggest activity here and uses ideas from all five themes.",
      drop: "Experts don’t predict one future. They test several scenarios, which are possible futures, and ask what they would do in each.",
      example: "Scenario: “2040: half of Dubai’s deliveries are made by robots.” For the first responders group: <b>Priority</b> (the most important thing): “Robots must never block an ambulance.” <b>Idea:</b> “Every robot moves to the side and stops when it hears a siren.” <b>Commitment</b> (a promise to act): “Next week we ask the site team where deliveries arrive and where pupils walk.”",
      cards: {
        title: "The three scenarios",
        pick: true,
        note: "",
        items: ["2040: half of Dubai’s deliveries are made by robots.", "2040: every pupil has an AI tutor.", "2040: summer lasts a month longer."]
      },
      cards2: {
        title: "Role cards: one for each group",
        note: "",
        items: [
          { k: "ROLE CARD", t: "Teachers", d: "You care about what pupils learn. What should pupils still do for themselves? What would you teach differently? What do you need from the other groups?" },
          { k: "ROLE CARD", t: "First responders (emergency workers)", d: "You care about keeping people safe. What new emergencies could happen? What would slow you down? What do you need from the other groups?" },
          { k: "ROLE CARD", t: "Local entrepreneurs", d: "You are people who start businesses here. You care about what people will want to buy. What new business could exist? Who would your customers be? What do you need from the other groups?" },
          { k: "ROLE CARD", t: "Economy, banking and finance", d: "You care about money and jobs. Who would earn more, and who would earn less? What would cost money to fix? What do you need from the other groups?" },
          { k: "ROLE CARD", t: "Urban planners, architects and engineers", d: "You care about streets and buildings. What needs to be built or changed? Where would it go? What do you need from the other groups?" }
        ]
      },
      steps: [
        { m: 4, who: "Everyone", t: "Read the fact and the example", d: "Read “Know this first” and the example. Notice how the commitment is small enough to start next week." },
        { m: 5, who: "Everyone", t: "Join your expert group", d: ["The timekeeper presses “Pick one for us” once and reads the scenario out. Everyone uses that scenario.", "Count round the room from 1 to 5.", "Your number is your expert group: 1 teachers, 2 first responders, 3 entrepreneurs, 4 finance, 5 planners.", "Sit with the people who have your number. Read your role card."] },
        { m: 10, who: "In your expert group", t: "Scenario round", d: "Think about the scenario. What changes for your expert group? List what gets better and what gets harder." },
        { m: 8, who: "New tables", t: "Mixed tables", d: ["In your expert group, give each person a letter: A, B, C and so on.", "Now move. All the As make a new table. All the Bs make another, and so on. Each new table has people from different expert groups.", "At the new table, each person speaks for one minute. Say what your expert group needs from the others."] },
        { m: 10, who: "In your expert group", t: "Priorities, ideas, commitment", d: ["Go back to your expert group.", "Agree on three priorities.", "Agree on two ideas.", "Agree on one commitment that Arcadia could start next week.", "Write them on A3. Then check the sheet with the checklist."] },
        { m: 6, who: "Everyone", t: "Share", d: "Each expert group shares its commitment in one minute." },
        { m: 2, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about planning for the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A priorities, ideas and commitment sheet on A3.",
      checklist: ["The priorities come from the scenario.", "The ideas are for Dubai, not just anywhere.", "The commitment could start next week."],
      model: {
        intro: "A completed sheet from the teachers group, for “2040: every pupil has an AI tutor”:",
        marks: [
          "<b>Priorities from the scenario:</b> “1. Pupils still think for themselves first. 2. No pupil is left alone with a screen all day. 3. Teachers can see what the tutor told each pupil.”",
          "<b>Ideas for Dubai:</b> “1. Tutors that work in Arabic and English, and switch between them as families here do. 2. A weekly ‘no-tutor’ lesson outdoors in the cooler months.”",
          "<b>Commitment for next week:</b> “Each of us explains one homework answer out loud to a partner before handing it in, and reports back to our tutor group.”"
        ]
      },
      support: "Answer only the first question on your role card. Then listen to the others before you add more.",
      stretch: "Write a possible future that nobody is planning for.",
      fewer: ["Five of you: take one role card each, skip step 4 and make one sheet together.", "Two to four of you: share out all five role cards, skip step 4 and make one sheet together. In step 6, share it with someone who has not seen it.", "On your own: choose two role cards and make one sheet. Then read your commitment aloud and write one reason it might not happen next week."]
    },

    /* ───────────── Bonus ───────────── */

    FS: {
      track: null, mins: 20, team: "alone", years: [7, 11], group: "On your own", kit: "Paper", comp: "Every year group",
      title: "Future Stories",
      blurb: "Up to 300 words: one ordinary day in Dubai in 2050.",
      question: "Any one of Dubai Future Week’s 15 questions. You choose.",
      from: "Future Stories, the Dubai Future Foundation’s short story competition for adults. This is Arcadia’s school version.",
      drop: "A good story about the future doesn’t explain the future. It shows one person living an ordinary day, and lets the reader notice what has changed.",
      example: "A model opening, about 100 words. An adult wrote it, and yours does not need to sound like this. Look at what it does: “The shutters opened at 6:40, the way they did every morning, and the desert came in pink behind the Burj Khalifa. Maryam’s grandmother was already on the balcony arguing with the garden. ‘It has given the tomatoes too much water again,’ she said. ‘It measures the soil, Teta,’ said Maryam. ‘It doesn’t guess.’ ‘I don’t guess either,’ said her grandmother. ‘I know.’ Down in the street the first shuttle hummed past without a driver, and nobody looked up. Maryam looked instead at the old woman’s hands in the soil, and wondered who the garden would listen to when those hands were gone.”",
      allQuestions: true,
      steps: [
        { m: 3, who: "On your own", t: "Read the opening and pick a question", d: "Read the model opening. Then choose any one of the 15 Dubai Future Week questions for your story to answer." },
        { m: 11, who: "On your own", t: "Write your story", d: ["Tell the story of one ordinary day in Dubai in 2050.", "Show your answer through what happens. Do not write the question in the story.", "Write for 11 minutes. Aim for about 150 words now. You can build it up to 300 later."] },
        { m: 2, who: "In pairs", t: "Swap and check", d: "Swap with a partner. Check their story with the checklist. Can you tell which question it answers?" },
        { m: 1, who: "On your own", t: "Improve one sentence", d: "Use the feedback to improve one sentence." },
        { m: 1, who: "On your own", t: "I used to think… now I think…", d: "Write two sentences about writing the future. Start one with “I used to think…”. Start the other with “Now I think…”." }
      ],
      make: "A story of up to 300 words, on paper. You can also finish it later.",
      checklist: ["It is set on one day.", "It answers the chosen question without writing it out.", "It has one detail that could only be Dubai."],
      model: {
        intro: "How the model opening meets the checklist:",
        marks: [
          "<b>One day:</b> it starts at 6:40 in the morning and stays there.",
          "<b>Answers without stating:</b> the question is “Can our homes take care of us?” The story never says so. It shows a garden that waters itself and a grandmother who doesn’t trust it.",
          "<b>Only Dubai:</b> the desert coming in pink behind the Burj Khalifa."
        ]
      },
      support: "Start with a time and a place: “At 6:40, on the balcony…” Then let one small thing go wrong.",
      stretch: "Write the same day again from another person’s point of view.",
      fewer: "On your own: ask someone at home to read your story and guess which question it answers. Nobody to ask? Leave it for ten minutes. Then check it yourself, as if someone else made it. Write down one thing to fix."
    }
  },

  paragraph: {
    html: "The UAE’s Hope probe is one of the great success stories of space exploration. It <mark>blasted off from a launch pad in the UAE</mark> in July 2020 and travelled about 493 million kilometres in seven months. In February 2021 it <mark>landed safely on the surface of Mars</mark>, completing the first mission to another planet by any Arab nation. Hope carries <mark>five scientific instruments</mark>, which study the planet’s atmosphere and weather through every season of the Martian year. The mission was planned to last one Martian year, which is about two Earth years."
  },

  /* How pupils enter. Fill these in when the school has decided; the pages adapt.
     formUrl:  the published Google Form link (see ../entry/form-setup.gs).
     deadline: plain words, e.g. "Thursday 26 November, 4pm".
     dropBox:  one full sentence saying where paper entries are handed in.
     photoPoint: optional. Arcadia is bring-your-own-device, so pupils photograph work on their own device. */
  entry: { formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfazhH6y8eD-IqzXfYfYEGSeyzJ8ivOPF0W7JpcSXi_qDRGKA/viewform", deadline: "Tuesday 1 December 2026", dropBox: "Hand it to Mr Gray in room 301B, or give it to your Head of Year, who will pass it on.", photoPoint: "" },

  teams: {
    alone: { label: "On your own or with others", note: "You can do this by yourself, at school or at home. Steps marked “In pairs” can be done alone: see “Working alone or in a smaller group?”. It also works in a pair or a group." },
    partner: { label: "Two or more people", note: "You need one other person, such as a friend or someone at home. It also works with a whole class." },
    group: { label: "Three or more people", note: "You need a group of three or more. You can run it yourselves." }
  },

  competition: {
    routes: [
      { id: "L50", band: "Years 7 to 11" }, { id: "T50", band: "Years 7 to 11" },
      { id: "I30", band: "Years 7 to 9" }, { id: "I50", band: "Years 9 to 11" },
      { id: "F30", band: "Years 7 to 11" }, { id: "B30", band: "Years 9 to 11" },
      { id: "B50", band: "Years 7 to 11" }, { id: "FS", band: "Every year group" }
    ]
  }
};
