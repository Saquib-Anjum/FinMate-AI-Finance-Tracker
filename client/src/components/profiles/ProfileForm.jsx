import React from "react";
import { Save, LoaderCircle } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10";

function ProfileForm({
  formData,
  onChange,
  onSubmit,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Personal information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update the information associated with your profile.
        </p>
      </div>

      <div className="space-y-5">
        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="text-sm font-medium text-slate-700"
          >
            About you
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={300}
            value={formData.bio}
            onChange={onChange}
            placeholder="Tell us a little about yourself..."
            className={`${inputClass} resize-y`}
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {formData.bio.length}/300
          </p>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="text-sm font-medium text-slate-700"
          >
            Phone number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={onChange}
            placeholder="Enter your phone number"
            className={inputClass}
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="text-sm font-medium text-slate-700"
          >
            Country
          </label>

          <input
            id="country"
            name="country"
            autoComplete="country-name"
            value={formData.country}
            onChange={onChange}
            placeholder="Enter your country"
            className={inputClass}
          />
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="text-sm font-medium text-slate-700"
          >
            Preferred currency
          </label>

          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={onChange}
            className={inputClass}
          >
            <option value="INR">INR — Indian Rupee (₹)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
            <option value="GBP">GBP — British Pound (£)</option>
            <option value="AED">AED — UAE Dirham</option>
            <option value="CAD">CAD — Canadian Dollar</option>
            <option value="AUD">AUD — Australian Dollar</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label
            htmlFor="timezone"
            className="text-sm font-medium text-slate-700"
          >
            Time zone
          </label>

          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={onChange}
            className={inputClass}
          >
            <option value="Asia/Kolkata">India Standard Time (Asia/Kolkata)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (America/New_York)</option>
            <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
            <option value="Europe/London">London (Europe/London)</option>
            <option value="Europe/Paris">Central European Time (Europe/Paris)</option>
            <option value="Asia/Dubai">Gulf Standard Time (Asia/Dubai)</option>
            <option value="Asia/Singapore">Singapore (Asia/Singapore)</option>
            <option value="Australia/Sydney">Sydney (Australia/Sydney)</option>
          </select>
        </div>
      </div>

      <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}

          {saving ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;