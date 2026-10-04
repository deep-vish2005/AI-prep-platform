import {
  CalendarDays,
  Eye,
  History as HistoryIcon,
  Loader2,
  Play,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function scoreStyle(score) {
  if (score >= 8.5) {
    return "bg-green-50 text-green-700";
  }

  if (score >= 7) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
}

function formatStyle(format) {
  if (format === "Technical") {
    return "bg-blue-50 text-blue-700";
  }

  if (format === "Behavioral") {
    return "bg-green-50 text-green-700";
  }

  return "bg-violet-50 text-violet-700";
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function History() {
  const [interviews, setInterviews] = useState([]);
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadInterviews() {
      try {
        const response = await api.get("/interviews");
        setInterviews(response.data.interviews);
      } catch (requestError) {
        setLoadError(
          requestError.response?.data?.message ||
            "Unable to load interview history.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInterviews();
  }, []);

  const completedInterviews = useMemo(
    () => interviews.filter((interview) => interview.status === "completed"),
    [interviews],
  );

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch = interview.targetRole
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFormat =
        format === "All" || interview.interviewType === format;

      return matchesSearch && matchesFormat;
    });
  }, [interviews, query, format]);

  const averageScore = completedInterviews.length
    ? completedInterviews.reduce(
        (total, interview) => total + Number(interview.overallScore || 0),
        0,
      ) / completedInterviews.length
    : 0;

  const bestScore = completedInterviews.length
    ? Math.max(
        ...completedInterviews.map((interview) =>
          Number(interview.overallScore || 0),
        ),
      )
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Practice archive
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            Interview History
          </h1>

          <p className="mt-2 text-muted">
            Review previous sessions, scores, and reports.
          </p>
        </div>

        <Link
          to="/interview/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Play size={17} fill="currentColor" />
          Start New Interview
        </Link>
      </section>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">Total sessions</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {interviews.length}
          </p>
        </article>

        <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">Average score</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {averageScore.toFixed(1)}
          </p>
        </article>

        <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">Best score</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {bestScore.toFixed(1)}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role..."
              className="h-10 w-full rounded-lg border border-line bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            <option value="All">All formats</option>
            <option value="Technical">Technical</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm font-medium text-muted">
            <Loader2 size={20} className="animate-spin" />
            Loading interviews...
          </div>
        ) : filteredInterviews.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-line bg-slate-50/80">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Session
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Format
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Report
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredInterviews.map((interview) => (
                  <tr
                    key={interview._id}
                    className="border-b border-line last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <HistoryIcon size={17} />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {interview.targetRole}
                          </p>
                          <p className="mt-1 font-mono text-xs text-muted">
                            #{interview._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${formatStyle(
                          interview.interviewType,
                        )}`}
                      >
                        {interview.interviewType}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={15} />
                        {formatDate(interview.createdAt)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {interview.questionCount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={[
                          "rounded-md px-2.5 py-1 text-xs font-semibold",
                          interview.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {interview.status === "completed"
                          ? "Completed"
                          : "In progress"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {interview.overallScore !== null ? (
                        <span
                          className={`inline-flex min-w-14 justify-center rounded-md px-2.5 py-1 text-xs font-bold ${scoreStyle(
                            interview.overallScore,
                          )}`}
                        >
                          {Number(interview.overallScore).toFixed(1)}/10
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {interview.status === "completed" ? (
                        <Link
                          to={`/interview/report/${interview._id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <HistoryIcon size={36} className="mx-auto text-slate-300" />

            <h2 className="mt-4 font-semibold text-ink">No interviews found</h2>

            <p className="mt-2 text-sm text-muted">
              Start a new session or change the filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default History;
