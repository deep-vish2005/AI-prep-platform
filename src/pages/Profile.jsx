import {
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    targetRole: "",
    experienceLevel: "Beginner",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name || "",
      targetRole: user.targetRole || "Software Engineer",
      experienceLevel: user.experienceLevel || "Beginner",
    });
  }, [user]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await updateProfile(form);
      setSuccess(response.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-700">Account</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
          Profile
        </h1>

        <p className="mt-2 text-muted">
          Manage the information used to personalize your experience.
        </p>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-line bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-700">
            {initial}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-ink">{user?.name}</h2>

          <p className="mt-1 text-sm text-muted">{user?.email}</p>

          <div className="mt-5 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Member since
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {user?.createdAt
                ? new Intl.DateTimeFormat("en-IN", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(user.createdAt))
                : "—"}
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-line bg-white shadow-sm"
        >
          <div className="border-b border-line p-5 md:px-6">
            <h2 className="font-semibold text-ink">Personal information</h2>

            <p className="mt-1 text-sm text-muted">
              These details help personalize interview sessions.
            </p>
          </div>

          <div className="space-y-5 p-5 md:p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <UserRound size={16} />
                Full name
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={updateField}
                required
                className="h-11 w-full rounded-lg border border-line-strong px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <Mail size={16} />
                Email address
              </label>

              <input
                id="email"
                value={user?.email || ""}
                disabled
                className="h-11 w-full cursor-not-allowed rounded-lg border border-line bg-slate-50 px-3.5 text-sm text-slate-500"
              />

              <p className="mt-2 text-xs text-muted">
                Email changes are not supported yet.
              </p>
            </div>

            <div>
              <label
                htmlFor="targetRole"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <BriefcaseBusiness size={16} />
                Target role
              </label>

              <input
                id="targetRole"
                name="targetRole"
                value={form.targetRole}
                onChange={updateField}
                placeholder="For example: Frontend Engineer"
                className="h-11 w-full rounded-lg border border-line-strong px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Experience level
              </label>

              <select
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={updateField}
                className="h-11 w-full rounded-lg border border-line-strong bg-white px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t border-line p-5 md:px-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save size={17} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;
