
import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CalendarDays,
  CircleDollarSign,
  Target,
  ReceiptText,
  ChevronDown,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import api from "../api/axios";

// ==========================================
// HELPERS
// ==========================================

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const categoryColors = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
  "#f97316",
  "#64748b",
];

// ==========================================
// MAIN ANALYTICS PAGE
// ==========================================

function Analytics() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch analytics whenever the selected month or year changes.
  useEffect(() => {
    let cancelled = false;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/analytics", {
          params: { month, year },
        });

        if (!data.success) {
          throw new Error(data.message || "Unable to load analytics.");
        }

        if (!cancelled) {
          setAnalytics(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load analytics."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [month, year]);

  const summary = analytics?.summary;
  const budgets = analytics?.budgets;
  const goals = analytics?.goals;
  const spending = analytics?.monthlySpendingByCategory || [];
  const trend = analytics?.monthlyTrend || [];
  const transactions = analytics?.recentTransactions || [];

  const maxTrendValue = Math.max(
    1,
    ...trend.flatMap((item) => [
      item.income || 0,
      item.expense || 0,
      item.savings || 0,
    ])
  );

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-72 rounded-lg bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-36 rounded-2xl bg-white" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-80 rounded-2xl bg-white" />
            <div className="h-80 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error && !analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-rose-500" size={38} />
          <h2 className="text-lg font-bold text-slate-900">
            Couldn't load analytics
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => {
              setAnalytics(null);
              setLoading(true);
              setError("");
              // Trigger a fresh request with the same filters.
              setMonth((current) => current);
              setYear((current) => current);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* PAGE HEADER */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
           
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Financial analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Understand your money. Make better financial decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <CalendarDays size={17} className="text-emerald-600" />
              <select
                aria-label="Select month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="max-w-36 bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="text-slate-400" />
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <select
                aria-label="Select year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                {Array.from(
                  { length: 6 },
                  (_, index) => today.getFullYear() - 5 + index
                ).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="text-slate-400" />
            </label>
          </div>
        </header>

        {/* REQUEST STATUS */}
        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not refresh the selected period: {error}
          </div>
        )}

        {loading && analytics && (
          <p className="text-xs text-slate-400">Updating analytics...</p>
        )}

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total balance"
            value={formatCurrency(summary?.totalBalance)}
            subtitle="Income minus expenses"
            icon={Wallet}
            color="emerald"
          />

          <MetricCard
            title="Total income"
            value={formatCurrency(summary?.totalIncome)}
            subtitle={
              summary?.incomeChange == null
                ? "No previous-period comparison"
                : `${summary.incomeChange >= 0 ? "+" : ""}${summary.incomeChange}% vs previous period`
            }
            icon={TrendingUp}
            color="blue"
            change={summary?.incomeChange}
          />

          <MetricCard
            title="Total expenses"
            value={formatCurrency(summary?.totalExpense)}
            subtitle={
              summary?.expenseChange == null
                ? "No previous-period comparison"
                : `${summary.expenseChange >= 0 ? "+" : ""}${summary.expenseChange}% vs previous period`
            }
            icon={TrendingDown}
            color="rose"
            change={summary?.expenseChange}
          />

          <MetricCard
            title="Net savings"
            value={formatCurrency(summary?.netSavings)}
            subtitle={`${summary?.savingsRate ?? 0}% savings rate`}
            icon={PiggyBank}
            color="violet"
          />
        </section>

        {/* TREND + CATEGORY BREAKDOWN */}
        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

          {/* MONTHLY TREND */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">
                  Income vs expenses
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Your monthly financial performance
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <Legend color="bg-emerald-500" label="Income" />
                <Legend color="bg-rose-400" label="Expenses" />
              </div>
            </div>

            <div className="mt-7 flex h-56 gap-3">
              <div className="flex flex-col justify-between pb-7 text-[10px] text-slate-400">
                <span>{formatCompact(maxTrendValue)}</span>
                <span>{formatCompact(maxTrendValue * 0.66)}</span>
                <span>{formatCompact(maxTrendValue * 0.33)}</span>
                <span>₹0</span>
              </div>

              <div className="relative flex min-w-0 flex-1 items-end justify-around gap-2 border-b border-slate-100 pb-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((line) => (
                    <div key={line} className="border-t border-dashed border-slate-100" />
                  ))}
                </div>

                {trend.map((item) => (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="relative z-10 flex h-full min-w-0 flex-1 items-end justify-center gap-1"
                  >
                    <div
                      title={`Income: ${formatCurrency(item.income)}`}
                      className="w-3 max-w-[35%] rounded-t-md bg-emerald-500 transition-all sm:w-5"
                      style={{
                        height: `${Math.max(
                          item.income > 0 ? 2 : 0,
                          (item.income / maxTrendValue) * 100
                        )}%`,
                      }}
                    />

                    <div
                      title={`Expenses: ${formatCurrency(item.expense)}`}
                      className="w-3 max-w-[35%] rounded-t-md bg-rose-400 transition-all sm:w-5"
                      style={{
                        height: `${Math.max(
                          item.expense > 0 ? 2 : 0,
                          (item.expense / maxTrendValue) * 100
                        )}%`,
                      }}
                    />

                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <MiniStat label="Income" value={formatCurrency(summary?.totalIncome)} />
              <MiniStat label="Expenses" value={formatCurrency(summary?.totalExpense)} />
              <MiniStat label="Transactions" value={summary?.transactionCount ?? 0} />
            </div>
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Spending by category
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Where your money went this month
              </p>
            </div>

            {spending.length === 0 ? (
              <EmptyState message="No expense categories for this period." />
            ) : (
              <>
                <div className="my-7 flex items-center justify-center">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(${spending
                        .map((item, index) => {
                          const start = spending
                            .slice(0, index)
                            .reduce(
                              (total, category) =>
                                total + (Number(category.percentage) || 0),
                              0
                            );
                          const end =
                            start + (Number(item.percentage) || 0);
                          return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`;
                        })
                        .join(", ")})`,
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                      <p className="text-xs text-slate-400">Total spent</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatCurrency(summary?.totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {spending.map((item, index) => (
                    <div key={item.category}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                categoryColors[index % categoryColors.length],
                            }}
                          />
                          <span className="truncate text-sm font-medium text-slate-700">
                            {item.category}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatCurrency(item.amount)}
                          </span>
                          <span className="ml-2 text-xs text-slate-400">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(0, item.percentage || 0))}%`,
                            backgroundColor:
                              categoryColors[index % categoryColors.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* BUDGETS + GOALS */}
        <section className="grid gap-6 xl:grid-cols-2">

          {/* BUDGET HEALTH */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">Budget overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Spending against your monthly limits
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <CircleDollarSign size={20} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4">
              <MiniStat label="Budget limit" value={formatCurrency(budgets?.totalLimit)} />
              <MiniStat label="Spent" value={formatCurrency(budgets?.totalSpent)} />
              <MiniStat label="Remaining" value={formatCurrency(budgets?.totalRemaining)} />
            </div>

            <div className="mt-6 space-y-5">
              {(budgets?.categories || []).map((item) => {
                const overBudget = item.spent > item.limit;
                const percentage = item.percentageUsed || 0;

                return (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {item.category}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatCurrency(item.spent)} of {formatCurrency(item.limit)}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          overBudget ? "text-rose-600" : "text-slate-500"
                        }`}
                      >
                        {percentage.toFixed(percentage % 1 ? 1 : 0)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          overBudget ? "bg-rose-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(0, percentage))}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1.5 text-right text-[11px] text-slate-400">
                      {overBudget
                        ? `${formatCurrency(item.spent - item.limit)} over budget`
                        : `${formatCurrency(item.remaining)} remaining`}
                    </p>
                  </div>
                );
              })}

              {!budgets?.categories?.length && (
                <EmptyState message="No budgets found for this period." />
              )}
            </div>
          </div>

          {/* SAVINGS GOALS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900">Savings goals</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Keep moving toward what matters
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <Target size={20} />
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-violet-50/70 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-violet-700">Total saved</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatCurrency(goals?.totalSaved)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    of {formatCurrency(goals?.totalTarget)}
                  </p>
                </div>

                <p className="text-lg font-bold text-violet-700">
                  {(goals?.overallProgress ?? 0).toFixed(1)}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, goals?.overallProgress || 0))}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {(goals?.items || []).map((goal) => (
                <div key={goal._id}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {goal.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatCurrency(goal.savedAmount)} saved of{" "}
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-violet-600">
                      {(goal.progressPercentage ?? 0).toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, goal.progressPercentage || 0))}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1.5 text-right text-[11px] text-slate-400">
                    {formatCurrency(goal.remainingAmount)} to go
                  </p>
                </div>
              ))}

              {!goals?.items?.length && (
                <EmptyState message="Create a savings goal to track your progress." />
              )}
            </div>
          </div>
        </section>

        {/* RECENT TRANSACTIONS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">Recent transactions</h2>
              <p className="mt-1 text-xs text-slate-500">
                Activity for the selected period
              </p>
            </div>

            <ReceiptText size={20} className="text-slate-400" />
          </div>

          {transactions.length === 0 ? (
            <EmptyState message="No transactions found for this period." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => {
                    const isIncome = transaction.type === "Income";

                    return (
                      <tr
                        key={transaction._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-500"
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownRight size={18} />
                              ) : (
                                <ArrowUpRight size={18} />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {transaction.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {transaction.type}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {transaction.category}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                          {formatDate(transaction.date)}
                        </td>

                        <td
                          className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${
                            isIncome ? "text-emerald-600" : "text-slate-800"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 sm:px-6">
            <p className="text-xs text-slate-400">
              {transactions.length} transactions displayed
            </p>
            <span className="text-xs text-slate-400">
              {monthNames[month - 1]} {year}
            </span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex items-center justify-center gap-2 pb-2 text-xs text-slate-400">
          <BarChart3 size={14} />
          Your financial overview for {monthNames[month - 1]} {year}
        </footer>
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE UI HELPERS
// ==========================================

function MetricCard({ title, value, subtitle, icon: Icon, color, change }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-3 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        {change != null && (
          change >= 0
            ? <ArrowUpRight size={14} className="text-emerald-600" />
            : <ArrowDownRight size={14} className="text-rose-600" />
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 sm:text-xs">{label}</p>
      <p className="mt-1 break-words text-xs font-bold text-slate-800 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-500">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-24 items-center justify-center px-5 py-8 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function formatCompact(amount) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }

  return `₹${Math.round(amount)}`;
}

export default Analytics;
