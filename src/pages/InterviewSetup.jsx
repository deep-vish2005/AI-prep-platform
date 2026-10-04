import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  Clock3,
  Code2,
  Database,
  Layers3,
  Laptop,
  MessageSquareText,
  Server,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const roles = [
  {
    id: "frontend",
    name: "Frontend Engineer",
    description: "React, JavaScript, CSS, browser APIs",
    icon: Laptop,
  },
  {
    id: "backend",
    name: "Backend Engineer",
    description: "APIs, databases, architecture, security",
    icon: Server,
  },
  {
    id: "fullstack",
    name: "Full Stack Engineer",
    description: "Frontend, backend, and integration",
    icon: Layers3,
  },
  {
    id: "software",
    name: "Software Engineer",
    description: "Programming, DSA, and core engineering",
    icon: Code2,
  },
];

const experienceLevels = [
  {
    id: "beginner",
    name: "Beginner",
    description: "0–2 years",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "2–5 years",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "5+ years",
  },
];

const interviewFormats = [
  {
    id: "technical",
    name: "Technical",
    description: "Concepts, problem solving, and technical decisions",
    icon: BrainCircuit,
  },
  {
    id: "behavioral",
    name: "Behavioral",
    description: "Communication, teamwork, and past experience",
    icon: UsersRound,
  },
  {
    id: "mixed",
    name: "Mixed",
    description: "A balanced technical and behavioral session",
    icon: MessageSquareText,
  },
];

const topicOptions = [
  { id: "javascript", name: "JavaScript" },
  { id: "react", name: "React" },
  { id: "node", name: "Node.js" },
  { id: "mongodb", name: "MongoDB" },
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "dbms", name: "DBMS" },
  { id: "system-design", name: "System Design" },
  { id: "behavioral", name: "Behavioral Questions" },
];

function SelectionCard({ selected, icon: Icon, name, description, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "relative flex min-h-28 w-full items-start gap-4 rounded-xl border p-4 text-left transition",
        selected
          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
          : "border-line bg-white hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600",
        ].join(" ")}
      >
        <Icon size={20} />
      </span>

      <span>
        <span className="block text-sm font-semibold text-ink">{name}</span>
        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>

      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-semibold text-ink">
        {value}
      </span>
    </div>
  );
}

