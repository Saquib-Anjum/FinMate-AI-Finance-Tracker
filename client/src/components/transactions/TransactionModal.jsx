
import React from "react";
import { X } from "lucide-react";
import TransactionForm from "./TransactionForm";

function TransactionModal({ transaction, onClose, onSuccess }) {
  const isEditing = Boolean(transaction);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update your transaction details"
                : "Record your income or expense"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          <TransactionForm
            transaction={transaction}
            onCancel={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
