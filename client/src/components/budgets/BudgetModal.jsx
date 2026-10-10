
import React from "react";
import { X } from "lucide-react";
import BudgetForm from "./BudgetForm";

function BudgetModal({ budget, onClose, onSuccess }) {
  const editing = Boolean(budget);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? "Edit Budget" : "Create Budget"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Set a spending limit for a category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          <BudgetForm
            budget={budget}
            onCancel={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default BudgetModal;
