
import React, { useState } from "react";
import { Edit2, Trash2, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getCategoryIcon } from "../../constants/categories";

const COLORS = [
  { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  { bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500" },
  { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" },
  { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

function BudgetCard({ budget, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const Icon = getCategoryIcon(budget.category);

  const limit = Number(budget.limit) || 0;
  const spent = Number(budget.spent) || 0;
  const remaining = limit - spent;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;

  const color = percentage >= 100
    ? { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" }
    : COLORS[
        Math.abs(
          budget.category
            .split("")
            .reduce((sum, char) => sum + char.charCodeAt(0), 0)
        ) % COLORS.length
      ];

  const handleDelete = async () => {
    if (!window.confirm(`Delete the ${budget.category} budget?`)) return;

    try {
      setDeleting(true);
      await api.delete(`/budget/delete/${budget._id}`);
      toast.success("Budget deleted successfully");
      await onDelete();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete budget"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Title and amounts */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`}>
            <Icon size={20} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">
              {budget.category}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {formatCurrency(spent)}
              </span>
              {" / "}
              {formatCurrency(limit)}
            </p>
          </div>
        </div>

        <span className={`shrink-0 text-xs font-semibold ${color.text}`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${budget.category} budget usage`}
        aria-valuenow={Math.min(percentage, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Remaining and actions */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          {remaining >= 0 ? "Remaining " : "Over budget "}
          <span className={`font-semibold ${remaining < 0 ? "text-rose-600" : "text-slate-700"}`}>
            {formatCurrency(Math.abs(remaining))}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit2 size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Delete ${budget.category} budget`}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;
