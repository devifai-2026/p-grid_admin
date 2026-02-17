import React from 'react';

const CustomMultiSelect = ({
  placeholder,
  value = [],
  options = [],
  onChange,
  onBlur,
  error,
}) => {
  const handleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className="relative">
      <select
        multiple
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 appearance-none h-32 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#EE2529]'
        }`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd) to select multiple</div>
    </div>
  );
};

export default CustomMultiSelect;
