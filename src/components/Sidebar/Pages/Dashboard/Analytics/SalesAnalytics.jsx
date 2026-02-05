import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';
import { FiChevronDown, FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineCurrencyDollar } from 'react-icons/hi';

const SalesAnalytic = () => {
  const chartRef = useRef(null);
  
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

  useEffect(() => {
    // Add scroll animations on mount
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animated {
          opacity: 1;
        }

        .fade-up.animated {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .fade-left.animated {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .fade-right.animated {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .scale-in.animated {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .slide-in.animated {
          animation: slideIn 1.5s ease-out forwards;
        }

        .progress-bar {
          position: relative;
          overflow: hidden;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .pulse-animate {
          animation: pulseGlow 2s infinite;
        }

        .float-animate {
          animation: float 3s ease-in-out infinite;
        }

        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="grid grid-cols-3 gap-8">
        {/* Left section - Sales Analytics */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-1 hover-lift">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="animate-on-scroll fade-left">
                <h1 className="text-2xl font-bold text-gray-800">Sales Analytic</h1>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right flex items-center animate-on-scroll fade-up" style={{animationDelay: '0.2s'}}>
                  <p className="text-lg text-gray-500 mb-1">Earnings :</p>
                  <p className="text-lg font-bold text-blue-600">$85,934</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer animate-on-scroll scale-in" style={{animationDelay: '0.3s'}}>
                  <span className="text-gray-700 text-sm">This Month</span>
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-12 animate-on-scroll fade-up" style={{animationDelay: '0.4s'}}>
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
              <div className="animate-on-scroll fade-up" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Income</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1 hover:scale-110 transition-transform duration-300">23,675.00</p>
                    <span className="text-green-500 text-sm font-medium animate-pulse">+ 0.08%</span>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="animate-on-scroll fade-up" style={{animationDelay: '0.6s'}}>
                <div className="flex items-center gap-6 justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Expenses</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1 hover:scale-110 transition-transform duration-300">11,562.00</p>
                    <span className="text-red-500 text-sm font-medium animate-pulse">- 5.38%</span>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="animate-on-scroll fade-up" style={{animationDelay: '0.7s'}}>
                <div className="flex items-center gap-6 justify-end">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Balance</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1 hover:scale-110 transition-transform duration-300">67,365.00</p>
                    <span className="text-green-500 text-sm font-medium animate-pulse">+ 2.89%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View More */}
            <div className="mt-8 text-center animate-on-scroll fade-up" style={{animationDelay: '0.8s'}}>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:scale-105 transition-transform duration-300 group">
                View More 
                <span className="inline-block transform group-hover:translateX-2 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right section - Balance Card */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-4 text-white mb-8 gradient-animate hover-lift">
            {/* Main Balance */}
            <div className="mb-8 animate-on-scroll fade-down">
              <p className="text-indigo-200 text-sm mb-2">My Balance</p>
              <h2 className="text-4xl font-bold mb-1 hover:scale-105 transition-transform duration-300">$117,000.43</h2>
            </div>

            <div className='flex items-center gap-2'>
              {/* Income & Expense Items */}
              <div className="space-y-4 mb-8">
                {/* Income */}
                <div className="animate-on-scroll fade-right" style={{animationDelay: '0.3s'}}>
                  <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                    <div className="bg-indigo-500 rounded-lg p-2 pulse-animate">
                      <FiArrowDown className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-indigo-200 text-xs">Income</p>
                      <p className="font-bold">$13,321.12</p>
                    </div>
                  </div>
                </div>

                {/* Expense */}
                <div className="animate-on-scroll fade-right" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                    <div className="bg-red-500 rounded-lg p-2">
                      <FiArrowUp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-indigo-200 text-xs">Expense</p>
                      <p className="font-bold">$7,566.11</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Illustration placeholder */}
              <div className="animate-on-scroll scale-in float-animate" style={{animationDelay: '0.5s'}}>
                <div className="rounded-lg h-32 mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-indigo-200 text-xs">Money Illustration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 animate-on-scroll fade-up" style={{animationDelay: '0.6s'}}>
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold transition-all py-1 px-3 hover:scale-105 active:scale-95 hover:shadow-lg">
                Send
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 transition-all border border-indigo-400 hover:scale-105 active:scale-95 hover:shadow-lg">
                Receive
              </button>
            </div>
          </div>

          {/* Property & Revenue Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Property Card */}
            <div className="bg-white rounded-2xl p-4 space-y-5 hover-lift animate-on-scroll fade-left" style={{animationDelay: '0.3s'}}>
              <div className="flex flex-col items-center justify-between mb-4 space-y-4">
                <h3 className="text-gray-700 font-semibold">Property</h3>
                <div className="bg-indigo-100 p-3 rounded-lg hover:scale-110 transition-transform duration-300">
                  <HiOutlineHome className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-1 text-center hover:scale-105 transition-transform duration-300">15,780</p>
              <p className="text-sm text-gray-500 mb-3 text-center">60% Target</p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full progress-bar animate-on-scroll slide-in"
                  style={{ width: '60%', animationDelay: '0.5s' }}
                ></div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-2xl p-4 space-y-5 hover-lift animate-on-scroll fade-right" style={{animationDelay: '0.4s'}}>
              <div className="flex flex-col items-center justify-between mb-4 space-y-4">
                <h3 className="text-gray-700 font-semibold">Revenue</h3>
                <div className="bg-green-100 p-3 rounded-lg hover:scale-110 transition-transform duration-300">
                  <HiOutlineCurrencyDollar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-1 text-center hover:scale-105 transition-transform duration-300">$78.3M</p>
              <p className="text-sm text-gray-500 mb-3 text-center">80% Target</p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-600 h-2 rounded-full progress-bar animate-on-scroll slide-in"
                  style={{ width: '80%', animationDelay: '0.6s' }}
                ></div>
              </div>
            </div>
          </div>

          {/* View More Link */}
          <div className="text-center pt-4 animate-on-scroll fade-up" style={{animationDelay: '0.7s'}}>
            <a 
              href="#" 
              className="text-gray-700 hover:text-gray-900 font-medium text-sm hover:scale-105 transition-transform duration-300 group inline-block"
            >
              View More 
              <span className="inline-block transform group-hover:translateX-2 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytic;