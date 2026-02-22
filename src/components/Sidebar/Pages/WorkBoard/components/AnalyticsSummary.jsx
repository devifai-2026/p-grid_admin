import React from "react";
import {
  FiPieChart,
  FiMessageSquare,
  FiHome,
  FiActivity,
} from "react-icons/fi";

const AnalyticsSummary = ({ loading, inquiriesCount, propertiesCount }) => {
  const stats = [
    {
      label: "Board Efficiency",
      value: "94.2%",
      icon: FiPieChart,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Open Enquiries",
      value: inquiriesCount,
      icon: FiMessageSquare,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Managed Properties",
      value: propertiesCount,
      icon: FiHome,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      label: "Response Time",
      value: "2.4h",
      icon: FiActivity,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
        >
          <div
            className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
          >
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
              {stat.label}
            </p>
            <h3
              className={`text-xl font-black text-slate-800 leading-none ${
                loading ? "animate-pulse opacity-50" : ""
              }`}
            >
              {loading ? "..." : stat.value}
            </h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AnalyticsSummary;