function InterviewSetup() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("frontend");
  const [experience, setExperience] = useState("intermediate");
  const [format, setFormat] = useState("technical");
  const [topics, setTopics] = useState(["javascript", "react"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState("");

  const role = roles.find((item) => item.id === selectedRole);
  const level = experienceLevels.find((item) => item.id === experience);
  const interviewFormat = interviewFormats.find((item) => item.id === format);

  const selectedTopicNames = topicOptions
    .filter((topic) => topics.includes(topic.id))
    .map((topic) => topic.name);

  const estimatedDuration = useMemo(
    () => `${questionCount * 2}–${questionCount * 3} minutes`,
    [questionCount],
  );

  function toggleTopic(topicId) {
    setTopics((currentTopics) =>
      currentTopics.includes(topicId)
        ? currentTopics.filter((id) => id !== topicId)
        : [...currentTopics, topicId],
    );
  }

  async function startInterview() {
    if (topics.length === 0 || isStarting) {
      return;
    }

    setStartError("");
    setIsStarting(true);

    try {
      const response = await api.post("/interviews", {
        targetRole: role.name,
        experienceLevel: level.name,
        interviewType: interviewFormat.name,
        topics: selectedTopicNames,
        questionCount,
      });

      const session = {
        interviewId: response.data.interview._id,
        role: response.data.interview.targetRole,
        experience: response.data.interview.experienceLevel,
        format: response.data.interview.interviewType,
        topics: response.data.interview.topics,
        questionCount: response.data.interview.questionCount,
        estimatedDuration,
        questions: response.data.interview.questions,
      };

      sessionStorage.setItem("devprep-session", JSON.stringify(session));

      navigate("/interview/live");
    } catch (requestError) {
      setStartError(
        requestError.response?.data?.message ||
          "Unable to start the interview. Please try again.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-semibold text-brand-700">
          New practice session
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
          Configure Practice Interview
        </h1>

        <p className="mt-2 max-w-2xl text-muted">
          Personalize the session around the role, experience level, and skills
          you want to practise.
        </p>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                1
              </span>

              <div>
                <h2 className="font-semibold text-ink">Target role</h2>
                <p className="text-sm text-muted">
                  Select the position you want to prepare for.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {roles.map((item) => (
                <SelectionCard
                  key={item.id}
                  selected={selectedRole === item.id}
                  icon={item.icon}
                  name={item.name}
                  description={item.description}
                  onClick={() => setSelectedRole(item.id)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                2
              </span>

              <div>
                <h2 className="font-semibold text-ink">
                  Seniority and experience
                </h2>
                <p className="text-sm text-muted">
                  This controls the question difficulty.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {experienceLevels.map((item) => {
                const selected = experience === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={selected}
                    onClick={() => setExperience(item.id)}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      selected
                        ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                        : "border-line bg-white hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink">
                        {item.name}
                      </span>

                      {selected && (
                        <Check size={17} className="text-brand-700" />
                      )}
                    </span>

                    <span className="mt-1 block text-xs text-muted">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                3
              </span>

              <div>
                <h2 className="font-semibold text-ink">Interview format</h2>
                <p className="text-sm text-muted">
                  Choose the type of interview experience.
                </p>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {interviewFormats.map((item) => (
                <SelectionCard
                  key={item.id}
                  selected={format === item.id}
                  icon={item.icon}
                  name={item.name}
                  description={item.description}
                  onClick={() => setFormat(item.id)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                4
              </span>

              <div>
                <h2 className="font-semibold text-ink">Focus topics</h2>
                <p className="text-sm text-muted">
                  Select one or more topics for this session.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {topicOptions.map((topic) => {
                const selected = topics.includes(topic.id);

                return (
                  <button
                    type="button"
                    key={topic.id}
                    aria-pressed={selected}
                    onClick={() => toggleTopic(topic.id)}
                    className={[
                      "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition",
                      selected
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-line bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {selected && <Check size={15} />}
                    {topic.name}
                  </button>
                );
              })}
            </div>

            {topics.length === 0 && (
              <p className="mt-3 text-sm font-medium text-danger">
                Select at least one focus topic.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                5
              </span>

              <div>
                <h2 className="font-semibold text-ink">Session length</h2>
                <p className="text-sm text-muted">
                  Choose how many questions you want to answer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[5, 10, 15, 20].map((count) => {
                const selected = questionCount === count;

                return (
                  <button
                    type="button"
                    key={count}
                    aria-pressed={selected}
                    onClick={() => setQuestionCount(count)}
                    className={[
                      "rounded-xl border px-4 py-4 text-center transition",
                      selected
                        ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                        : "border-line bg-white hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="block text-xl font-bold text-ink">
                      {count}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      Questions
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-line bg-white shadow-sm xl:sticky xl:top-24">
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <BriefcaseBusiness size={20} />
              </span>

              <div>
                <h2 className="font-semibold text-ink">Session overview</h2>
                <p className="text-xs text-muted">Review before starting</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-2">
            <SummaryRow label="Role" value={role.name} />
            <SummaryRow label="Experience" value={level.name} />
            <SummaryRow label="Format" value={interviewFormat.name} />
            <SummaryRow label="Questions" value={questionCount} />
            <SummaryRow label="Duration" value={estimatedDuration} />
          </div>

          <div className="border-t border-line p-5">
            {startError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {startError}
              </div>
            )}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Focus topics
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedTopicNames.length ? (
                  selectedTopicNames.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-danger">
                    No topics selected
                  </span>
                )}
              </div>
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-lg bg-green-50 p-3 text-green-800">
              <Sparkles size={18} className="mt-0.5 shrink-0" />

              <p className="text-xs leading-5">
                Questions will be personalized using your selected role,
                experience level, and topics.
              </p>
            </div>

            <button
              type="button"
              disabled={topics.length === 0 || isStarting}
              onClick={startInterview}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isStarting ? "Creating Session..." : "Start Interview"}

              {!isStarting && <ArrowRight size={18} />}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Clock3 size={14} />
              Approximately {estimatedDuration}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default InterviewSetup;
