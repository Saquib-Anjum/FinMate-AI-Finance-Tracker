import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import Loading from "../components/Loading";
import api from "../api/axios";
import toast from "react-hot-toast";
import DashboardCard from "../components/dashboard/DashboardCard";
import RecentTransaction from "../components/dashboard/RecentTransaction";
import MonthlySpending from "../components/dashboard/MonthlySpending";
import { useAuth } from "../context/AuthContext";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  });

  // Fetch dashboard data for the selected month
  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const res = await api.get("/dashboard/get", {
          params: {
            month: selectedMonth.month,
            year: selectedMonth.year,
          },
        });

        if (!cancelled) {
          setDashboardData(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load dashboard",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [selectedMonth.month, selectedMonth.year]);

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split("-").map(Number);

    setSelectedMonth({ month, year });
  };

  const monthValue = `${selectedMonth.year}-${String(
    selectedMonth.month,
  ).padStart(2, "0")}`;

  const formattedMonth = `${MONTHS[selectedMonth.month - 1]} ${
    selectedMonth.year
  }`;

  // TODO: Integrate profile data from your profile context/API.
  // const { profile } = useProfile();

  if (loading && !dashboardData) {
    return <Loading />;
  }

  if (!dashboardData && !loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-slate-500">Failed to load dashboard data.</p>

        <button
          onClick={() => {
            setSelectedMonth({ ...selectedMonth });
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search anything..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell size={20} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Profile */}
            <button
              type="button"
              // TODO: Navigate to your profile page when ready.
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {(user?.name || user?.fullName || "U").charAt(0).toUpperCase()}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-xs font-semibold text-slate-800">
                  {user?.name || user?.fullName || "Your Account"}
                </p>

                <p className="max-w-32 truncate text-[11px] text-slate-400">
                  {user?.email || ""}
                </p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-400 sm:block"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-blue-600" />

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back,{" "}
              <span className="font-semibold text-slate-700">
                {user?.name || user?.fullName || "there"}
              </span>
              ! 👋
            </p>
          </div>

          {/* Month Selector */}
          <div className="relative w-full sm:w-auto">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={monthValue}
              onChange={handleMonthChange}
              aria-label="Select dashboard month"
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 sm:w-44"
            >
              {Array.from({ length: 24 }, (_, index) => {
                const date = new Date(
                  selectedMonth.year,
                  selectedMonth.month - 1 - index,
                  1,
                );

                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const value = `${year}-${String(month).padStart(2, "0")}`;

                return (
                  <option key={value} value={value}>
                    {MONTHS[month - 1]} {year}
                  </option>
                );
              })}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Dashboard Content */}
        {loading && (
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Updating dashboard...
          </div>
        )}

        <div className="space-y-6">
          {/* Summary Cards */}
          <section aria-label="Financial summary">
            <DashboardCard dashboardData={dashboardData} user={user} />
          </section>

          {/* Transactions + Monthly Spending */}
          <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <RecentTransaction dashboardData={dashboardData} />

            <MonthlySpending dashboardData={dashboardData} />
          </section>

          {/* TODO: Add profile details when profile context is ready. */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
