import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";
//import { getCategoryIcon } from "../../constants/categories";
import { getCategoryIcon } from "../../constants/categories";
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

function RecentTransaction({ dashboardData }) {
  const navigate = useNavigate();

  const transactions = dashboardData?.recentTransactions ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 sm:px-6">
        <h2 className="text-base font-bold text-slate-800 sm:text-lg">
          Recent Transactions
        </h2>

        <button
          type="button"
          onClick={() => navigate("/transactions")}
          className="text-sm font-semibold text-blue-600 underline underline-offset-4 transition hover:text-blue-700"
        >
          View All
        </button>
      </div>

      {/* Transaction List */}
      <div className="px-4 pb-2 sm:px-6">
        {transactions.length === 0 ? (
          <div className="py-10 text-center">
            <CircleDollarSign className="mx-auto mb-3 h-10 w-10 text-slate-300" />

            <p className="text-sm font-medium text-slate-600">
              No transactions yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your recent transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((transaction) => {
              const isIncome =
                transaction.type?.toLowerCase() === "income";

              const Icon = getCategoryIcon(transaction.category);

              return (
                <div
                  key={transaction._id}
                  className="flex items-center gap-3 py-4 sm:gap-4"
                >
                  {/* Category Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                      isIncome
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  {/* Transaction Details */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-semibold text-slate-800"
                      title={transaction.title}
                    >
                      {transaction.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(transaction.date)}
                    </p>

                    {/* Mobile Category */}
                    <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 sm:hidden">
                      {transaction.category}
                    </span>
                  </div>

                  {/* Desktop Category */}
                  <div className="hidden shrink-0 sm:block">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {transaction.category}
                    </span>
                  </div>

                  {/* Amount */}
                  <div
                    className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-bold sm:text-base ${
                      isIncome
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}

                    <span>
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentTransaction;