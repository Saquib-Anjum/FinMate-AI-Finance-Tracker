
import React, { useState } from "react";
import { AlertTriangle, Trash2, X, LoaderCircle } from "lucide-react";
import api from "../../api/axios";

const DeleteAccountModal = ({ open, onClose, onDeleted }) => {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (loading) return;
    setConfirmation("");
    setError("");
    onClose();
  };

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      return setError('Type "DELETE" to confirm account deletion.');
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.delete("/account/delete-account");

      if (!data.success) {
        throw new Error(data.message || "Failed to delete account.");
      }

      setConfirmation("");
      onDeleted?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to delete account.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <AlertTriangle size={23} />
            </div>
            <div>
              <h2 id="delete-title" className="font-semibold text-slate-900">Delete account</h2>
              <p className="mt-1 text-sm text-slate-500">This action cannot be undone.</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} disabled={loading} aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm leading-6 text-rose-800">
            Deleting your account may permanently remove your profile and financial data.
            Make sure you understand what will be deleted before continuing.
          </p>
        </div>

        <label htmlFor="delete-confirmation" className="mt-5 mb-2 block text-sm font-medium text-slate-700">
          Type <span className="font-bold text-rose-600">DELETE</span> to confirm
        </label>
        <input
          id="delete-confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          disabled={loading}
          placeholder="Type DELETE"
          autoComplete="off"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:bg-slate-50"
        />

        {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleClose} disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleDelete}
            disabled={loading || confirmation !== "DELETE"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {loading ? "Deleting..." : "Delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
