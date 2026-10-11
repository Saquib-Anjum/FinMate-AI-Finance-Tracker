import React from "react";
import { UserRound } from "lucide-react";

function ProfileHeader() {
  return (
    <header className="mb-8">
      

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <UserRound size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and public profile.
          </p>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;