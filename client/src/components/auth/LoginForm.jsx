import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import OAuthButtons from "./OAuthButtons";

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard",{ replace: true });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || err.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@gmail.com"
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={`${inputClasses} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Sign up
        </Link>
      </p>
      <OAuthButtons/>
    </>
  );
}

export default LoginForm;