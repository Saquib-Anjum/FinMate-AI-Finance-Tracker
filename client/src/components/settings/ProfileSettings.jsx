
import React, { useState } from "react";
import { UserRound, Save, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../api/axios";

const ProfileSettings = ({ initialName = "" }) => {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  React.useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return setMessage({ type: "error", text: "Name is required." });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.patch("/account/change-name", {
        name: trimmedName,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update name.");
      }

      setName(data.data?.name || trimmedName);
      setMessage({
        type: "success",
        text: data.message || "Name updated successfully.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Unable to update name.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <UserRound size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Personal information</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the name associated with your account.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label htmlFor="account-name" className="mb-2 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            disabled={loading}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
          />
        </div>

        {message.text && (
          <div className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p>{message.text}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Saving changes..." : "Save changes"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSettings;
