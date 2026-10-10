
import React, { useState } from "react";
import { Edit2, Trash2, Receipt, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
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
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

function TransactionTable({
  transactions,
  loading,
  onEdit,
  onRefresh,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (transaction) => {
    const id = transaction._id || transaction.id;

    if (!id) {
      toast.error("Transaction ID is missing");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete "${transaction.title}"?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      // Assumes DELETE /transactions/:id.
      await api.delete(`/transactions/delete/${id}`);

      toast.success("Transaction deleted");
      await onRefresh();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete transaction"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {["Date", "Title", "Category", "Type", "Amount", "Action"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-semibold text-slate-500"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                  <p className="mt-2 text-xs text-slate-400">
                    Loading transactions...
                  </p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Receipt className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    No transactions found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your filters or add a transaction.
                  </p>
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const id = transaction._id || transaction.id;
                const isIncome =
                  transaction.type?.toLowerCase() === "income";
                const Icon = getCategoryIcon(transaction.category);

                return (
                  <tr
                    key={id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {formatDate(transaction.date)}
                    </td>

                    <td className="max-w-52 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon size={16} />
                        </span>

                        <span
                          title={transaction.title}
                          className="truncate text-xs font-semibold text-slate-700"
                        >
                          {transaction.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td
                      className={`whitespace-nowrap px-4 py-3 text-xs font-bold ${
                        isIncome ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit transaction"
                          aria-label="Edit transaction"
                          onClick={() => onEdit(transaction)}
                          className="rounded-md p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          type="button"
                          title="Delete transaction"
                          aria-label="Delete transaction"
                          disabled={deletingId === id}
                          onClick={() => handleDelete(transaction)}
                          className="rounded-md p-1.5 text-rose-500 transition hover:bg-rose-50 disabled:opacity-40"
                        >
                          {deletingId === id ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
