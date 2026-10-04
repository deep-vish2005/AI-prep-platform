import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Lightbulb,
  LogOut,
  Mic,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const questions = [
  {
    id: 1,
    topic: "React",
    difficulty: "Medium",
    prompt:
      "Explain the difference between useState and useReducer in React. When would you prefer useReducer?",
    feedback: {
      score: 8.5,
      strength:
        "Clearly explains that useReducer centralizes related state transitions.",
      missing:
        "Include testability and predictable action handling as additional benefits.",
      suggestion:
        "Add a concrete example involving several dependent state values.",
    },
  },
  {
    id: 2,
    topic: "JavaScript",
    difficulty: "Medium",
    prompt:
      "What is a closure in JavaScript, and where would you use one in a real application?",
    feedback: {
      score: 8,
      strength:
        "Correctly connects closures with access to the surrounding lexical scope.",
      missing:
        "Mention potential memory implications when references are retained.",
      suggestion:
        "Use an example involving private state, callbacks, or function factories.",
    },
  },
  {
    id: 3,
    topic: "React",
    difficulty: "Hard",
    prompt:
      "How does React decide which parts of the DOM need to be updated during reconciliation?",
    feedback: {
      score: 7.5,
      strength:
        "Identifies the virtual DOM and comparison between render trees.",
      missing: "Explain the importance of element types and stable list keys.",
      suggestion:
        "Describe React's assumptions and how keys influence child reconciliation.",
    },
  },
  {
    id: 4,
    topic: "System Design",
    difficulty: "Hard",
    prompt:
      "How would you design a notification system capable of handling millions of users?",
    feedback: {
      score: 7,
      strength:
        "Recognizes the need for asynchronous processing and message queues.",
      missing:
        "Discuss delivery guarantees, retries, rate limits, and user preferences.",
      suggestion:
        "Structure the answer around requirements, components, data flow, and failure handling.",
    },
  },
  {
    id: 5,
    topic: "Node.js",
    difficulty: "Medium",
    prompt:
      "Why is Node.js effective for I/O-heavy applications, and when would it be a poor choice?",
    feedback: {
      score: 8.5,
      strength:
        "Accurately explains non-blocking I/O and the event-driven architecture.",
      missing: "Clarify how CPU-intensive work can block the event loop.",
      suggestion:
        "Mention worker threads or separate services for CPU-heavy workloads.",
    },
  },
];

const fallbackSession = {
  role: "Frontend Engineer",
  experience: "Intermediate",
  format: "Technical",
  topics: ["JavaScript", "React"],
  questionCount: 5,
  estimatedDuration: "10–15 minutes",
};

