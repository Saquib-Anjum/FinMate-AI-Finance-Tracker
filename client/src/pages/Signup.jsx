import React from "react";
import { Navigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import LoginLeftSideBar from "../components/LoginLeftSideBar";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import SignupForm from "../components/auth/SignupForm";

function Signup() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="h-dvh w-full overflow-hidden md:grid md:grid-cols-2">
      <style>{`
        @keyframes fm-form-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .fm-form-in { opacity: 0; animation: fm-form-in .7s ease-out .2s forwards; }
        @media (prefers-reduced-motion: reduce) { .fm-form-in { animation: none; opacity: 1; } }
      `}</style>

      <aside className="hidden h-full min-w-0 md:block">
        <LoginLeftSideBar />
      </aside>

      <main className="relative flex h-full min-w-0 overflow-y-auto bg-white px-6 sm:px-10">
        {/* Back arrow button */}
        <Link
          to="/"
          aria-label="Back to home"
          className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:-translate-x-0.5 hover:border-green-600 hover:text-green-600 sm:left-8 sm:top-8"
        >
          <ArrowLeftIcon size={18} />
        </Link>

        {/* m-auto centers the form, and still lets it scroll from the top on very short screens */}
        <div className="fm-form-in m-auto w-full max-w-sm py-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Start tracking in under a minute.
            </p>
          </div>

          <SignupForm />
        </div>
      </main>
    </div>
  );
}

export default Signup;