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
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium tracking-widest text-[10px] uppercase animate-pulse">
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
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden px-4 py-6 md:px-8 md:py-10">
      {/* Background blobs - subtle */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6"
        >
          {/* Banner - Compact */}
          <div className="h-32 md:h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-red-900/90 animate-gradient-xy"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="absolute bottom-3 right-4">
              <button className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all border border-white/20">
                <FiCamera size={14} />
              </button>
            </div>
          </div>

          {/* Profile Basic Info - Refined */}
          <div className="px-6 pb-8">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 -mt-10 md:-mt-12">
              <div className="relative group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 transition-transform duration-300">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-inner">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
              </div>

              <div className="flex-1 text-center md:text-left pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100/50">
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs font-medium">
                    <FiMail className="text-red-500/80" size={14} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs font-medium">
                    <FiPhone className="text-red-500/80" size={14} />
                    <span>+91 {user.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats - Compact */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60"
            >
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                Platform Status
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 border border-slate-100">
                      <FiSettings size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Access
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md uppercase">
                    Unlimited
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-green-500 border border-slate-100">
                      <FiCheck size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Account
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-green-100 text-green-700 rounded-md uppercase">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Security Card - Modern & Small */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>

              <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                Security
              </h3>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <FiShield className="text-red-400 text-lg" />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold uppercase tracking-tight">
                    2FA Is Active
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    High protection level
                  </p>
                </div>
              </div>

              <button className="w-full py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20">
                Update Settings
              </button>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Custom Tab Bar - Sleek */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-1 rounded-xl shadow-sm flex border border-slate-200/60"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[14px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[300px]"
              >
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200/60 group hover:border-red-100 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 border border-slate-100">
                        <FiMapPin size={18} />
                      </div>
                      <h4 className="font-bold text-slate-700 uppercase text-[11px] mb-2 tracking-wide">
                        Location Context
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        Authorized service region: Mumbai HQ. Cross-region
                        administrative privileges active.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200/60 group hover:border-orange-100 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 border border-slate-100">
                        <FiCalendar size={18} />
                      </div>
                      <h4 className="font-bold text-slate-700 uppercase text-[11px] mb-2 tracking-wide">
                        Member Timeline
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        Account established: Feb 15, 2026. Consistent track
                        record with superior task completion.
                      </p>
                    </div>

                    <div className="md:col-span-2 p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300/60 italic relative overflow-hidden group">
                      <div className="absolute -bottom-4 -right-4 opacity-5 text-slate-900 transition-all group-hover:scale-110">
                        <FiTarget size={100} />
                      </div>
                      <h4 className="text-[9px] font-bold text-red-500 uppercase tracking-[3px] mb-3">
                        Professional Note
                      </h4>
                      <p className="text-slate-600 text-[12px] leading-relaxed max-w-2xl relative z-10">
                        "Committed to excellence in pre-lease property
                        management and client relationship building. Expert in
                        administrative workflows and digital transformation of
                        property assets."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-3">
                    {[
                      {
                        action: "Login detected from Mumbai IP",
                        time: "11 Mins ago",
                        color: "bg-red-500",
                      },
                      {
                        action: "Updated Property Listing #9921",
                        time: "2 Hours ago",
                        color: "bg-blue-500",
                      },
                      {
                        action: "Password changed successfully",
                        time: "1 Day ago",
                        color: "bg-green-500",
                      },
                    ].map((activity, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center justify-between group hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-2 h-2 rounded-full ${activity.color} animate-pulse shadow-sm`}
                          ></div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
                              {activity.action}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-300 group-hover:text-slate-500 transition-all" />
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200/60 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 border border-red-100/50">
                      <FiShield size={28} />
                    </div>
                    <h4 className="font-bold text-slate-800 uppercase text-sm mb-3 tracking-tight">
                      Vault Security Setup
                    </h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mb-8 leading-relaxed italic">
                      Biometric and PIN methods are active. We recommend
                      refreshing your access keys every 90 days.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                        Devices
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

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
