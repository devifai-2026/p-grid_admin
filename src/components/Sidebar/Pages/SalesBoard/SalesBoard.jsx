import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowRight,
  FiPlus,
  FiActivity,
  FiUser,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useUserStorage } from "../../../../helpers/useUserStorage";
import { apiCall } from "../../../../helpers/apicall/apiCall";

const SalesBoard = () => {
  const { user } = useUserStorage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    stats: {
      totalAssigned: 0,
      verifiedCount: 0,
      pendingCount: 0,
      partialCount: 0,
    },
    recentTasks: [],
    chartData: [],
  });

  const fetchSalesData = () => {
    setLoading(true);
    // Note: We use the existing analytics endpoint but it will be filtered
    // by assigned properties for the logged-in executive on the backend or frontend
    // For this design, we'll fetch general analytics and filter if needed,
    // or assume the backend handles the 'Sales Executive' role visibility.
    apiCall.get({
      route: "/admin/analytics?timeframe=This Month",
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          // In a real scenario, this would be specific sales-person data
          setPerformanceData({
            stats: res.data.summary,
            recentTasks: res.data.updates.slice(0, 5),
            chartData: res.data.trends,
          });
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Sales data fetch error:", err);
      },
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const greetings = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading && !performanceData.chartData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest animate-pulse">
            Loading Your Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FD] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#EE2529] text-2xl">
              <FiUser />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">
                {greetings()}, {user?.firstName || "Partner"}
              </h1>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Property Management Mode Active
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/property/add-property")}
              className="px-6 py-2.5 bg-[#EE2529] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <FiPlus size={16} /> New Listing
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SalesStatCard
            title="Managed Properties"
            value={performanceData.stats.total}
            icon={<FiHome className="text-blue-600" />}
            bg="bg-blue-50"
            footer="Total Assigned"
          />
          <SalesStatCard
            title="Verified by You"
            value={performanceData.stats.completed}
            icon={<FiCheckCircle className="text-green-600" />}
            bg="bg-green-50"
            footer="Completed Status"
          />
          <SalesStatCard
            title="Direct Attention"
            value={performanceData.stats.pending}
            icon={<FiAlertCircle className="text-red-600" />}
            bg="bg-red-50"
            footer="Needs Review"
          />
          <SalesStatCard
            title="Partial Data"
            value={performanceData.stats.partial}
            icon={<FiClock className="text-orange-600" />}
            bg="bg-orange-50"
            footer="Awaiting Inputs"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FiTrendingUp className="text-[#EE2529]" /> Your Verification
                  Velocity
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                  Property verification output trends
                </p>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorVerified"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="verified"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVerified)"
                  />
                  <Area
                    type="monotone"
                    dataKey="onboarding"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Queue */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-[#EE2529]" /> Direct Tasks
              </h2>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                LATEST 5
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {performanceData.recentTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="group p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all cursor-pointer shadow-sm"
                  onClick={() =>
                    navigate(`/property/property-details/${task.propertyId}`)
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight truncate mb-1">
                        {task.notificationText}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <FiClock size={10} />{" "}
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[9px] font-black text-[#EE2529] uppercase tracking-widest">
                          Action Required
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#EE2529] group-hover:border-[#EE2529]/20 transition-all">
                      <FiArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}

              {performanceData.recentTasks.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                  <FiCheckCircle size={40} className="mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                    All clear for today!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/property/property-grid")}
              className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
            >
              View Full Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesStatCard = ({ title, value, icon, bg, footer }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-500`}
      >
        {icon}
      </div>
      <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-red-500 transition-colors">
        KPI
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight mb-4">
        {title}
      </p>
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-gray-400">{footer}</span>
        <FiArrowRight className="text-gray-300 group-hover:text-[#EE2529] transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 min-w-[150px]">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 border-b border-gray-50 pb-2">
          {label} Snapshot
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {entry.name}
              </span>
              <span
                className="text-xs font-black"
                style={{ color: entry.color }}
              >
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default SalesBoard;
