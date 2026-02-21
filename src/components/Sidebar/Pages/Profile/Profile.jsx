import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiTarget,
  FiEdit3,
  FiCheck,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiActivity,
  FiInfo,
  FiSettings,
  FiCamera,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase animate-pulse">
            Loading Profile...
          </p>
        </div>
      </div>
    );

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiInfo /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "security", label: "Security", icon: <FiShield /> },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden px-4 py-8 md:p-12">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-bounce"
          style={{ transitionDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-red-100 overflow-hidden mb-8 border border-white"
        >
          {/* Banner */}
          <div className="h-48 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 animate-gradient-xy"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Banner Decoration */}
            <div className="absolute bottom-4 right-6 flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all border border-white/30">
                <FiCamera size={16} />
              </button>
            </div>
          </div>

          {/* Profile Basic Info */}
          <div className="px-8 pb-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8 -mt-16">
              <div className="relative group">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white p-2 shadow-2xl border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white text-4xl md:text-6xl font-black shadow-inner border-4 border-white">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest border border-red-100 italic">
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-red-200 transition-colors cursor-pointer">
                    <FiMail className="text-red-500" />
                    <span className="text-sm font-bold truncate max-w-[200px]">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-red-200 transition-colors cursor-pointer">
                    <FiPhone className="text-red-500" />
                    <span className="text-sm font-bold tracking-widest">
                      +91 {user.mobileNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <FiEdit3 /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Bio & Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] shadow-xl p-8 border border-white"
            >
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                Platform Status
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-red-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <FiSettings />
                    </div>
                    <span className="text-xs font-black text-slate-500 uppercase">
                      Access
                    </span>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-800">
                    UNLIMITED
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-green-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                      <FiCheck />
                    </div>
                    <span className="text-xs font-black text-slate-500 uppercase">
                      Account
                    </span>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-green-50 rounded-lg border border-green-100 text-green-600">
                    VERIFIED
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Verification Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/40 transition-all"></div>
              <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                Account Security
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase mb-1 leading-none tracking-tight">
                      2FA Active
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Extra layer of security enabled
                    </p>
                  </div>
                </div>
                <button className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg shadow-red-900/50 transition-all active:scale-95">
                  Update Settings
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Tabbed Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Custom Tab Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 border border-slate-100"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-lg shadow-red-200 scale-[1.02]"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] bg-white shadow-xl shadow-slate-100 border border-slate-100 group hover:border-red-200 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                        <FiMapPin size={24} />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase text-sm mb-3 tracking-tight">
                        Location Context
                      </h4>
                      <p className="text-xs text-slate-500 leading-loose italic">
                        Authorized service region: Mumbai HQ. Cross-region
                        administrative privileges active for all Tier-1 property
                        categories.
                      </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white shadow-xl shadow-slate-100 border border-slate-100 group hover:border-red-200 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        <FiCalendar size={24} />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase text-sm mb-3 tracking-tight">
                        Member Timeline
                      </h4>
                      <p className="text-xs text-slate-500 leading-loose italic">
                        Account established: Feb 15, 2026. Consistent activity
                        track record with superior task completion ratio.
                      </p>
                    </div>

                    <div className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white shadow-xl border border-slate-100 italic relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 opacity-5 text-slate-900 group-hover:opacity-10 transition-all">
                        <FiTarget size={160} />
                      </div>
                      <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[3px] mb-4">
                        Professional Note
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                        "Committed to excellence in pre-lease property
                        management and client relationship building. Expert in
                        administrative workflows and digital transformation of
                        property assets."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-4">
                    {[
                      {
                        action: "Login detected from Mumbai IP",
                        time: "11 Mins ago",
                        type: "system",
                      },
                      {
                        action: "Updated Property Listing #9921",
                        time: "2 Hours ago",
                        type: "action",
                      },
                      {
                        action: "Password changed successfully",
                        time: "1 Day ago",
                        type: "secure",
                      },
                    ].map((activity, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="p-6 bg-white rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 flex items-center justify-between group hover:border-red-200 transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-3 h-3 rounded-full ${i === 0 ? "bg-red-600" : "bg-slate-300"} animate-pulse`}
                          ></div>
                          <div>
                            <p className="text-sm font-black text-slate-800 leading-none mb-1.5 uppercase tracking-tight">
                              {activity.action}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-300 group-hover:text-red-500 transition-all" />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 mb-8 border border-red-100">
                      <FiShield size={40} />
                    </div>
                    <h4 className="font-black text-slate-800 uppercase text-xl mb-4 tracking-tighter">
                      Vault Security Setup
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mb-10 leading-relaxed italic">
                      Your biometric and PIN authentication methods are up to
                      date. We recommend changing your PIN every 90 days for
                      maximum integrity.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[2px] hover:bg-black transition-all shadow-xl active:scale-95">
                        Update Login PIN
                      </button>
                      <button className="px-10 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[2px] hover:bg-slate-50 transition-all active:scale-95">
                        Manage Devices
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global Style for Animations */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
