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
} from "react-icons/fi";
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
      <div className="p-8 text-center uppercase tracking-widest font-bold opacity-50">
        Loading Profile...
      </div>
    );

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
      {/* Header Profile Section */}
      <div
        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        data-aos="fade-down"
      >
        <div className="h-32 bg-gradient-to-r from-[#EE2529] to-[#C73834]"></div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#EE2529] to-[#C73834] flex items-center justify-center text-white text-3xl md:text-5xl font-bold border-4 border-white">
                {getInitials(user.name)}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left pt-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  <FiTarget className="text-[#EE2529]" />
                  {user.role}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  <FiMail className="text-[#EE2529]" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6" data-aos="fade-right">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div className="w-1 h-4 bg-[#EE2529] rounded-full"></div>
              Personal Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-[#EE2529] transition-all">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-sm font-bold text-gray-700">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-[#EE2529] transition-all">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Email ID
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-[#EE2529] transition-all">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Mobile
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    +91 {user.mobileNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div className="w-1 h-4 bg-[#EE2529] rounded-full"></div>
              Platform Access
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gray-50 flex justify-between items-center group cursor-default border border-transparent hover:border-red-100 transition-all">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Current Role
                </span>
                <span className="text-xs font-extrabold text-[#EE2529] uppercase bg-white px-3 py-1 rounded-lg shadow-sm">
                  {user.role}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Account Status
                </span>
                <span className="text-[10px] font-extrabold text-white uppercase bg-green-500 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <FiCheck size={10} /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8" data-aos="fade-left">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200">
            {["overview", "activity", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-bold uppercase tracking-widest relative transition-all ${
                  activeTab === tab
                    ? "text-[#EE2529]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#EE2529] rounded-t-full shadow-[0_-2px_6px_rgba(238,37,41,0.2)]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="min-h-[300px]">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-50 hover:shadow-lg transition-all">
                  <FiMapPin className="text-[#EE2529] mb-4" size={24} />
                  <h4 className="font-bold text-gray-800 uppercase text-sm mb-2">
                    Location
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Service area based in Mumbai, Maharashtra. Specializing in
                    high-value pre-lease transitions.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-50 hover:shadow-lg transition-all">
                  <FiCalendar className="text-[#EE2529] mb-4" size={24} />
                  <h4 className="font-bold text-gray-800 uppercase text-sm mb-2">
                    Join Date
                  </h4>
                  <p className="text-xs text-gray-500 tracking-wider">
                    Member since February 2026
                  </p>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-4 animate-fadeIn">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#EE2529]"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">
                          Logged in from new IP address
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#EE2529] tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      View Info
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-50 animate-fadeIn">
                <h4 className="font-bold text-gray-800 uppercase text-sm mb-6">
                  Password & Privacy
                </h4>
                <button className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl transition-all text-xs uppercase tracking-widest">
                  Change Login PIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
