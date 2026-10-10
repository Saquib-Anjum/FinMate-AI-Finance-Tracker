import { Loader2, Save, User } from "lucide-react";
import React, { useState } from "react";
import api from "../../api/axios";

function ProfileForm({ initialData, onSuccess }) {
  //console.log("Profile data:", initialData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);

    //console.log("Bio being sent:", formData.get("bio"));

    try {
      const response = await api.post("/profile", formData);

      //console.log("Profile update response:", response.data);

      setMessage(
        response.data?.message || "Profile updated successfully"
      );

      onSuccess?.();
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 mb-6">
      {/* Header */}
      <h2 className="text-base font-medium text-slate-900 mb-6 pb-6 border-b border-slate-100 flex items-center gap-2">
        <User className="w-4 h-4 text-slate-600" />
        Public Profile
      </h2>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Employee Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>

            <input
              type="text"
              disabled
              value={`${initialData.firstName || ""} ${
                initialData.lastName || ""
              }`.trim()}
              className="w-full bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              disabled
              value={initialData.email || ""}
              className="w-full bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>

            <input
              type="text"
              disabled
              value={initialData.position || ""}
              className="w-full bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio
          </label>

          <textarea
            name="bio"
            defaultValue={initialData.bio || ""}
            disabled={initialData?.isDeleted === true}
            rows={5}
            className={`w-full resize-none ${
              initialData?.isDeleted === true
                ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                : ""
            }`}
            placeholder="Write a brief bio"
          />

          <p className="text-slate-500 text-xs mt-3">
            This will be displayed in your profile.
          </p>
        </div>

        {/* Account Status / Save */}
        {initialData.isDeleted === true ? (
          <div className="pt-2">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <p className="text-rose-600 font-medium tracking-tight">
                Account Deactivated
              </p>

              <p className="text-sm text-rose-500 mt-0.5">
                You can no longer update your profile
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default ProfileForm;
