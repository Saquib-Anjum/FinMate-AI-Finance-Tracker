
import React, { useState } from "react";
import { Plus, X, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function AddMoneyModal({ goal, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const target = Number(goal.targetAmount) || 0;
  const saved = Number(goal.savedAmount) || 0;
  const remaining = Math.max(0, target - saved);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contribution = Number(amount);

    if (!Number.isFinite(contribution) || contribution <= 0) {
      toast.error("Enter an amount greater than zero");
      return;
    }

    if (contribution > remaining) {
      toast.error(
        `You only need ${formatCurrency(remaining)} to reach this goal`
      );
      return;
    }

    try {
      setSubmitting(true);

      // Requires the backend route described below.
      await api.post(`/goal/add-money/${goal._id}`, {
        amount: contribution,
      });

      toast.success("Money added to your goal");
      await onSuccess();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add money"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Add Money
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Contribute towards your financial goal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {goal.title}
            </p>

            <div className="mt-3 flex justify-between gap-3 text-xs">
              <span className="text-slate-500">Already saved</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(saved)}
              </span>
            </div>

            <div className="mt-2 flex justify-between gap-3 text-xs">
              <span className="text-slate-500">Remaining target</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="contribution"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Contribution Amount (₹)
            </label>

            <input
              id="contribution"
              type="number"
              min="0.01"
              max={remaining}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || remaining <= 0}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {submitting ? "Adding..." : "Add Money"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMoneyModal;
