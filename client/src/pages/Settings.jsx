import React, { useState, useEffect } from "react";
import { dummyProfileData } from "../assets/assets";
import { Lock } from "lucide-react";
import Loading from "../components/Loading";
import ProfileForm from "../components/settings/ProfileForm";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const {user} = useAuth();
  const fetchProfile = async () => {
try{
const res = await api.get('/profile');
const profile = res.data;
if(profile){
  setProfile(profile);
}
}catch(err){
toast.error(err.message);
}finally{
setLoading(false)
}

  };

  useEffect(() => {
    fetchProfile();
  }, [user]);
  if (loading) return <Loading />;
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your accounts and preferences</p>
      </div>
      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}
      {/* change password */}
      <div className="card max-w-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-salte-100 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <div className="">
            <p className="font-medium text-slate-900">Password</p>
            <p className="font-xs text-slate-600">
              Update your account password
            </p>
          </div>
        </div>
        <button
          className="btn-secondary text-sm"
          onClick={() => setShowPasswordModal(true)}
        >
          Change
        </button>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={()=>setShowPasswordModal(false)}/>
    </div>
  );
}

export default Settings;
