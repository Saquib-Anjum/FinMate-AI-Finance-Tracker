
import React, { useState } from "react";
import {
  LockKeyhole, X, Eye, EyeOff, LoaderCircle,
  CheckCircle2, AlertCircle, ShieldCheck
} from "lucide-react";
import api from "../../api/axios";

const ChangePasswordModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const resetForm = () => {
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setVisible({ oldPassword: false, newPassword: false, confirmPassword: false });
    setMessage({ type: "", text: "" });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      return setMessage({ type: "error", text: "New password must contain at least 8 characters." });
    }

    if (form.newPassword !== form.confirmPassword) {
      return setMessage({ type: "error", text: "New passwords do not match." });
    }

    if (form.oldPassword === form.newPassword) {
      return setMessage({ type: "error", text: "Choose a different new password." });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.patch("/account/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update password.");
      }

      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setVisible({ oldPassword: false, newPassword: false, confirmPassword: false });
      setMessage({
        type: "success",
        text: data.message || "Password updated successfully.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Unable to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const fields = [
    { key: "oldPassword", label: "Current password", autocomplete: "current-password" },
    { key: "newPassword", label: "New password", autocomplete: "new-password" },
    { key: "confirmPassword", label: "Confirm new password", autocomplete: "new-password" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 id="password-modal-title" className="font-semibold text-slate-900">
                Change password
              </h2>
              <p className="mt-1 text-sm text-slate-500">Keep your account secure.</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} disabled={loading} aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="flex gap-3 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">
            <ShieldCheck size={19} className="shrink-0" />
            <p>Use a strong password that you don't use on other websites.</p>
          </div>

          {message.text && (
            <div role="status" aria-live="polite" className={`flex gap-2 rounded-xl border p-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p>{message.text}</p>
            </div>
          )}

          {fields.map(({ key, label, autocomplete }) => (
            <div key={key}>
              <label htmlFor={key} className="mb-2 block text-sm font-medium text-slate-700">
                {label}
              </label>
              <div className="relative">
                <input
                  id={key}
                  name={key}
                  type={visible[key] ? "text" : "password"}
                  autoComplete={autocomplete}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  minLength={key !== "oldPassword" ? 8 : undefined}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button type="button" aria-label={visible[key] ? "Hide password" : "Show password"}
                  onClick={() => setVisible((prev) => ({ ...prev, [key]: !prev[key] }))}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {visible[key] ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
