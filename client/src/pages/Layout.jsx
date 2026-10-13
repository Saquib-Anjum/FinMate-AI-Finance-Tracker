import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading.jsx";

function Layout() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="fixed inset-0 flex h-dvh w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <aside className="h-full shrink-0 overflow-hidden">
        <Sidebar />
      </aside>

      <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-400 p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
