import {
  CalendarDays,
  ChevronDown,
  Eye,
  History as HistoryIcon,
  Play,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const interviews = [
  {
    id: 1042,
    role: "Senior Frontend Engineer",
    format: "Technical",
    date: "Oct 2, 2026",
    questions: 5,
    score: 8.4,
    status: "Completed",
  },
  {
    id: 1041,
    role: "Full Stack Engineer",
    format: "Mixed",
    date: "Sep 28, 2026",
    questions: 10,
    score: 7.9,
    status: "Completed",
  },
  {
    id: 1040,
    role: "Backend Engineer",
    format: "Technical",
    date: "Sep 24, 2026",
    questions: 10,
    score: 8.7,
    status: "Completed",
  },
  {
    id: 1039,
    role: "Software Engineer",
    format: "Behavioral",
    date: "Sep 20, 2026",
    questions: 5,
    score: 7.6,
    status: "Completed",
  },
  {
    id: 1038,
    role: "Frontend Engineer",
    format: "Technical",
    date: "Sep 16, 2026",
    questions: 10,
    score: 8.1,
    status: "Completed",
  },
  {
    id: 1037,
    role: "Full Stack Engineer",
    format: "Mixed",
    date: "Sep 12, 2026",
    questions: 15,
    score: 6.9,
    status: "Completed",
  },
];

function scoreStyle(score) {
  if (score >= 8.5) {
    return "bg-green-50 text-green-700";
  }

  if (score >= 7.5) {
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

function History() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All");

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch = interview.role
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFormat = format === "All" || interview.format === format;

      return matchesSearch && matchesFormat;
    });
  }, [query, format]);

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
            Review previous sessions, scores, and detailed reports.
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
            {(
              interviews.reduce(
                (total, interview) => total + interview.score,
                0,
              ) / interviews.length
            ).toFixed(1)}
          </p>
        </article>

        <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">Best score</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {Math.max(...interviews.map((interview) => interview.score))}
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
              className="h-10 w-full rounded-lg border border-line bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div className="relative">
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className="h-10 min-w-44 appearance-none rounded-lg border border-line bg-white pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              <option value="All">All formats</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Mixed">Mixed</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {filteredInterviews.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
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
                    key={interview.id}
                    className="border-b border-line last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <HistoryIcon size={17} />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {interview.role}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Session #{interview.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${formatStyle(
                          interview.format,
                        )}`}
                      >
                        {interview.format}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={15} />
                        {interview.date}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {interview.questions}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex min-w-14 justify-center rounded-md px-2.5 py-1 text-xs font-bold ${scoreStyle(
                          interview.score,
                        )}`}
                      >
                        {interview.score}/10
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/interview/report"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        <Eye size={16} />
                        View
                      </Link>
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
              Try changing the search term or format filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default History;
