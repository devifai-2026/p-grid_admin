import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { FiChevronDown, FiEye, FiSettings, FiStar } from 'react-icons/fi';
import { HiArrowRight } from 'react-icons/hi';
import { FaRegEdit } from 'react-icons/fa';
import { TfiWallet } from 'react-icons/tfi';

const SalesDetail = () => {
  // Sales Funnel Line Chart Data
  const funnelData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 68 },
    { month: 'May', value: 72 },
    { month: 'Jun', value: 75 },
  ];

  // Recent Agent Status - Stacked Bar Chart Data
  const agentStatusData = [
    { month: 'Jan', completed: 40, pending: 35 },
    { month: 'Feb', completed: 45, pending: 38 },
    { month: 'Mar', completed: 35, pending: 28 },
    { month: 'Apr', completed: 50, pending: 35 },
    { month: 'May', completed: 40, pending: 30 },
    { month: 'Jun', completed: 45, pending: 35 },
    { month: 'Jul', completed: 30, pending: 25 },
    { month: 'Aug', completed: 15, pending: 8 },
    { month: 'Sep', completed: 50, pending: 35 },
    { month: 'Oct', completed: 35, pending: 25 },
    { month: 'Nov', completed: 40, pending: 30 },
    { month: 'Dec', completed: 25, pending: 15 },
  ];

  // Collection of Rent Data
  const collectionData = [
    { name: 'Collected', value: 250.5 },
    { name: 'Pending', value: 250 }
  ];

  // Sessions by Country Data
  const countryData = [
    { country: 'United States', value: 145.678, percent: 82.05, color: '#6366f1' },
    { country: 'Russia', value: 485, percent: 70.5, color: '#1e3a8a' },
    { country: 'China', value: 355, percent: 65.8, color: '#ef4444' },
    { country: 'Canada', value: 204, percent: 55.8, color: '#10b981' }
  ];

  // Agents List
  const agents = [
    {
      name: 'Michael A. Miner',
      email: 'davidcrumminier@teleworx.us',
      date: 'May 2024',
      avatar: '👨'
    },
    {
      name: 'Theresa T. Brose',
      email: 'inakepartman@doyrep.com',
      date: 'May 2024',
      avatar: '👩'
    },
    {
      name: 'James L. Erickson',
      email: 'jereplum@ghyna.com',
      date: 'May 2024',
      avatar: '👨'
    },
    {
      name: 'Lily W. Wilson',
      email: 'lilianorelia@ghyna.com',
      date: 'May 2024',
      avatar: '👩'
    }
  ];

  const COLORS = ['#6366f1', '#f3f4f6'];

  return (
    <div className="bg-gray-50 mt-5 min-h-screen">
  

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Sales Funnel */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Sales Funnel</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                <span className="text-sm text-gray-700">This Month</span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={funnelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '13px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '13px' }} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Visitors</p>
                <p className="text-xl font-bold text-gray-800">123.7k</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Views</p>
                <p className="text-xl font-bold text-gray-800">167.1k</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Leads</p>
                <p className="text-xl font-bold text-gray-800">89.7k</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Market</p>
                <p className="text-xl font-bold text-gray-800">34.8k</p>
              </div>
            </div>
          </div>

          {/* Recent Agent Status */}
          <div className="bg-white rounded-2xl shadow-sm p-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Recent Agent Status</h2>
                <p className="text-sm text-gray-500">More than $50K</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                <span className="text-sm text-gray-700">This Month</span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Time Period Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Today</p>
                <p className="text-2xl font-bold text-gray-800">$8,839</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">This Month</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-800">$52,356</p>
                  <span className="text-green-500 text-sm font-medium">0.2 % ↑</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">This Year</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-800">$78M</p>
                  <span className="text-green-500 text-sm font-medium">0.1 % ↑</span>
                </div>
              </div>
            </div>

            {/* Composed Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={agentStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#e0e7ff" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Collection of Rent */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Collection of Rent</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                  <span className="text-sm text-gray-700">This Month</span>
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Total</div>
                <p className="text-3xl font-bold text-gray-800">$500.50K</p>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <p className="text-green-600 font-medium text-sm mb-2">Collected</p>
                  <p className="text-xl font-bold text-gray-800">$250.50K</p>
                  <div className="w-full h-3 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-2">Pending</p>
                  <p className="text-xl font-bold text-gray-800">$250.00K</p>
                  <div className="w-full h-3 bg-gray-300 rounded-full mt-2"></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Tenants with invoice due</p>
                  <div className="flex -space-x-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">👨</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">👩</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">👨</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">👩</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">+1</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                Send Reminder
              </button>
            </div>

            {/* Sessions by Country */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Sessions by Country</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                  <span className="text-sm text-gray-700">Asia</span>
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <FiEye className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-500 text-sm">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-800">145.678</p>
                </div>
              </div>

              <div className="space-y-4">
                {countryData.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {index === 0 && <span>🇺🇸</span>}
                        {index === 1 && <span>🇷🇺</span>}
                        {index === 2 && <span>🇨🇳</span>}
                        {index === 3 && <span>🇨🇦</span>}
                        <span className="text-gray-700 font-medium">{country.country}</span>
                      </div>
                      <span className="text-gray-600 text-sm">{country.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${country.percent}%`, backgroundColor: country.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                Add Other +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Total Revenue Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Total Revenue</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                <span className="text-sm text-gray-700">This Month</span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-gray-800">$15,563.786</p>
                <span className="text-green-500 font-medium text-sm">+ 4.53%</span>
              </div>
              <p className="text-gray-500 text-sm">Gained <span className="text-green-500 font-medium">$978.56</span> This Month !</p>
            </div>

            <div className="flex justify-end mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🛍️</span>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-4">Revenue Sources</p>
              
              {/* Source Items */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-medium">Rent</span>
                  </div>
                  <p className="font-bold text-gray-800">$12,223.78</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-medium">Sales</span>
                  </div>
                  <p className="font-bold text-gray-800">$56,131</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-medium">Broker Deal</span>
                  </div>
                  <p className="font-bold text-gray-800">$1,340.15</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-medium">Market</span>
                  </div>
                  <p className="font-bold text-gray-800">$600.46</p>
                </div>
              </div>

              {/* Stacked Bar */}
              <div className="flex h-3 gap-0.5 rounded-full overflow-hidden bg-gray-100">
                <div className="bg-indigo-600" style={{ width: '45%' }}></div>
                <div className="bg-orange-500" style={{ width: '25%' }}></div>
                <div className="bg-green-500" style={{ width: '20%' }}></div>
                <div className="bg-cyan-500" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          {/* Top Agents */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Top Agents</h2>

            {/* Agent Card */}
            <div className="bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold">Lahomes Group , Pvt Ltd</h3>
                  <p className="text-indigo-100 text-sm">Markovi , USA</p>
                </div>
                <HiArrowRight className="w-6 h-6" />
              </div>

              {/* Agent Avatars */}
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-lg">👩</div>
                  <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-lg">🎩</div>
                  <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-lg">👨</div>
                  <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-lg">👶</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                ))}
                <span className="text-sm font-medium ml-2">4.5 / 5 Rating</span>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Goals</h2>
              <FiSettings className="w-5 h-5 text-gray-500" />
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeDasharray="424"
                    strokeDashoffset="106"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-gray-800">75%</p>
                  <p className="text-gray-500 text-sm">Achieved</p>
                </div>
              </div>
            </div>

            {/* Income Stats */}
            <h2 className='text-xs text-gray-600 mb-2'>Income Statistics</h2>
            <div className=" flex items-center justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg"><TfiWallet /></span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">From June</p>
                    <p className="text-lg font-bold text-gray-800">$12,167</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg"><TfiWallet /></span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">From July</p>
                    <p className="text-lg font-bold text-gray-800">$14,900</p>
                  </div>
                </div>
              </div>

           
            </div>
          </div>

        

          {/* Recent Join Agent */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className='flex items-center justify-between'>
                <div className="flex flex-col justify-between  mb-6">
              <h2 className="text-base text-gray-600">Recent Join Agent</h2>
              <span className="text-gray-500 text-xs">190 Agent Join</span>
            </div>
            <FaRegEdit />
            </div>

            <div className="space-y-4 mb-6">
              {agents.map((agent, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium text-sm truncate">{agent.name}</p>
                    <p className="text-gray-500 text-xs truncate">{agent.email}</p>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">{agent.date}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetail;