import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CalendarDays,
  Download,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAnalytics from "../hooks/useAnalytics";

function AnalyticsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 shadow-lg">
      {label && <p className="text-xs font-medium text-muted">{label}</p>}

      <p className="mt-1 text-sm font-bold text-brand-700">
        {payload[0].value}
        {payload[0].dataKey === "score" ? "/10" : " interviews"}
      </p>
    </div>
  );
}

function Analytics() {
  const { analytics, isLoading, error } = useAnalytics();

  const summary = analytics?.summary || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    completionRate: 0,
  };

  const analyticsScoreData = analytics?.scoreProgression || [];
  const interviewFormats = analytics?.formatDistribution || [];
  const monthlyActivity = analytics?.monthlyActivity || [];

  const strongestTopics = (analytics?.strongestTopics || []).map((topic) => ({
    name: topic.name,
    score: topic.percentage,
    interviews: topic.questionsEvaluated,
  }));

  const focusAreas = (analytics?.focusAreas || []).map((topic) => ({
    name: topic.name,
    score: topic.percentage,
    priority: topic.priority,
    recommendation:
      topic.priority === "High"
        ? "Prioritize this topic in your next practice session."
        : "Continue practising this topic to improve consistency.",
  }));

  const metrics = [
    {
      label: "Total interviews",
      value: isLoading ? "—" : summary.totalInterviews,
      detail: `${summary.completedInterviews} completed`,
      icon: CalendarDays,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      label: "Average score",
      value: isLoading ? "—" : Number(summary.averageScore).toFixed(1),
      detail: "Across completed sessions",
      icon: Target,
      iconStyle: "bg-violet-50 text-violet-700",
    },
    {
      label: "Completion rate",
      value: isLoading ? "—" : `${Number(summary.completionRate).toFixed(0)}%`,
      detail: "Of all started sessions",
      icon: Award,
      iconStyle: "bg-green-50 text-green-700",
    },
    {
      label: "Best score",
      value: isLoading ? "—" : Number(summary.bestScore).toFixed(1),
      detail: "Highest completed result",
      icon: Flame,
      iconStyle: "bg-amber-50 text-amber-700",
    },
  ];
  function downloadAnalytics() {
    function csvCell(value) {
      const normalizedValue =
        value === null || value === undefined ? "" : String(value);

      return `"${normalizedValue.replace(/"/g, '""')}"`;
    }

    const rows = [
      ["Section", "Metric", "Label", "Value"],

      ["Summary", "Total interviews", "", summary.totalInterviews],
      ["Summary", "Completed interviews", "", summary.completedInterviews],
      ["Summary", "Average score", "", summary.averageScore],
      ["Summary", "Best score", "", summary.bestScore],
      ["Summary", "Completion rate", "", `${summary.completionRate}%`],

      ...analyticsScoreData.map((item) => [
        "Score progression",
        "Interview score",
        item.label,
        item.score,
      ]),

      ...interviewFormats.map((item) => [
        "Format distribution",
        item.name,
        `${item.count || 0} interviews`,
        `${item.value}%`,
      ]),

      ...(analytics?.topicPerformance || []).map((item) => [
        "Topic performance",
        item.name,
        `${item.questionsEvaluated} questions evaluated`,
        `${item.percentage}%`,
      ]),

      ...monthlyActivity.map((item) => [
        "Monthly activity",
        "Completed interviews",
        item.month,
        item.interviews,
      ]),
    ];

    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

    const file = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "devprep-performance-analytics.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Preparation insights
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            Performance Analytics
          </h1>

          <p className="mt-2 text-muted">
            Track your progress and identify the topics that need attention.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadAnalytics}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download size={17} />
          Export CSV
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-xl border border-line bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">
                    {metric.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
                    {metric.value}
                  </p>
                </div>

                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${metric.iconStyle}`}
                >
                  <Icon size={20} />
                </span>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                {metric.detail}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <article className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-ink">
                Score progression over time
              </h2>
              <p className="mt-1 text-sm text-muted">
                Average interview performance during the last 30 days
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 self-start rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
              <ArrowUpRight size={14} />
              {analyticsScoreData.length} completed sessions
            </span>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsScoreData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <Tooltip content={<AnalyticsTooltip />} />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  dot={{
                    fill: "#ffffff",
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    fill: "#2563eb",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
          <div>
            <h2 className="font-semibold text-ink">Format distribution</h2>
            <p className="mt-1 text-sm text-muted">
              Your completed interview types
            </p>
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interviewFormats}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {interviewFormats.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {interviewFormats.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>

                <span className="text-sm font-bold text-ink">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-5 md:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <TrendingUp size={20} />
              </span>

              <div>
                <h2 className="font-semibold text-ink">Strongest topics</h2>
                <p className="text-sm text-muted">
                  Areas where you consistently perform well
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-line">
            {!isLoading && strongestTopics.length === 0 && (
              <div className="p-8 text-center text-sm text-muted">
                Complete evaluated interviews to see topic strengths.
              </div>
            )}
            {strongestTopics.map((topic) => (
              <div key={topic.name} className="p-5 md:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {topic.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {topic.interviews} completed interviews
                    </p>
                  </div>

                  <span className="rounded-md bg-green-50 px-2.5 py-1 text-sm font-bold text-green-700">
                    {topic.score}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-5 md:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Target size={20} />
              </span>

              <div>
                <h2 className="font-semibold text-ink">Targeted focus areas</h2>
                <p className="text-sm text-muted">
                  Topics recommended for your next sessions
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-line">
            {!isLoading && strongestTopics.length === 0 && (
              <div className="p-8 text-center text-sm text-muted">
                Complete evaluated interviews to see topic strengths.
              </div>
            )}
            {focusAreas.map((topic) => (
              <div key={topic.name} className="p-5 md:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">
                        {topic.name}
                      </p>

                      <span
                        className={[
                          "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          topic.priority === "High"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {topic.priority} priority
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {topic.recommendation}
                    </p>
                  </div>

                  <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-amber-700">
                    <ArrowDownRight size={15} />
                    {topic.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-line bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
            <Activity size={20} />
          </span>

          <div>
            <h2 className="font-semibold text-ink">
              Monthly interview activity
            </h2>
            <p className="text-sm text-muted">
              Number of completed sessions during the last six months
            </p>
          </div>
        </div>

        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyActivity}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <Tooltip content={<AnalyticsTooltip />} />

              <Bar
                dataKey="interviews"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
