import React, { useEffect, useState } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import ProfileHeader from "../components/profiles/ProfileHeader";
import ProfileCard from "../components/profiles/ProfileCard";
import ProfileForm from "../components/profiles/ProfileForm";
import Loading from '../components/Loading.jsx'
const initialForm = {
  bio: "",
  phone: "",
  country: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch the profile when the page opens.
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/profile/get");

        if (!data.success) {
          throw new Error(data.message || "Unable to load profile.");
        }

        const profileData = data.data;

        if (cancelled) return;

        setProfile(profileData);

        setFormData({
          bio: profileData.bio || "",
          phone: profileData.phone || "",
          country: profileData.country || "",
          currency: profileData.currency || "INR",
          timezone: profileData.timezone || "Asia/Kolkata",
        });

        setAvatarPreview(profileData.avatar || "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load your profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Update text fields.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // 3. Preview the selected avatar.
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // 4. Save profile changes.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const payload = new FormData();

      payload.append("bio", formData.bio);
      payload.append("phone", formData.phone);
      payload.append("country", formData.country);
      payload.append("currency", formData.currency);
      payload.append("timezone", formData.timezone);

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const { data } = await api.put("/profile/update", payload);

      if (!data.success) {
        throw new Error(data.message || "Unable to update profile.");
      }

      // Use returned profile data when your controller provides it.
      const updatedProfile = data.data;

      if (updatedProfile) {
        setProfile(updatedProfile);

        setFormData({
          bio: updatedProfile.bio ?? formData.bio,
          phone: updatedProfile.phone ?? formData.phone,
          country: updatedProfile.country ?? formData.country,
          currency: updatedProfile.currency ?? formData.currency,
          timezone: updatedProfile.timezone ?? formData.timezone,
        });

        setAvatarPreview(updatedProfile.avatar || avatarPreview);
      } else {
        // Supports update APIs that return only success/message.
        setProfile((previous) => ({
          ...previous,
          ...formData,
        }));
      }

      setAvatarFile(null);
      toast.success(data.message || "Profile updated successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // 5. Loading state.
  if (loading) {
    return <Loading/>
  }

  // 6. Error state.
  if (error && !profile) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center">
        <AlertCircle
          size={36}
          className="mx-auto mb-3 text-rose-500"
        />

        <h2 className="font-bold text-slate-900">
          Couldn't load your profile
        </h2>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Try again
        </button>
      </div>
    );
  }

  // 7. Profile page.
  return (
    <div className="min-h-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader />

        {error && (
          <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {error}
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileCard
            user={user}
            profile={profile}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
          />

          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;