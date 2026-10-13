
import React, { useCallback, useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetModal from "../components/budgets/BudgetModal";
import Loading from '../components/Loading'
function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/budget/get");
      setBudgets(data.data ?? []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch budgets"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleCreate = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleSuccess = async () => {
    setShowModal(false);
    setEditingBudget(null);
    await fetchBudgets();
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Budgets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Set monthly budgets and track your spending
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={17} />
          Add Budget
        </button>
      </div>

      {/* Summary */}
      {!loading && budgets.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Total Budget</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {formatCurrency(
                budgets.reduce((sum, item) => sum + Number(item.limit || 0), 0)
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Total Spent</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {formatCurrency(
                budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0)
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {formatCurrency(
                budgets.reduce(
                  (sum, item) =>
                    sum + Number(item.limit || 0) - Number(item.spent || 0),
                  0
                )
              )}
            </p>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <Loading/>
      ) : budgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Wallet className="mx-auto h-9 w-9 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No budgets yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Create a budget to start tracking your spending.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={fetchBudgets}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <BudgetModal
          budget={editingBudget}
          onClose={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default Budgets;
