import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { user } = useUserStorage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: { total: 0, partial: 0, pending: 0, completed: 0 },
    trends: [],
    updates: [],
  });
  const [timeframe, setTimeframe] = useState("Last 6 Months");

  const fetchAnalytics = () => {
    setLoading(true);
    apiCall.get({
      route: `/admin/analytics?timeframe=${timeframe}`,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setData(res.data);
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Analytics fetch error:", err);
      },
    });
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  if (loading && !data.trends.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest animate-pulse">
            Syncing Analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-5 bg-[#F8F9FD] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header - More Compact */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              Live property performance metrics
            </p>
          </div>
          <div className="bg-white p-0.5 rounded-xl shadow-sm border border-gray-100 flex items-center">
            {["This Month", "Last 6 Months", "This Year"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  timeframe === t
                    ? "bg-[#EE2529] text-white shadow-md shadow-red-100"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards - Smaller & Sleeker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Partial"
            value={data.summary.partial.toLocaleString()}
            icon={<FiClock className="text-yellow-600" />}
            iconBg="bg-yellow-50"
            trend="+12%"
            trendColor="text-yellow-600"
          />
          <StatCard
            title="Total"
            value={data.summary.total.toLocaleString()}
            icon={<FiHome className="text-blue-600" />}
            iconBg="bg-blue-50"
            trend="+5.4k"
            trendColor="text-blue-600"
          />
          <StatCard
            title="Pending"
            value={data.summary.pending.toLocaleString()}
            icon={<FiAlertCircle className="text-red-600" />}
            iconBg="bg-red-50"
            trend="-2%"
            trendColor="text-red-600"
          />
          <StatCard
            title="Verified"
            value={data.summary.completed.toLocaleString()}
            icon={<FiCheckCircle className="text-green-600" />}
            iconBg="bg-green-50"
            trend="+18%"
            trendColor="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Chart Section - Compact Height */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                Onboarding Activity
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <LegendItem color="#3B82F6" label="Onboarding" />
                <LegendItem color="#F59E0B" label="Reassign" />
                <LegendItem color="#10B981" label="Verified" />
                <LegendItem color="#8B5CF6" label="Partial" />
              </div>
            </div>

            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.trends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
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
                  <Line
                    type="monotone"
                    dataKey="onboarding"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                      fill: "#3B82F6",
                      strokeWidth: 2,
                      r: 3,
                      stroke: "#FFF",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reassigned"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{
                      fill: "#F59E0B",
                      strokeWidth: 2,
                      r: 3,
                      stroke: "#FFF",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="verified"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{
                      fill: "#10B981",
                      strokeWidth: 2,
                      r: 3,
                      stroke: "#FFF",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="partial"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{
                      fill: "#8B5CF6",
                      strokeWidth: 2,
                      r: 3,
                      stroke: "#FFF",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Updates Section - Tighter spacing */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                Recent Events
              </h2>
             
            </div>
            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 max-h-[320px] custom-scrollbar">
              {data.updates.map((update, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group bg-gray-50/50 hover:bg-gray-50 p-2.5 rounded-xl transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="flex-1 pr-3 min-w-0">
                    <p className="text-[11px] font-bold text-gray-700 leading-tight truncate group-hover:text-gray-900 transition-colors">
                      {update.notificationText}
                    </p>
                    <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                      <FiClock size={10} />{" "}
                      {formatRelativeTime(update.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/property/property-details/${update.propertyId}`,
                      )
                    }
                    className="flex-shrink-0 w-8 h-8 bg-white text-gray-400 hover:bg-[#EE2529] hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm border border-gray-100 hover:border-[#EE2529]"
                  >
                    <FiArrowRight size={14} />
                  </button>
                </div>
              ))}
              {data.updates.length === 0 && (
                <div className="py-12 text-center">
                  <FiCalendar
                    size={24}
                    className="text-gray-200 mx-auto mb-2"
                  />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    No new activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, iconBg, trend, trendColor }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none mt-0.5">
          {value}
        </h3>
      </div>
    </div>
    <span
      className={`text-[10px] font-black ${trendColor} bg-white px-2 py-0.5 rounded-full border border-gray-50 shadow-sm`}
    >
      {trend}
    </span>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-50 pb-1.5">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-6"
            >
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                {entry.name}
              </span>
              <span
                className="text-[10px] font-black"
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

export default Analytics;
