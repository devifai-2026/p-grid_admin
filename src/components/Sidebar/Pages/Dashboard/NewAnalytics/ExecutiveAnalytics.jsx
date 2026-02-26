import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";
import { useNavigate } from "react-router-dom";

const ExecutiveAnalytics = () => {
  const { user } = useUserStorage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("This Month");
  const [data, setData] = useState({
    summary: { total: 5832, partial: 1247, pending: 892, completed: 3421 },
    trends: [
      { month: 'JAN', onboarding: 180, reassigned: 60, verified: 120, partial: 40 },
      { month: 'FEB', onboarding: 210, reassigned: 90, verified: 150, partial: 70 },
      { month: 'MAR', onboarding: 160, reassigned: 70, verified: 130, partial: 110 },
      { month: 'APR', onboarding: 220, reassigned: 140, verified: 180, partial: 80 },
      { month: 'MAY', onboarding: 190, reassigned: 110, verified: 140, partial: 120 },
      { month: 'JUN', onboarding: 240, reassigned: 150, verified: 210, partial: 150 },
      { month: 'JUL', onboarding: 220, reassigned: 130, verified: 190, partial: 130 },
    ],
    updates: [],
    ranking: [
      { name: "Sarah Johnson", props: 1247, icon: "👑" },
      { name: "Michael Chen", props: 1156, icon: "🥈" },
      { name: "You", props: 1012, icon: "🥉", isUser: true },
      { name: "David Williams", props: 989, icon: "4" },
      { name: "Lisa Rodriguez", props: 954, icon: "5" },
    ],
    locations: [
      { name: "Downtown", count: 2450, percentage: 90, color: "bg-red-500" },
      { name: "Suburbs", count: 1890, percentage: 70, color: "bg-orange-500" },
      { name: "Rural Areas", count: 1150, percentage: 40, color: "bg-green-600" },
      { name: "Coastal Region", count: 1590, percentage: 60, color: "bg-red-400" },
    ]
  });

  const fetchAnalytics = () => {
    setLoading(true);
    apiCall.get({
      route: `/admin/analytics?timeframe=${timeframe}`,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success && res.data) {
          setData(prev => ({
            ...prev,
            summary: res.data.summary || prev.summary,
            trends: res.data.trends || prev.trends,
            updates: res.data.updates || prev.updates,
          }));
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

  return (
    <div className="p-2 bg-[#FDFEFE] min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopStatCard 
            title="Partial Property" 
            value={data.summary.partial.toLocaleString()} 
            icon={<div className="p-2 bg-orange-50 rounded-lg"><FiClock className="text-orange-400" /></div>}
            imageIcon="https://cdn-icons-png.flaticon.com/512/1055/1055644.png"
          />
          <TopStatCard 
            title="Total Property" 
            value={data.summary.total.toLocaleString()} 
            icon={<div className="p-2 bg-blue-50 rounded-lg"><FiHome className="text-blue-400" /></div>}
            imageIcon="https://cdn-icons-png.flaticon.com/512/619/619153.png"
          />
          <TopStatCard 
            title="Pending Property" 
            value={data.summary.pending.toLocaleString()} 
            icon={<div className="p-2 bg-yellow-50 rounded-lg"><FiAlertCircle className="text-yellow-400" /></div>}
            imageIcon="https://cdn-icons-png.flaticon.com/512/2972/2972531.png"
          />
          <TopStatCard 
            title="Verified Property" 
            value={data.summary.completed.toLocaleString()} 
            icon={<div className="p-2 bg-green-50 rounded-lg"><FiCheckCircle className="text-green-400" /></div>}
            imageIcon="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          />
        </div>

        {/* Middle Row: Metrics, Ranking, Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Average Days to Verify */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <FiCalendar className="text-blue-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Average Days to Verify</h3>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-800">4.5</span>
                  <span className="text-lg font-bold text-slate-400">days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-500 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                    <FiTrendingUp className="mr-1" /> 0.8 days
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">from last month</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target: 5 days</span>
                <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-md">10% FASTER</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[90%] rounded-full shadow-lg shadow-red-100"></div>
              </div>
            </div>
          </div>

          {/* Executive Ranking */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <FiAward className="text-orange-400" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Executive Ranking</h3>
            </div>
            
            <div className="bg-red-50/50 p-4 rounded-2xl flex items-center justify-between mb-8 border border-red-50">
              <span className="text-sm font-bold text-slate-700">Your Rank</span>
              <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-red-200 text-lg">
                #3
              </div>
            </div>

            <div className="space-y-5">
              {data.ranking.map((rank, idx) => (
                <div key={idx} className={`flex items-center justify-between ${rank.isUser ? 'scale-105 transform translate-x-2 transition-all' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center">{rank.icon}</span>
                    <span className={`text-sm font-bold ${rank.isUser ? 'text-red-600' : 'text-slate-600'}`}>{rank.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{rank.props.toLocaleString()} props</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50 text-center">
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <FiZap /> 144 properties to reach #2
              </p>
            </div>
          </div>

          {/* Properties by Location */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 min-h-[400px]">
            <div className="flex items-center gap-2 mb-8">
              <FiMapPin className="text-red-500" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Properties by Location</h3>
            </div>

            <div className="space-y-8">
              {data.locations.map((loc, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">{loc.name}</span>
                    <span className="text-xs font-black text-slate-800">{loc.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${loc.color} rounded-full transition-all duration-1000`} style={{ width: `${loc.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between">
              <div className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-100 rounded text-blue-600 flex items-center justify-center">🏙️</div>
                4 regions active
              </div>
              <div className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase">
                Hotspot: Downtown
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Trends & Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          
          {/* Property Onboarding Trends */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">📊</div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Property Onboarding Trends</h3>
              </div>
              
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                {["This Month", "Last 6 Months", "This Year"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      timeframe === t
                        ? "bg-[#EE2529] text-white shadow-xl shadow-red-100"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
              <TrendLegend color="#EE2529" label="Onboarding Received" />
              <TrendLegend color="#FF6B35" label="Property Reassign" />
              <TrendLegend color="#2D6A4F" label="Property Verified" />
              <TrendLegend color="#4A4E69" label="Partial Verified" />
            </div>

            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    domain={[0, 250]}
                  />
                  <Tooltip content={<CustomTrendsTooltip />} />
                  <Line type="monotone" dataKey="onboarding" stroke="#EE2529" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#EE2529" }} />
                  <Line type="monotone" dataKey="reassigned" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#FF6B35" }} />
                  <Line type="monotone" dataKey="verified" stroke="#2D6A4F" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#2D6A4F" }} />
                  <Line type="monotone" dataKey="partial" stroke="#4A4E69" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#4A4E69" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Updates */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <FiZap className="text-orange-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Quick Updates</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
              {data.updates.length > 0 ? data.updates.map((update, idx) => (
                <div key={idx} className="bg-slate-50/30 hover:bg-slate-50 border border-slate-50 p-4 rounded-3xl transition-all group">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700 leading-relaxed mb-1">{update.notificationText}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <FiClock size={10} /> {formatRelativeTime(update.createdAt)}
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate(`/property/property-details/${update.propertyId}`)}
                      className="px-4 py-1.5 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-md shadow-red-100"
                    >
                      View
                    </button>
                  </div>
                </div>
              )) : (
                <div className="space-y-4">
                  <UpdateItem text="New property listing added in Downtown area" time="2 minutes ago" />
                  <UpdateItem text="Property verification completed for Lakeside Residency" time="15 minutes ago" />
                  <UpdateItem text="3 properties reassigned to senior executive" time="1 hour ago" />
                  <UpdateItem text="Partial verification pending for 5 properties" time="3 hours ago" />
                  <UpdateItem text="Monthly target achieved: 85% completion" time="5 hours ago" />
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase">5 new updates</span>
              <button 
                onClick={() => navigate('/notifications')}
                className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1"
              >
                View all <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components
const TopStatCard = ({ title, value, icon, imageIcon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 group relative overflow-hidden">
    <div className="space-y-2 z-10">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
    <div className="relative z-10">
      <img src={imageIcon} alt={title} className="w-12 h-12 object-contain opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
    </div>
    {/* Subtle decorative background circle */}
    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50"></div>
  </div>
);

const TrendLegend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const UpdateItem = ({ text, time }) => (
  <div className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 p-4 rounded-3xl transition-all group flex justify-between items-center gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-bold text-slate-700 truncate mb-1">{text}</p>
      <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
        <FiClock size={10} /> {time}
      </span>
    </div>
    <button className="px-5 py-2 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100">
      View
    </button>
  </div>
);

const CustomTrendsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-50 min-w-[150px]">
        <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{entry.name}</span>
              <span className="text-xs font-black" style={{ color: entry.color }}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default ExecutiveAnalytics;
