import { CheckCircle2, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Role-specific interview questions",
  "Immediate answer evaluation",
  "Detailed performance analytics",
];

function AuthLayout({ title, description, children }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.1fr]">
      <section className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-2.5 self-start">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Code2 size={21} />
          </span>

          <span>
            <span className="block text-base font-bold leading-none text-ink">
              DevPrep AI
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">
              Interview Studio
            </span>
          </span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>

          <div className="mt-8">{children}</div>
        </div>

        <p className="text-center text-xs text-slate-400">© 2026 DevPrep AI</p>
      </section>

      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.3),transparent_40%)]" />

        <div className="relative mx-auto max-w-lg">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            Deliberate interview practice
          </p>

          <h2 className="mt-5 text-4xl font-bold leading-tight">
            Practise with context. Improve with specific feedback.
          </h2>

          <p className="mt-5 leading-7 text-slate-300">
            Prepare for technical and behavioral interviews through focused,
            repeatable AI-assisted sessions.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-blue-400" />
                <span className="text-sm font-medium text-slate-200">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default AuthLayout;
