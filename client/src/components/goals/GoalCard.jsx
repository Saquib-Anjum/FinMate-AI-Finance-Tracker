
import React, { useState } from "react";
import {
  Laptop,
  ShieldCheck,
  Plane,
  Bike,
  House,
  Target,
  Plus,
  Pencil,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const goalStyles = [
  { bg: "bg-indigo-50", text: "text-indigo-600", bar: "bg-indigo-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" },
  { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
];

function getGoalIcon(title) {
  const text = title?.toLowerCase() ?? "";

  if (text.includes("macbook") || text.includes("laptop")) return Laptop;
  if (text.includes("emergency") || text.includes("fund")) return ShieldCheck;
  if (text.includes("trip") || text.includes("travel")) return Plane;
  if (text.includes("bike") || text.includes("bicycle")) return Bike;
  if (text.includes("house") || text.includes("home")) return House;

  return Target;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function GoalCard({ goal, onEdit, onAddMoney, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const target = Number(goal.targetAmount) || 0;
  const saved = Number(goal.savedAmount) || 0;
  const remaining = target - saved;
  const percentage = target > 0 ? (saved / target) * 100 : 0;

  const Icon = getGoalIcon(goal.title);

  const style =
    goalStyles[
      Math.abs(
        (goal.title || "").split("").reduce(
          (sum, char) => sum + char.charCodeAt(0),
          0
        )
      ) % goalStyles.length
    ];

  const handleDelete = async () => {
    if (!window.confirm(`Delete goal "${goal.title}"?`)) return;

    try {
      setDeleting(true);
      await api.delete(`/goal/delete/${goal._id}`);
      toast.success("Goal deleted successfully");
      await onDelete();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete goal");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Goal details */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
        >
          <Icon size={21} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-800">
            {goal.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Target: {formatCurrency(target)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <span className="w-9 text-right text-xs font-semibold text-slate-600">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Saved / target */}
      <p className="mt-2 text-xs text-slate-500">
        <span className="font-semibold text-emerald-600">
          {formatCurrency(saved)}
        </span>
        {" / "}
        {formatCurrency(target)}
      </p>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onAddMoney(goal)}
          disabled={remaining <= 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={13} />
          Add Money
        </button>

        <button
          type="button"
          onClick={() => onEdit(goal)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Pencil size={13} />
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${goal.title}`}
          className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
        >
          {deleting ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </article>
  );
}

export default GoalCard;
