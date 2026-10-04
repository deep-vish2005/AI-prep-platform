import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import api from "../services/api";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
          className="h-11 w-full rounded-lg border border-line-strong px-3.5 pr-11 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />

        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function toggleVisibility(field) {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess(response.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to change your password.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-700">
          Account preferences
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
          Settings
        </h1>

        <p className="mt-2 text-muted">
          Manage account security and application preferences.
        </p>
      </section>

      <section className="rounded-xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-line p-5 md:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <KeyRound size={20} />
          </span>

          <div>
            <h2 className="font-semibold text-ink">Change password</h2>

            <p className="text-sm text-muted">
              Use a strong password you don’t use elsewhere.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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

            <PasswordInput
              id="currentPassword"
              label="Current password"
              value={form.currentPassword}
              onChange={updateField}
              show={visibility.currentPassword}
              onToggle={() => toggleVisibility("currentPassword")}
              autoComplete="current-password"
            />

            <PasswordInput
              id="newPassword"
              label="New password"
              value={form.newPassword}
              onChange={updateField}
              show={visibility.newPassword}
              onToggle={() => toggleVisibility("newPassword")}
              autoComplete="new-password"
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm new password"
              value={form.confirmPassword}
              onChange={updateField}
              show={visibility.confirmPassword}
              onToggle={() => toggleVisibility("confirmPassword")}
              autoComplete="new-password"
            />

            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-slate-600"
              />

              <p className="text-sm leading-6 text-muted">
                Passwords are hashed using bcrypt before being stored. Your
                plain-text password is never saved.
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-line p-5 md:px-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save size={17} />
              {isSaving ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Settings;
