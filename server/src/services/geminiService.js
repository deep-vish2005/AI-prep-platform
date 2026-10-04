import { GoogleGenAI, Type } from "@google/genai";

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "A clear interview question for the candidate",
      },
      topic: {
        type: Type.STRING,
        description: "The primary topic tested by the question",
      },
      difficulty: {
        type: Type.STRING,
        enum: ["Easy", "Medium", "Hard"],
        description: "Difficulty of the interview question",
      },
    },
    required: ["question", "topic", "difficulty"],
  },
};

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "Answer score from 0 to 10",
    },
    strength: {
      type: Type.STRING,
      description: "What the candidate explained correctly",
    },
    missing: {
      type: Type.STRING,
      description: "Important concept missing from the answer",
    },
    suggestion: {
      type: Type.STRING,
      description: "A specific way to improve the answer",
    },
  },
  required: ["score", "strength", "missing", "suggestion"],
};

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function generateInterviewQuestions({
  targetRole,
  experienceLevel,
  interviewType,
  topics,
  questionCount,
}) {
  const ai = getGeminiClient();

  const prompt = `
You are an experienced technical interviewer.

Generate exactly ${questionCount} interview questions for this candidate:

Target role: ${targetRole}
Experience level: ${experienceLevel}
Interview type: ${interviewType}
Focus topics: ${topics.join(", ")}

Requirements:
- Questions must be appropriate for the specified experience level.
- Cover the selected topics with reasonable balance.
- Avoid duplicate or nearly identical questions.
- Ask questions that test explanation, reasoning, trade-offs, and practical application.
- For technical interviews, avoid trivia-only questions.
- For behavioral interviews, ask questions that encourage structured real-world examples.
- For mixed interviews, include both technical and behavioral questions.
- Do not include answers, hints, scores, or feedback.
- Return exactly ${questionCount} question objects.
`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: questionSchema,
        },
      });

      const questions = JSON.parse(response.text);

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Gemini returned no interview questions");
      }

      if (questions.length !== Number(questionCount)) {
        throw new Error(
          `Gemini returned ${questions.length} questions instead of ${questionCount}`,
        );
      }

      return questions.map((question) => ({
        question: String(question.question).trim(),
        topic: String(question.topic).trim(),
        difficulty: ["Easy", "Medium", "Hard"].includes(question.difficulty)
          ? question.difficulty
          : "Medium",
      }));
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini generation attempt ${attempt} failed:`,
        error.message,
      );

      if (attempt < 3) {
        await wait(attempt * 2000);
      }
    }
  }

  console.error(
    "Gemini question generation failed after retries:",
    lastError?.message,
  );

  const serviceError = new Error(
    "Gemini is temporarily busy. Please wait briefly and try again.",
  );

  serviceError.status = 503;
  throw serviceError;
}

export async function evaluateInterviewAnswer({
  targetRole,
  experienceLevel,
  topic,
  question,
  answer,
}) {
  const ai = getGeminiClient();

  const prompt = `
You are evaluating a candidate's mock interview response.

Target role: ${targetRole}
Experience level: ${experienceLevel}
Topic: ${topic}

Interview question:
${question}

Candidate answer:
${answer}

Evaluate the answer fairly for the specified experience level.

Requirements:
- Give a score from 0 to 10.
- Reward technical correctness, clarity, reasoning, and practical understanding.
- Do not punish the candidate for minor wording or grammar issues.
- Identify one specific strength.
- Identify the most important missing or weak concept.
- Give one actionable improvement suggestion.
- Keep each feedback field concise and useful.
`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: evaluationSchema,
        },
      });

      const evaluation = JSON.parse(response.text);
      const numericScore = Number(evaluation.score);

      if (
        !Number.isFinite(numericScore) ||
        !evaluation.strength ||
        !evaluation.missing ||
        !evaluation.suggestion
      ) {
        throw new Error("Gemini returned an invalid evaluation");
      }

      return {
        score: Math.min(10, Math.max(0, numericScore)),
        strength: String(evaluation.strength).trim(),
        missing: String(evaluation.missing).trim(),
        suggestion: String(evaluation.suggestion).trim(),
      };
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini evaluation attempt ${attempt} failed:`,
        error.message,
      );

      if (attempt < 3) {
        await wait(attempt * 2000);
      }
    }
  }

  console.error("Gemini evaluation failed after retries:", lastError?.message);

  const serviceError = new Error(
    "Gemini is temporarily unable to evaluate this answer.",
  );

  serviceError.status = 503;
  throw serviceError;
}
