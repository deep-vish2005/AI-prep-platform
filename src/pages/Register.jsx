import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start practising interviews tailored to your target role."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            placeholder="Your name"
            className="h-11 w-full rounded-lg border border-line-strong px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-line-strong px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={updateField}
              placeholder="At least 8 characters"
              className="h-11 w-full rounded-lg border border-line-strong px-3.5 pr-11 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <UserPlus size={18} />
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
