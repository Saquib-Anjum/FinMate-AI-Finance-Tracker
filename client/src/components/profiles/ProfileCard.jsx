import React from "react";
import { Camera, MapPin, CalendarDays, ShieldCheck } from "lucide-react";

function ProfileCard({ user, profile, avatarPreview, onAvatarChange }) {
  const name = user?.name || "FinMate User";
  const email = user?.email || "Email unavailable";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-purple-600 via-teal-500 to-rose-100" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-12 flex items-end justify-between">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-emerald-50 text-2xl font-bold text-emerald-700 shadow-sm">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${name}'s avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || "U"
              )}
            </div>

            <label
              title="Change profile photo"
              className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
          </div>

          <span className="mb-1 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck size={14} />
            Profile
          </span>
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-bold text-slate-900">{name}</h2>
          <p className="mt-1 break-all text-sm text-slate-500">{email}</p>

          {profile?.bio && (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <MapPin size={17} className="shrink-0 text-slate-400" />
            <span>{profile?.country || "Country not added"}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <CalendarDays size={17} className="shrink-0 text-slate-400" />
            <span>
              Joined{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "recently"}
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-400">
          Use the camera icon to choose a new profile picture. Save your
          changes using the form.
        </p>
      </div>
    </section>
  );
}

export default ProfileCard;