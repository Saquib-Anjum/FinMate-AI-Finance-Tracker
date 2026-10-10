import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { CATEGORY } from "../../constants/categories";

function getInitialForm(transaction) {
  return {
    title: transaction?.title ?? "",
    amount: transaction?.amount ?? "",
    type: transaction?.type ?? "Expense",
    category: transaction?.category ?? "Food",
    date: transaction?.date
      ? new Date(transaction.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}

function TransactionForm({ transaction, onCancel, onSuccess }) {
  const [form, setForm] = useState(() => getInitialForm(transaction));
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const amount = Number(form.amount);

  if (!form.title.trim()) {
    toast.error("Please enter a transaction title");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    toast.error("Amount must be greater than zero");
    return;
  }

  const payload = {
    title: form.title.trim(),
    amount,
    type: form.type,
    category: form.category,
    date: form.date,
  };

  try {
    setSubmitting(true);

    const id = transaction?._id || transaction?.id;

    if (id) {
      await api.put(`/transactions/update/${id}`, payload);
      toast.success("Transaction updated successfully");
    } else {
      await api.post("/transactions/create", payload);
      toast.success("Transaction added successfully");
    }

    await onSuccess();
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to save transaction"
    );
  } finally {
    setSubmitting(false);
  }
};

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Title
        </label>

        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. October Salary"
          className={inputClass}
          maxLength={100}
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Amount (₹)
        </label>

        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className={inputClass}
          required
        />
      </div>

      {/* Type and category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="type"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Type
          </label>

          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
            required
          >
            {CATEGORY.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="date"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Date
        </label>

        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <LoaderCircle size={16} className="animate-spin" />}

          {submitting
            ? "Saving..."
            : transaction
              ? "Save Changes"
              : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
