import React from 'react';

const CustomDatePicker = ({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={`w-full px-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#EE2529]'
      }`}
      placeholder={placeholder}
    />
  );
};

export default CustomDatePicker;
