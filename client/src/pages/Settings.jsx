import React, { useState } from "react";
import {
  Settings2,
  ShieldCheck,
  LockKeyhole,
  Trash2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import ProfileSettings from "../components/settings/ProfileSettings";
import SettingsForm from "../components/settings/SettingsForm";

import ChangePasswordModal from "../components/settings/ChangePasswordModal";
import DeleteAccountModal from "../components/settings/DeleteAccountModal";
import { useAuth } from "../context/AuthContext";

const Settings = ({ onAccountDeleted }) => {
  const { user, logout } = useAuth();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAccountDeleted = async () => {
    setDeleteOpen(false);

    if (onAccountDeleted) {
      onAccountDeleted();
      return;
    }

    if (logout) {
      await logout();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-600/20">
              <Settings2 size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Manage your personal information, account security, and
                preferences.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Profile Settings */}
        <section className="mb-8">
          <ProfileSettings initialName={user?.name || ""} />
        </section>

        {/* 2. Account Security */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Security</h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep your FinMate account protected.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <LockKeyhole size={20} className="mt-1 text-slate-400" />

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Password
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Change your password to keep your account secure.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Change password
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* 3. Danger Zone */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
          <div className="border-b border-rose-100 bg-rose-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
                <Trash2 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Danger zone
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Permanently remove your FinMate account.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-semibold text-slate-800">Delete account</h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Account deletion may permanently remove your profile and
                financial data. Make sure you understand the consequences before
                proceeding.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={17} />
              Delete account
            </button>
          </div>
        </section>

        {/* 4. Application Preferences - One Form, One Save Button */}
        <section className="mb-8">
          <SettingsForm />
        </section>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles size={14} />
          <span>FinMate · Your finances, organized.</span>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleAccountDeleted}
      />
    </main>
  );
};

export default Settings;
