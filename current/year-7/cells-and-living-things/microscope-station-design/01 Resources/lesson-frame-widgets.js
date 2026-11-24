window.LessonWidgets = {
  panel(id, phase, lesson) {
    const widgets = {
      resources: {
        title: 'Resources', heading: 'Real microscope examples and image credits',
        text: 'Compare real designs with the fictional kit records in the task.',
        href: 'visuals/sources.html', linkLabel: 'Open real examples and photo credits',
      },
      assessments: {
        title: 'Assessments', heading: 'Check the evidence in your response',
        text: 'Show your paper or board work. Open the model and criteria when your teacher directs you.',
      },
      adaptation: {
        title: 'Adaptation', heading: 'Choose help for a sticking point',
        text: 'Show your attempt to your teacher and use the help they choose.',
      },
      hot: {
        title: 'HOT', heading: 'Test the evidence behind your choice',
        text: 'Use the comparison and the criteria on the main task to defend your design.',
      },
    };
    const { title, ...page } = widgets[id];
    return { title, subtitle: lesson.title, tabs: [{ label: 'Task', pages: [page] }] };
  },
};
