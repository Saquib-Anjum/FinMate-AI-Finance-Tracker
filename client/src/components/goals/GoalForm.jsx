
import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

function GoalForm({ goal, onCancel, onSuccess }) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [targetAmount, setTargetAmount] = useState(
    goal?.targetAmount ?? ""
  );
  const [savedAmount, setSavedAmount] = useState(
    goal?.savedAmount ?? 0
  );
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (!title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    if (!Number.isFinite(target) || target <= 0) {
      toast.error("Target amount must be greater than zero");
      return;
    }

    if (!Number.isFinite(saved) || saved < 0 || saved > target) {
      toast.error("Saved amount must be between zero and the target");
      return;
    }

    const payload = {
      title: title.trim(),
      targetAmount: target,
      savedAmount: saved,
    };

    try {
      setSubmitting(true);

      if (goal?._id) {
        await api.put(`/goal/update/${goal._id}`, payload);
        toast.success("Goal updated successfully");
      } else {
        await api.post("/goal/create", payload);
        toast.success("Goal created successfully");
      }

      await onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save goal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="goal-title"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Goal Title
        </label>
        <input
          id="goal-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Buy a MacBook"
          maxLength={100}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label
          htmlFor="goal-target"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Target Amount (₹)
        </label>
        <input
          id="goal-target"
          type="number"
          min="0.01"
          step="0.01"
          value={targetAmount}
          onChange={(event) => setTargetAmount(event.target.value)}
          placeholder="Enter target amount"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label
          htmlFor="goal-saved"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Already Saved (₹)
        </label>
        <input
          id="goal-saved"
          type="number"
          min="0"
          step="0.01"
          value={savedAmount}
          onChange={(event) => setSavedAmount(event.target.value)}
          className={inputClass}
          required
        />
        <p className="mt-1.5 text-xs text-slate-400">
          For new goals, this can start at zero.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting && (
            <LoaderCircle size={16} className="animate-spin" />
          )}
          {submitting ? "Saving..." : goal ? "Save Changes" : "Create Goal"}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;
