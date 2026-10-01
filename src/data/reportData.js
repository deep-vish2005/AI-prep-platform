export const fallbackReport = {
  session: {
    role: "Frontend Engineer",
    experience: "Intermediate",
    format: "Technical",
    topics: ["React", "JavaScript", "System Design"],
  },
  completedAt: "2026-10-02T01:30:00.000Z",
  answers: [
    {
      questionId: 1,
      question:
        "Explain the difference between useState and useReducer in React.",
      answer:
        "useState works well for independent values, while useReducer centralizes related state transitions through actions.",
      score: 8.5,
      feedback: {
        strength:
          "Clearly explains that useReducer centralizes related state transitions.",
        missing:
          "Include testability and predictable action handling as additional benefits.",
        suggestion:
          "Add a concrete example involving several dependent state values.",
      },
    },
    {
      questionId: 2,
      question: "What is a closure in JavaScript, and where would you use one?",
      answer:
        "A closure allows a function to retain access to variables from its lexical scope after the outer function has returned.",
      score: 8,
      feedback: {
        strength:
          "Correctly connects closures with access to the surrounding lexical scope.",
        missing:
          "Mention possible memory implications when references are retained.",
        suggestion:
          "Include an example involving private state or function factories.",
      },
    },
    {
      questionId: 3,
      question:
        "How does React decide which parts of the DOM need to be updated?",
      answer:
        "React compares the new virtual DOM tree with the previous tree and updates the changed elements.",
      score: 7.5,
      feedback: {
        strength:
          "Identifies the virtual DOM and comparison between render trees.",
        missing:
          "Explain the importance of element types and stable list keys.",
        suggestion: "Describe how keys influence child reconciliation.",
      },
    },
  ],
};

export const competencyScores = [
  {
    name: "Technical accuracy",
    score: 84,
    color: "bg-blue-600",
  },
  {
    name: "Communication",
    score: 78,
    color: "bg-violet-600",
  },
  {
    name: "Problem solving",
    score: 81,
    color: "bg-emerald-600",
  },
  {
    name: "Depth of explanation",
    score: 74,
    color: "bg-amber-500",
  },
];
