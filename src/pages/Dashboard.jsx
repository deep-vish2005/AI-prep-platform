import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import useAnalytics from "../hooks/useAnalytics";
import { useAuth } from "../context/AuthContext";

function scoreStyle(score) {
  if (score >= 8.5) {
    return "bg-green-50 text-green-700";
  }

  if (score >= 7.5) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
}

function Dashboard() {
  const { user } = useAuth();
  const { analytics, isLoading, error } = useAnalytics();

  const summary = analytics?.summary || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    completionRate: 0,
  };

  const metrics = [
    {
      title: "Total Interviews",
      value: isLoading ? "—" : summary.totalInterviews,
      detail: `${summary.completedInterviews} completed`,
      icon: ClipboardList,
      iconClassName: "bg-blue-50 text-blue-700",
    },
    {
      title: "Average Score",
      value: isLoading ? "—" : `${Number(summary.averageScore).toFixed(1)}`,
      detail: "Across completed interviews",
      icon: Target,
      iconClassName: "bg-violet-50 text-violet-700",
    },
    {
      title: "Best Score",
      value: isLoading ? "—" : `${Number(summary.bestScore).toFixed(1)}`,
      detail: "Your highest result",
      icon: Award,
      iconClassName: "bg-amber-50 text-amber-700",
    },
    {
      title: "Completion Rate",
      value: isLoading ? "—" : `${Number(summary.completionRate).toFixed(0)}%`,
      detail: "Completed practice sessions",
      icon: TrendingUp,
      iconClassName: "bg-green-50 text-green-700",
    },
  ];

  const recentInterviews = analytics?.recentInterviews || [];

  const recommendedPractice = (analytics?.focusAreas || []).map(
    (topic, index) => ({
      id: topic.name,
      title: topic.name,
      category: "Recommended focus",
      level: topic.priority,
      progress: topic.percentage,
      description:
        topic.priority === "High"
          ? "This is currently one of your weakest evaluated topics."
          : "Additional practice can strengthen your confidence in this topic.",
    }),
  );
  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-brand-700">
            Thursday, October 2
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            Good morning, {user?.name?.split(" ")[0] || "there"}
          </h1>

          <p className="mt-2 text-muted">
            Continue building the skills you need for your next interview.
          </p>
        </div>

        <Link
          to="/interview/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          <Play size={18} fill="currentColor" />
          Start New Interview
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <PerformanceChart data={analytics?.scoreProgression || []} />

      <section className="rounded-xl border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-6">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Recent Interviews
            </h2>
            <p className="mt-1 text-sm text-muted">
              Your latest completed practice sessions
            </p>
          </div>

          <Link
            to="/history"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-slate-50/80">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Interview
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Format
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Score
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {recentInterviews.map((interview) => (
                <tr
                  key={interview.id}
                  className="border-b border-line last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-ink">
                      {interview.role}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Practice interview
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {interview.format}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={15} />
                      {new Intl.DateTimeFormat("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(interview.createdAt))}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex min-w-14 justify-center rounded-md px-2.5 py-1 text-xs font-bold ${scoreStyle(
                        interview.score,
                      )}`}
                    >
                      {interview.score !== null
                        ? `${Number(interview.score).toFixed(1)}/10`
                        : "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                      <CheckCircle2 size={15} />
                      {interview.status === "completed"
                        ? "Completed"
                        : "In progress"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {interview.status === "completed" ? (
                      <Link
                        to={`/interview/report/${interview.id}`}
                        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        View report
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
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">
            Recommended Practice
          </h2>
          <p className="mt-1 text-sm text-muted">
            Topics selected from your recent areas for improvement
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {!isLoading && recommendedPractice.length === 0 && (
            <div className="rounded-xl border border-dashed border-line-strong bg-white p-8 text-center lg:col-span-3">
              <p className="text-sm font-medium text-muted">
                Complete an interview to receive topic recommendations.
              </p>
            </div>
          )}
          {recommendedPractice.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {item.category}
                </span>

                <span className="text-xs font-medium text-muted">
                  {item.level}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-ink">
                {item.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                {item.description}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-medium">
                  <span className="text-muted">Current confidence</span>
                  <span className="text-ink">{item.progress}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <Link
                to="/interview/new"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Practice topic
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
