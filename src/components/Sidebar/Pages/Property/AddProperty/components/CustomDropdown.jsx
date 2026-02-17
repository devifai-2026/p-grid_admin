import React from 'react';

const CustomDropdown = ({
  placeholder,
  value,
  options = [],
  onChange,
  onBlur,
  error,
  searchable,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 appearance-none ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#EE2529]'
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;
