import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';
import { FiChevronDown, FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineCurrencyDollar } from 'react-icons/hi';

const SalesAnalytic = () => {
  // Chart data - Income, Expenses, Balance
  const chartData = [
    { month: 'Jan', income: 17000, expenses: 16500, balance: 16800 },
    { month: 'Feb', income: 16800, expenses: 16200, balance: 17000 },
    { month: 'Mar', income: 20000, expenses: 16800, balance: 18200 },
    { month: 'Apr', income: 17200, expenses: 17000, balance: 16900 },
    { month: 'May', income: 18800, expenses: 17200, balance: 17800 },
    { month: 'Jun', income: 18500, expenses: 17500, balance: 17200 },
    { month: 'Jul', income: 17800, expenses: 16800, balance: 18000 },
    { month: 'Aug', income: 18200, expenses: 17200, balance: 17500 },
    { month: 'Sep', income: 18600, expenses: 17800, balance: 18800 },
    { month: 'Oct', income: 18900, expenses: 17500, balance: 19000 },
    { month: 'Nov', income: 18400, expenses: 17600, balance: 18200 },
    { month: 'Dec', income: 19200, expenses: 17800, balance: 19100 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-3 gap-8">
        {/* Left section - Sales Analytics */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-1">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sales Analytic</h1>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right flex items-center">
                  <p className="text-lg text-gray-500 mb-1">Earnings :</p>
                  <p className="text-lg font-bold text-blue-600">$85,934</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-700 text-sm">This Month</span>
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-12">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '13px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '13px' }}
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
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
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {/* Income */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Income</p>
                  <p className="text-2xl font-bold text-gray-800 mb-1">23,675.00</p>
                  <span className="text-green-500 text-sm font-medium">+ 0.08%</span>
                </div>
              </div>

              {/* Expenses */}
              <div className="flex items-center gap-6 justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Expenses</p>
                  <p className="text-2xl font-bold text-gray-800 mb-1">11,562.00</p>
                  <span className="text-red-500 text-sm font-medium">- 5.38%</span>
                </div>
              </div>

              {/* Balance */}
              <div className="flex items-center gap-6 justify-end">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Balance</p>
                  <p className="text-2xl font-bold text-gray-800 mb-1">67,365.00</p>
                  <span className="text-green-500 text-sm font-medium">+ 2.89%</span>
                </div>
              </div>
            </div>

            {/* View More */}
            <div className="mt-8 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View More →
              </button>
            </div>
          </div>
        </div>

        {/* Right section - Balance Card */}
        <div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-4 text-white mb-8">
            {/* Main Balance */}
            <div className="mb-8">
              <p className="text-indigo-200 text-sm mb-2">My Balance</p>
              <h2 className="text-4xl font-bold mb-1">$117,000.43</h2>
            </div>

           <div className='flex items-center gap-2'>
             {/* Income & Expense Items */}
            <div className="space-y-4 mb-8 ">
              {/* Income */}
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 rounded-lg p-2">
                  <FiArrowDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-indigo-200 text-xs">Income</p>
                  <p className="font-bold">$13,321.12</p>
                </div>
              </div>

              {/* Expense */}
              <div className="flex items-center gap-3">
                <div className="bg-red-500 rounded-lg p-2">
                  <FiArrowUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-indigo-200 text-xs">Expense</p>
                  <p className="font-bold">$7,566.11</p>
                </div>
              </div>
            </div>
               {/* Illustration placeholder */}
            <div className=" rounded-lg h-32 mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-indigo-200 text-xs">Money Illustration</p>
              </div>
            </div>

           </div>
           

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold   transition py-1 px-3">
                Send
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3  transition border border-indigo-400">
                Receive
              </button>
            </div>
          </div>

          {/* Property & Revenue Cards */}
          <div className="grid grid-cols-2 ">
            {/* Property Card */}
            <div className="bg-white rounded-2xl p-4 space-y-5">
              <div className="flex flex-col items-center justify-between mb-4 space-y-4">
                <h3 className="text-gray-700 font-semibold">Property</h3>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <HiOutlineHome className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-1 text-center">15,780</p>
              <p className="text-sm text-gray-500 mb-3 text-center">60% Target</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-2xl p-4 space-y-5">
              <div className="flex flex-col items-center justify-between mb-4  space-y-4">
                <h3 className="text-gray-700 font-semibold">Revenue</h3>
                <div className="bg-green-100 p-3 rounded-lg">
                  <HiOutlineCurrencyDollar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-1 text-center">$78.3M</p>
              <p className="text-sm text-gray-500 mb-3 text-center ">80% Target</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

          </div>
            {/* View More Link */}
            <div className="text-center pt-4">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
                View More →
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytic;