import React, { useState, useEffect } from "react";
import {
  Palette,
  Eye,
  CalendarDays,
  Bell,
  BrainCircuit,
  Save,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loading from "../Loading";

const defaultSettings = {
  theme: "system",
  hideBalances: false,
  financialMonthStart: 1,
  defaultDashboardPeriod: "month",
  notifications: {
    budgetAlerts: true,
    goalAlerts: true,
    billReminders: true,
    emailSummaries: false,
  },
  aiInsightsEnabled: true,
  aiResponseStyle: "concise",
};

function SettingsForm() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch settings");
        }

        const saved = data.data || {};

        setSettings({
          ...defaultSettings,
          ...saved,
          notifications: {
            ...defaultSettings.notifications,
            ...(saved.notifications || {}),
          },
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch settings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    if (name.startsWith("notifications.")) {
      const key = name.split(".")[1];

      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: nextValue,
        },
      }));

      return;
    }

    setSettings((prev) => ({
      ...prev,
      [name]: name === "financialMonthStart" ? Number(nextValue) : nextValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.patch("/settings", settings);

      if (!data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      setSettings((prev) => ({
        ...prev,
        ...data.data,
        notifications: {
          ...prev.notifications,
          ...(data.data?.notifications || {}),
        },
      }));

      toast.success(data.message || "Settings saved successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );

  const Toggle = ({ name, label, description, checked }) => (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        className="h-5 w-5 cursor-pointer accent-indigo-600"
      />
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Appearance */}
      <section className={sectionClass}>
        <SectionHeader
          icon={Palette}
          title="Appearance"
          description="Personalize how FinMate looks and displays your finances."
        />

        <div className="max-w-md">
          <label
            htmlFor="theme"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System default</option>
          </select>
        </div>

        <div className="mt-4 border-t border-slate-100">
          <Toggle
            name="hideBalances"
            label="Hide account balances"
            description="Hide financial amounts on your dashboard for privacy."
            checked={settings.hideBalances}
          />
        </div>
      </section>

      {/* Financial Preferences */}
      <section className={sectionClass}>
        <SectionHeader
          icon={CalendarDays}
          title="Financial Preferences"
          description="Choose how your financial periods are organized."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="financialMonthStart"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Financial month starts on
            </label>
            <select
              id="financialMonthStart"
              name="financialMonthStart"
              value={settings.financialMonthStart}
              onChange={handleChange}
              className={inputClass}
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="defaultDashboardPeriod"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Default dashboard period
            </label>
            <select
              id="defaultDashboardPeriod"
              name="defaultDashboardPeriod"
              value={settings.defaultDashboardPeriod}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className={sectionClass}>
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Control your financial reminders and updates."
        />

        <div className="divide-y divide-slate-100">
          <Toggle
            name="notifications.budgetAlerts"
            label="Budget alerts"
            description="Get notified when spending approaches budget limits."
            checked={settings.notifications.budgetAlerts}
          />
          <Toggle
            name="notifications.goalAlerts"
            label="Savings goal alerts"
            description="Receive updates about your savings goals."
            checked={settings.notifications.goalAlerts}
          />
          <Toggle
            name="notifications.billReminders"
            label="Bill reminders"
            description="Get reminders for upcoming bills."
            checked={settings.notifications.billReminders}
          />
          <Toggle
            name="notifications.emailSummaries"
            label="Email summaries"
            description="Receive financial summaries through email."
            checked={settings.notifications.emailSummaries}
          />
        </div>
      </section>

      {/* AI Preferences */}
      <section className={sectionClass}>
        <SectionHeader
          icon={BrainCircuit}
          title="AI Preferences"
          description="Personalize FinMate's AI-powered financial assistance."
        />

        <Toggle
          name="aiInsightsEnabled"
          label="AI financial insights"
          description="Allow FinMate to provide AI-powered spending insights."
          checked={settings.aiInsightsEnabled}
        />

        <div className="border-t border-slate-100 pt-5">
          <label
            htmlFor="aiResponseStyle"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            AI response style
          </label>
          <select
            id="aiResponseStyle"
            name="aiResponseStyle"
            value={settings.aiResponseStyle}
            onChange={handleChange}
            className={inputClass}
            disabled={!settings.aiInsightsEnabled}
          >
            <option value="concise">Concise — short and direct</option>
            <option value="detailed">Detailed — more explanation</option>
          </select>
        </div>
      </section>

      {/* Single Save Button */}
      <div className="flex flex-col gap-3 border-t border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Your changes are saved when you click Save Changes.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default SettingsForm;
