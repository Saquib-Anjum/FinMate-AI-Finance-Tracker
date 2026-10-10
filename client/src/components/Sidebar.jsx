import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { dummyProfileData } from "../assets/assets.jsx";
import {
  BadgeIndianRupeeIcon,
  Calendar1Icon,
  ChevronRightIcon,
  CreditCardReader,
  DollarSignIcon,
  FileTextIcon,
  Goal,
  HandIcon,
  LayoutGridIcon,
  Loader2,
  LogOutIcon,
  LucideChartNoAxesCombined,
  MenuIcon,
  Settings,
  SettingsIcon,
  Sparkles,
  UserIcon,
  UserRoundArrowLeft,
  XIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
function Sidebar() {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const {user,loading,logout} = useAuth()

  useEffect(() => {
   api.get('/profile').then(({data})=>{
    if(data.firstName) setUserName(`${data.firstName} ${data.lastName}` ||"".trim())
   })

   
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  const role = user?.role;
  const navItem = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutGridIcon,
    },
     {
      name: "Transactions",
      path: "/transactions",
      icon: CreditCardReader,
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: HandIcon,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Goal,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: LucideChartNoAxesCombined,
    },
   {
      name: "AI Assistant",
      path: "/ai",
      icon: Sparkles,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRoundArrowLeft,
    },
    
    {
      name: "Settings",
      path: "/settings",
      icon: SettingsIcon,
    },
  ];

 async function handleLogout(){
   await logout();
    window.location.href="/login"
  }
  const sidebarContent = (
    <>
      {/* Brand header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/6">
        <div className="flex items-center justify-between">
          <div className="flex itmes-center gap-3">
            <UserIcon className="text-white size-8" />
            <div className="">
              <p className="font-semibold text-[13px] text-white tracking-wide">
                {" "}
                FinMate
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                AI
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* userProfile */}
      {userName && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4 ">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
              <span className="font-bold text-slate-400 text-xl ">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[13px] text-white tracking-wide">
                {userName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {role === "ADMIN" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* navigation */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Navigation
        </p>
      </div>
      {/* navigation items */}
      <div className=" flex-1 px-3 space-y-0.5 overflow-y-auto">
        {loading?(<div className="px-3 py-3 flex items-center gap-3 text-slate-500"><Loader2 className="animate-spin w-4 h-4"/>
        <p>loading....</p></div>):(
          
          navItem.map((ele, idx) => {
          const isActive = pathname.startsWith(ele.path);
          return (
            <Link
              key={idx}
              to={ele.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${isActive ? "bg-indigo-500/12 text-indigo-300" : "text-slate-300 hover:text-white hover:bg-white/4"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
              )}
              <ele.icon
                className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-ingigo-300" : "text-slate-400 group-hover:text-slate-300"}`}
              />
              <span className="flex-1">{ele.name}</span>
              {isActive && (
                <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </Link>
          );
        })
        )}
        
      </div>

      {/* logout */}
      <div className="p-3 border-r border-white/6">
        <button 
        onClick={handleLogout}
        className=" flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150">
          <LogOutIcon className="w-[17px] h-[17px]" />
          <span className="">Log out</span>
        </button>
      </div>
    </>
  );
  return (
    <>
      {/* Mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border-white/10 text-white rounded-lg border "
      >
        <MenuIcon size={20} />
      </button>
      {/* mobile layer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-lg z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* sidebar desktop */}
      <aside className="hidden lg:flex flex-col h-full  w-65 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4">
        {sidebarContent}
      </aside>
      {/* sidebar mobile */}
      {/* sidebarMobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 to=slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;
