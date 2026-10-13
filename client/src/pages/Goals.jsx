
import React, { useCallback, useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import GoalCard from "../components/goals/GoalCard";
import GoalModal from "../components/goals/GoalModal";
import AddMoneyModal from "../components/goals/AddMoneyModal";
import Loading from  '../components/Loading'
function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [addingMoneyGoal, setAddingMoneyGoal] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/goal/get");
      setGoals(data.data ?? []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch goals"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSuccess = async () => {
    setShowGoalModal(false);
    setAddingMoneyGoal(null);
    setEditingGoal(null);
    await fetchGoals();
  };

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.savedAmount || 0),
    0
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Financial Goals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Set your goals and make your dreams a reality
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGoal(null);
            setShowGoalModal(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={17} />
          Add Goal
        </button>
      </div>

      {/* Summary */}
      {!loading && goals.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Total Target</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {formatCurrency(totalTarget)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Total Saved</p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {formatCurrency(totalSaved)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {formatCurrency(totalTarget - totalSaved)}
            </p>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <Loading/>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={(item) => {
                setEditingGoal(item);
                setShowGoalModal(true);
              }}
              onAddMoney={setAddingMoneyGoal}
              onDelete={fetchGoals}
            />
          ))}

          {/* Create Goal Card */}
          <button
            type="button"
            onClick={() => {
              setEditingGoal(null);
              setShowGoalModal(true);
            }}
            className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center transition hover:border-blue-300 hover:bg-blue-50/30"
          >
            <Plus size={22} className="text-slate-600" />
            <span className="mt-2 text-sm font-semibold text-slate-700">
              Create New Goal
            </span>
            <span className="mt-1 text-xs text-slate-400">
              Set a new financial goal
            </span>
          </button>

          {goals.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-5 text-center">
              <Target className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">
                Create your first goal to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Goal */}
      {showGoalModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => {
            setShowGoalModal(false);
            setEditingGoal(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {/* Add Money */}
      {addingMoneyGoal && (
        <AddMoneyModal
          goal={addingMoneyGoal}
          onClose={() => setAddingMoneyGoal(null)}
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

export default Goals;
