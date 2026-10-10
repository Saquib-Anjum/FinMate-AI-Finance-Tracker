import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

function MonthlySpending({ dashboardData }) {
  const spending = dashboardData?.monthlySpendingByCategory;

  const totalExpense = spending?.totalExpense ?? 0;

  const categories = [...(spending?.categories ?? [])]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      color: COLORS[index],
    }));

  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">
          Monthly Spending
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Breakdown by expense category
        </p>
      </div>

      {categories.length === 0 || totalExpense === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <span className="text-2xl">₹</span>
          </div>

          <p className="text-sm font-semibold text-slate-600">
            No spending data yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your expense breakdown will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          {/* Donut Chart */}
          <div className="relative mx-auto h-60 w-full max-w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="88%"
                  paddingAngle={2}
                  stroke="none"
                  animationDuration={700}
                >
                  {categories.map((item) => (
                    <Cell
                      key={item.category}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold tracking-tight text-slate-800">
                {formatCurrency(totalExpense)}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Total Expense
              </p>
            </div>
          </div>

          {/* Category Legend */}
          <div className="space-y-5">
            {categories.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="truncate text-sm font-medium text-slate-600">
                    {item.category}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-semibold text-slate-700">
                  {Number(item.percentage ?? 0).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlySpending;