
import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { CATEGORY } from "../../constants/categories";

function BudgetForm({ budget, onCancel, onSuccess }) {
  const [category, setCategory] = useState(budget?.category ?? "");
  const [limit, setLimit] = useState(budget?.limit ?? "");
  const [spent, setSpent] = useState(budget?.spent ?? 0);
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numericLimit = Number(limit);
    const numericSpent = Number(spent);

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      toast.error("Budget limit must be greater than zero");
      return;
    }

    if (!Number.isFinite(numericSpent) || numericSpent < 0) {
      toast.error("Spent amount cannot be negative");
      return;
    }

    const payload = {
      category,
      limit: numericLimit,
      spent: numericSpent,
    };

    try {
      setSubmitting(true);

      if (budget?._id) {
        await api.put(`/budget/update/${budget._id}`, payload);
        toast.success("Budget updated successfully");
      } else {
        await api.post("/budget/create", payload);
        toast.success("Budget created successfully");
      }

      await onSuccess();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save budget"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="budget-category"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Category
        </label>

        <select
          id="budget-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={inputClass}
          required
        >
          <option value="" disabled>
            Select category
          </option>

          {CATEGORY.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="budget-limit"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Budget Limit (₹)
        </label>

        <input
          id="budget-limit"
          type="number"
          min="0.01"
          step="0.01"
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
          placeholder="Enter budget limit"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label
          htmlFor="budget-spent"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Amount Spent (₹)
        </label>

        <input
          id="budget-spent"
          type="number"
          min="0"
          step="0.01"
          value={spent}
          onChange={(event) => setSpent(event.target.value)}
          placeholder="0"
          className={inputClass}
          required
        />

        <p className="mt-1.5 text-xs text-slate-400">
          Usually calculated from transactions. Update this only if your backend supports manual spending.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <LoaderCircle size={16} className="animate-spin" />
          )}
          {submitting
            ? "Saving..."
            : budget
              ? "Save Changes"
              : "Create Budget"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
