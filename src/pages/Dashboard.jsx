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
import { recentInterviews, recommendedPractice } from "../data/dashboardData";

const metrics = [
  {
    title: "Total Interviews",
    value: "24",
    detail: "4 completed this week",
    icon: ClipboardList,
    iconClassName: "bg-blue-50 text-blue-700",
    trend: "12%",
  },
  {
    title: "Average Score",
    value: "8.4",
    detail: "Across all interviews",
    icon: Target,
    iconClassName: "bg-violet-50 text-violet-700",
    trend: "0.6",
  },
  {
    title: "Best Score",
    value: "9.6",
    detail: "Frontend Engineer",
    icon: Award,
    iconClassName: "bg-amber-50 text-amber-700",
  },
  {
    title: "Improvement",
    value: "+18%",
    detail: "Compared with last month",
    icon: TrendingUp,
    iconClassName: "bg-green-50 text-green-700",
    trend: "5%",
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

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-brand-700">
            Thursday, October 2
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            Good morning, Deep
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

      <PerformanceChart />

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
                      {interview.type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={15} />
                      {interview.date}
                    </span>
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

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                      <CheckCircle2 size={15} />
                      {interview.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/interview/report"
                      className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      View report
                    </Link>
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
