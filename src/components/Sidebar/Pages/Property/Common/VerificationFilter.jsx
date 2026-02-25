import React from "react";

const VerificationFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All Properties" },
    { id: "verified", label: "Verified" },
    { id: "partial", label: "Partially Verified" },
    { id: "pending", label: "Pending" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            currentFilter === filter.id
              ? "bg-[#EE2529] text-white shadow-lg shadow-red-100 scale-[1.02]"
              : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default VerificationFilter;
