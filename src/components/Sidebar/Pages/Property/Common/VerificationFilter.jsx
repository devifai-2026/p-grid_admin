import React from "react";
import { FiGrid, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";

const VerificationFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    {
      id: "all",
      label: "All Properties",
      icon: FiGrid,
      activeColor: "bg-gray-900",
    },
    {
      id: "verified",
      label: "Verified",
      icon: FiCheckCircle,
      activeColor: "bg-red-600",
    },
    {
      id: "partial",
      label: "Partially Verified",
      icon: FiClock,
      activeColor: "bg-orange-500",
    },
    {
      id: "pending",
      label: "Pending",
      icon: FiAlertCircle,
      activeColor: "bg-amber-500",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-10 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-[2rem] border border-gray-200 w-fit">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = currentFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              relative px-6 py-3 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.15em] 
              transition-all duration-300 flex items-center gap-2.5 overflow-hidden group
              ${
                isActive
                  ? `${filter.activeColor} text-white shadow-xl shadow-gray-200 scale-[1.02]`
                  : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-white"
              }
            `}
          >
            {/* Glossy Effect */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-none" />
            )}

            <Icon
              className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#EE2529]"} transition-colors`}
            />
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VerificationFilter;
