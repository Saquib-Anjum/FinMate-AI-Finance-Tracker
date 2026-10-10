import React, { useState } from "react";
import { LockIcon, X, Send, Loader2Icon, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      //console.log("Change password response:", data);

      if (!data?.success) {
        throw new Error(data?.error || "Failed to update password");
      }

      setMessage({
        type: "success",
        text: data?.message || "Password updated successfully",
      });

     e.target.reset();

      setShowCurrentPassword(false);
      setShowNewPassword(false);
    } catch (err) {
      console.error("Change password error:", err);

      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-slate-600" />
            Change Password
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Message */}
          {message.text && (
            <div
              className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  message.type === "success" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />

              <p>{message.text}</p>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Current Password
            </label>

            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter current password"
                className="w-full pr-11"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                required
                minLength={6}
                autoComplete="new-password"
                disabled={loading}
                placeholder="Enter new password"
                className="w-full pr-11"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2Icon className="animate-spin w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}

              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