function readSession() {
  try {
    const savedSession = sessionStorage.getItem("devprep-session");

    if (!savedSession) {
      return fallbackSession;
    }

    return {
      ...fallbackSession,
      ...JSON.parse(savedSession),
    };
  } catch {
    return fallbackSession;
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

function LiveInterview() {
  const navigate = useNavigate();
  const [session] = useState(readSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const availableQuestions = useMemo(() => {
    const generatedQuestions =
      Array.isArray(session.questions) && session.questions.length
        ? session.questions
        : questions;

    const requestedCount =
      Number(session.questionCount) || generatedQuestions.length;

    return generatedQuestions.slice(
      0,
      Math.min(requestedCount, generatedQuestions.length),
    );
  }, [session]);

  const currentQuestion = availableQuestions[currentIndex];
  const questionText =
    currentQuestion?.question ||
    currentQuestion?.prompt ||
    "Question unavailable";
  const totalQuestions = availableQuestions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isFinalQuestion = currentIndex === totalQuestions - 1;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function submitAnswer() {
    if (!answer.trim() || isEvaluating) {
      return;
    }

    if (!session.interviewId || !currentQuestion._id) {
      setSubmitError(
        "This session does not contain saved Gemini questions. Start a new interview.",
      );
      return;
    }

    setSubmitError("");
    setIsEvaluating(true);

    try {
      const response = await api.post(
        `/interviews/${session.interviewId}/questions/${currentQuestion._id}/answer`,
        {
          answer: answer.trim(),
        },
      );

      const receivedEvaluation = response.data.evaluation;

      setEvaluation(receivedEvaluation);

      setSubmittedAnswers((current) => [
        ...current,
        {
          questionId: currentQuestion._id,
          question: questionText,
          answer: answer.trim(),
          score: receivedEvaluation.score,
          feedback: {
            strength: receivedEvaluation.strength,
            missing: receivedEvaluation.missing,
            suggestion: receivedEvaluation.suggestion,
          },
        },
      ]);

      setShowFeedback(true);
    } catch (requestError) {
      setSubmitError(
        requestError.response?.data?.message ||
          "Unable to evaluate this answer. Please try again.",
      );
    } finally {
      setIsEvaluating(false);
    }
  }

  function continueInterview() {
    if (isFinalQuestion) {
      sessionStorage.setItem(
        "devprep-results",
        JSON.stringify({
          session,
          answers: submittedAnswers,
          completedAt: new Date().toISOString(),
        }),
      );

      navigate("/interview/report");
      return;
    }

    setCurrentIndex((current) => current + 1);
    setAnswer("");
    setShowFeedback(false);
    setEvaluation(null);
    setSubmitError("");
  }

  function skipQuestion() {
    if (isFinalQuestion) {
      navigate("/interview/report");
      return;
    }

    setCurrentIndex((current) => current + 1);
    setAnswer("");
    setShowFeedback(false);
    setEvaluation(null);
    setSubmitError("");
  }

  function exitInterview() {
    const shouldExit = window.confirm(
      "Exit this interview? Your current progress will not be saved.",
    );

    if (shouldExit) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 size={20} />
            </span>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-ink">DevPrep AI</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Live Interview
              </p>
            </div>
          </div>

          <div className="hidden min-w-72 flex-1 px-8 md:block">
            <div className="mx-auto max-w-xl">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-muted">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="font-semibold text-brand-700">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-lg border border-line bg-slate-50 px-3 font-mono text-sm font-medium text-slate-700">
              <Clock3 size={16} />
              {formatTime(elapsedSeconds)}
            </div>

            <button
              type="button"
              onClick={exitInterview}
              className="flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-danger"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 md:hidden">
          <div className="mb-2 flex justify-between text-xs font-medium">
            <span className="text-muted">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-brand-700">{Math.round(progress)}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-line bg-white shadow-sm">
              <div className="border-b border-line px-5 py-4 md:px-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    {currentQuestion.topic}
                  </span>

                  <span
                    className={[
                      "rounded-md px-2.5 py-1 text-xs font-semibold",
                      currentQuestion.difficulty === "Hard"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-green-50 text-green-700",
                    ].join(" ")}
                  >
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-5 md:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interview question
                </p>

                <h1 className="mt-3 text-xl font-semibold leading-8 text-ink md:text-2xl md:leading-9">
                  {questionText}
                </h1>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-ink">Your answer</h2>
                  <p className="mt-1 text-sm text-muted">
                    Explain your reasoning clearly and include examples.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Voice answers will be added later"
                  className="flex size-10 items-center justify-center rounded-lg border border-line text-slate-400"
                >
                  <Mic size={19} />
                </button>
              </div>

              <textarea
                value={answer}
                disabled={isEvaluating || showFeedback}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer here..."
                className="mt-5 min-h-64 w-full resize-y rounded-xl border border-line-strong bg-white p-4 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-slate-50"
              />

              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>Use a structured and concise explanation.</span>
                <span>{answer.length} characters</span>
              </div>

              {submitError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {!showFeedback && (
                <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={isEvaluating}
                    onClick={skipQuestion}
                    className="h-11 rounded-lg border border-line px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Skip Question
                  </button>

                  <button
                    type="button"
                    disabled={!answer.trim() || isEvaluating}
                    onClick={submitAnswer}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isEvaluating ? (
                      <>
                        <Sparkles size={18} className="animate-pulse" />
                        AI is evaluating...
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <Send size={17} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {showFeedback && evaluation && (
              <section className="rounded-xl border border-brand-100 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-line p-5 sm:flex-row sm:items-center md:px-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                      AI rubric evaluation
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-ink">
                      Answer feedback
                    </h2>
                  </div>

                  <div className="flex items-baseline gap-1 rounded-lg bg-brand-50 px-4 py-2">
                    <span className="text-2xl font-bold text-brand-700">
                      {evaluation.score}
                    </span>
                    <span className="text-sm font-semibold text-brand-700">
                      /10
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-3 md:p-7">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-2 font-semibold text-green-800">
                      <CheckCircle2 size={18} />
                      Strong
                    </div>
                    <p className="mt-2 text-sm leading-6 text-green-900">
                      {evaluation.strength}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 font-semibold text-amber-800">
                      <AlertTriangle size={18} />
                      Missing
                    </div>
                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      {evaluation.missing}
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 font-semibold text-blue-800">
                      <Lightbulb size={18} />
                      Improve
                    </div>
                    <p className="mt-2 text-sm leading-6 text-blue-900">
                      {evaluation.suggestion}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end border-t border-line p-5 md:px-7">
                  <button
                    type="button"
                    onClick={continueInterview}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 focus:ring-4 focus:ring-brand-100"
                  >
                    {isFinalQuestion
                      ? "View Interview Report"
                      : "Continue to Next Question"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-ink">Session details</h2>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-xs font-medium text-muted">Role</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {session.role}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-muted">Experience</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {session.experience}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-muted">Format</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {session.format}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-brand-700" />
                <h2 className="font-semibold text-ink">Answer guidance</h2>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                <li>• Define the core concept first.</li>
                <li>• Explain your reasoning and trade-offs.</li>
                <li>• Include a practical example.</li>
                <li>• Keep the answer focused.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default LiveInterview;
