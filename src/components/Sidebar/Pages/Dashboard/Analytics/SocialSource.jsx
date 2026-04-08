import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiChevronDown, FiUser } from 'react-icons/fi';

const SocialSource = () => {
  // Donut chart data for Total Buyer
  const buyerData = [
    { name: 'Buyers', value: 70 },
    { name: 'Others', value: 30 }
  ];

  // Country sales data
  const countryData = [
    { name: 'Canada', percentage: 71.1 },
    { name: 'USA', percentage: 67.0 },
    { name: 'Brazil', percentage: 53.9 },
    { name: 'Russia', percentage: 49.2 },
    { name: 'China', percentage: 38.8 }
  ];

  // Weekly sales chart data
  const weeklySalesData = [
    { day: 'S', sales: 45 },
    { day: 'M', sales: 52 },
    { day: 'T', sales: 65 },
    { day: 'W', sales: 45 },
    { day: 'T', sales: 40 },
    { day: 'F', sales: 35 },
    { day: 'S', sales: 30 }
  ];

  // Colors for the pie chart
  const COLORS = ['#6366f1', '#e0e7ff'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section - Social Source Header & Total Buyer */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {/* Header */}
            <h1 className="text-xl font-bold text-gray-800 mb-1">Social Source</h1>
            <p className="text-sm text-gray-500 mb-6">Total Traffic In<br/>This Week</p>
            
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-full mb-8">
              <span className="text-sm text-gray-700">This Month</span>
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Donut Chart */}
            <div className="flex justify-center mb-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={buyerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {buyerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Center Text */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-1">Total Buyer</p>
              <p className="text-4xl font-bold text-gray-800">70%</p>
            </div>

            {/* Buyers Info */}
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
              <FiUser className="w-5 h-5 text-gray-700" />
              <div>
                <span className="text-sm text-gray-600">Buyers : </span>
                <span className="font-bold text-lg text-[#EE2529]">70</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex  gap-3">
              <button className="text-left text-gray-600 hover:text-gray-800 text-sm font-medium">
                See More Statistic
              </button>
              <button className=" bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-1 px-3  transition text-sm">
                See Details
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section - Most Sales Location */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Most Sales Location</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                <span className="text-sm text-gray-700">Asia</span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Map Image Placeholder */}
            <div className="mb-6 rounded-lg overflow-hidden h-40 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=200&fit=crop" 
                alt="Property" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Country Labels */}
            <div className="flex justify-between items-center mb-6 px-2">
              {['Canada', 'USA', 'Brazil', 'Russia', 'China'].map((country) => (
                <span key={country} className="text-sm font-medium text-gray-700">
                  {country}
                </span>
              ))}
            </div>

            {/* Country Percentage Bars */}
            <div className="space-y-1">
              {countryData.map((country, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{
                    background: `linear-gradient(to right, 
                      ${index === 0 ? '#6366f1' : 
                        index === 1 ? '#7c3aed' : 
                        index === 2 ? '#8b5cf6' : 
                        index === 3 ? '#a78bfa' : 
                        '#d8b4fe'
                      }, 
                      ${index === 0 ? '#e0e7ff' : 
                        index === 1 ? '#ede9fe' : 
                        index === 2 ? '#f3e8ff' : 
                        index === 3 ? '#f5f3ff' : 
                        '#faf5ff'
                      })`
                  }}>
                    <div className="h-full flex items-center justify-center text-white text-xs font-bold" style={{
                      width: `${country.percentage}%`
                    }}>
                      {country.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Weekly Sales */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-1">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-800 mb-6">Weekly Sales</h2>

            {/* Image */}
            <div className="mb-6 rounded-lg overflow-hidden h-40 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=200&fit=crop" 
                alt="Property" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bar Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9ca3af"
                    style={{ fontSize: '13px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '13px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#6366f1" 
                    radius={[8, 8, 0, 0]}
                    width={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Total Property Seals :</p>
                <p className="text-base font-bold text-gray-800">5,746</p>
              </div>
              <button className="bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-1 px-3  transition text-sm">
                View <br /> More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSource;