window.LessonWidgets = {
      panel(id, phase, lesson) {
        const content = {
          resources: {heading:'Read and answer in your book', text:'Use the pictured or written evidence on this screen.', href:'device.html#' + phase.id, linkLabel:'Open the device lesson'},
          assessments: {heading:'Check what the question asks', text:'Use the command word and the marks shown on the question.'},
          adaptation: {heading:'Try the original first', text:'Show your teacher where you got stuck. They will choose the help.'},
          hot: {heading:'Test a claim', text:'Point out which reading supports a claim and which controlled factor still matters. Use the current question.'},
          ai: {heading:'Use your own reasoning', text:'Write your own scientific answer in your book.'},
          uae: {heading:'Observe the evidence', text:'Use the evidence supplied for this investigation.'}
        };
        const titles = {resources:'Resources',assessments:'Assessments',adaptation:'Adaptation',hot:'HOT',ai:'AI literacy',uae:'UAE National Agenda'};
        return {title:titles[id], subtitle:lesson.title, tabs:[{label:'Task',pages:[content[id]]}]};
      }
    };
