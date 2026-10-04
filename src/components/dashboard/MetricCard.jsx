import { ArrowUpRight } from "lucide-react";

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  iconClassName = "bg-blue-50 text-blue-700",
  trend,
}) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
            {value}
          </p>
        </div>

        <div
          className={`flex size-10 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{detail}</p>

        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <ArrowUpRight size={14} />
            {trend}
          </span>
        )}
      </div>
    </article>
  );
}

export default MetricCard;
