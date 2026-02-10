import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaFilter,
  FaPlus,
  FaArrowRight
} from 'react-icons/fa';
import {
  MdHome,
  MdLocationOn,
  MdSettings,
  MdPerson,
  MdMailOutline
} from 'react-icons/md';
import { FiMessageSquare, FiMoreVertical } from 'react-icons/fi';
import { AiOutlineMail } from 'react-icons/ai';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const GridView = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pie chart data for properties distribution
  const pieData = [
    { name: 'Vacant', value: 80, color: '#0284c7' },
    { name: 'Occupied', value: 40, color: '#f97316' },
    { name: 'Unlisted', value: 30, color: '#10b981' }
  ];

  // Line chart data for the performance line
  const lineData = [
    { month: 'Jan', value: 380 },
    { month: 'Feb', value: 420 },
    { month: 'Mar', value: 390 },
    { month: 'Apr', value: 450 },
    { month: 'May', value: 430 },
    { month: 'Jun', value: 480 },
    { month: 'Jul', value: 460 },
    { month: 'Aug', value: 500 },
  ];

  // Agents data
  const agents = [
    {
      id: 1,
      name: 'Michael A. Miner',
      email: 'davidnumminer@telexworm.us',
      number: '#1',
      properties: 243,
      location: 'Lincoln Drive Harrisburg, PA 17101 U.S.A',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: 2,
      name: 'Theresa T. Brose',
      email: 'snikkapentinen@dayrep.com',
      number: '#2',
      properties: 451,
      location: 'Boulevard Cockeysville TX 75204',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      id: 3,
      name: 'James L. Erickson',
      email: 'jerepaimu@rhyta.com',
      number: '#3',
      properties: 190,
      location: 'Woodside Circle Panama City, FL 32401',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    {
      id: 4,
      name: 'Lily W. Wilson',
      email: 'ullanuelea@rhyta.com',
      number: '#4',
      properties: 276,
      location: 'Emily Drive Sumter, SC 29150',
      image: 'https://images.unsplash.com/photo-1517841905240-1c28a8a60f38?w=150&h=150&fit=crop',
    },
    {
      id: 5,
      name: 'Sarah M. Brooks',
      email: 'tiakarppinen@eleworm.us',
      number: '#5',
      properties: 257,
      location: 'Cmans Lane Albuquerque, NM 87109',
      image: 'https://images.unsplash.com/photo-1516756387261-38c75010e6c9?w=150&h=150&fit=crop',
    },
    {
      id: 6,
      name: 'Joe K. Hall',
      email: 'harlandrosins@dayrep.com',
      number: '#6',
      properties: 342,
      location: '465 Chapmans Lane Albuquerque,',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=150&h=150&fit=crop',
    },
    {
      id: 7,
      name: 'Robert V. Leavitt',
      email: 'robertleavitt@dayrep.com',
      number: '#7',
      properties: 120,
      location: 'Stockert Hollow Road Redmond, WA 98052',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: 8,
      name: 'Lydia Anderson',
      email: 'lydiaanderson@dayrep.com',
      number: '#8',
      properties: 266,
      location: 'Conaway Street Bloomington, IN 47408',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      id: 9,
      name: 'Sarah Martinez',
      email: 'sarahmartinez@rhyta.com',
      number: '#9',
      properties: 128,
      location: '500 Logan Lane Denver, CO 80220',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedAgents = agents.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Gaston</h1>
          <p className="text-slate-500 mt-1">This is your properties portfolio report</p>
        </div>

        {/* Header with Portfolio Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          {/* Left: Properties Overview */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-4">Properties</p>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-5xl font-bold text-slate-900">250</h1>
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.value} {item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-6">Last Updated : 4 day ago</p>
          </div>

          {/* Center: Development Task Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white">
            <h2 className="text-xl font-bold mb-2">Development Task</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-2xl font-semibold">250</p>
                <p className="text-xs opacity-80">Total properties</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">30</p>
                <p className="text-xs opacity-80">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">04</p>
                <p className="text-xs opacity-80">Day Left</p>
              </div>
            </div>
            <div className="mb-4 pb-4 border-b border-blue-500">
              <p className="text-sm opacity-90">↑ 34.4% vs last month</p>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffffff" 
                  strokeWidth={3} 
                  dot={false} 
                  isAnimationActive={true}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#1e293b'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs opacity-80 mt-4">Last Updated : 12 hour ago</p>
            <a href="#" className="text-white text-xs hover:text-blue-200 mt-2 inline-flex items-center gap-1">
              View More <FaArrowRight size={12} />
            </a>
          </div>

          {/* Right: Total Seal Properties */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-lg text-white">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center mb-4">
                <div className="text-7xl font-bold mb-2">450</div>
                <p className="text-lg opacity-90">Total Seal Properties</p>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">80%</div>
                  <p className="text-xs opacity-80">Occupancy</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs opacity-80">Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">120</div>
                  <p className="text-xs opacity-80">New Leads</p>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Active Properties: 320
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90 mt-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Under Maintenance: 65
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90 mt-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Available for Rent: 45
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-slate-500 text-sm font-medium">Showing all <span className="text-indigo-600 font-semibold">311 Agent</span></p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm flex items-center gap-2 transition-colors">
              <MdSettings size={18} />
              More Setting
            </button>
            <button className="flex-1 md:flex-none justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm flex items-center gap-2 transition-colors">
              <FaFilter size={18} />
              Filters
            </button>
            <button className="flex-1 md:flex-none justify-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm flex items-center gap-2 transition-colors">
              <FaPlus size={18} />
              New Agent
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {displayedAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              {/* Agent Card Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                      <p className="text-xs text-slate-500">{agent.email}</p>
                      <p className="text-xs font-semibold text-indigo-600 mt-1">{agent.number}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <FiMoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Agent Info */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-5 h-5 rounded text-indigo-600 flex items-center justify-center bg-indigo-50">
                    <MdHome size={14} />
                  </div>
                  <span className="text-sm font-medium">{agent.properties} Properties</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-5 h-5 rounded text-indigo-600 flex items-center justify-center">
                    <HiOutlineLocationMarker size={14} />
                  </div>
                  <span className="text-sm">{agent.location}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-3">Social Media :</p>
                <div className="flex gap-3">
                  <a href="#" className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                    <FaFacebookF size={18} />
                  </a>
                  <a href="#" className="text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition-colors">
                    <FaInstagram size={18} />
                  </a>
                  <a href="#" className="text-blue-400 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <FaTwitter size={18} />
                  </a>
                  <a href="#" className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors">
                    <FaWhatsapp size={18} />
                  </a>
                  <a href="#" className="text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition-colors">
                    <AiOutlineMail size={18} />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                  <FaPhone size={16} />
                  Call Us
                </button>
                <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                  <FiMessageSquare size={16} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded font-medium transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GridView;