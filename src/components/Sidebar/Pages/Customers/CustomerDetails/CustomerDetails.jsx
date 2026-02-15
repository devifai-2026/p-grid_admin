import React, { useState } from 'react';
import { 
  FaPhone, 
  FaEdit, 
  FaShareAlt, 
  FaCommentAlt, 
  FaHome, 
  FaEye, 
  FaLock, 
  FaBuilding, 
  FaTrashAlt, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';
import { 
  BsGraphUp,
  BsGraphDown
} from 'react-icons/bs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CustomerDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Make this a state variable

  // Weekly data for bar chart
  const weeklyData = [
    { day: 'S', value: 4 },
    { day: 'M', value: 5 },
    { day: 'T', value: 3 },
    { day: 'W', value: 4 },
    { day: 'T', value: 6 },
    { day: 'F', value: 5 },
    { day: 'S', value: 4 }
  ];

  // Circular chart data for ownership
  const ownershipData = [
    { name: 'Own', value: 27 },
    { name: 'Other', value: 73 }
  ];

  const COLORS = ['#6366f1', '#e5e7eb'];

  const propertyStats = [
    { icon: FaHome, label: 'Active Property', count: '350', subtext: 'Property Active', color: 'bg-green-100 text-green-600' },
    { icon: FaEye, label: 'View Property', count: '231', subtext: 'Property View', color: 'bg-orange-100 text-orange-600' },
    { icon: FaLock, label: 'Own Property', count: '27', subtext: 'Property Own', color: 'bg-purple-100 text-purple-600' }
  ];

  const interestedProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1570129477492-45481cd5ae38?w=300&h=200&fit=crop',
      title: 'Dvilla Residences',
      location: 'Batu',
      address: '4604, Phill Lane Kiowa',
      beds: 5,
      baths: 4,
      size: '1400ft',
      floors: 3,
      badge: 'A'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
      title: 'PIK Villa House',
      location: '127, Boulevard',
      address: 'Cockeysville',
      beds: 6,
      baths: 5,
      size: '1700ft',
      floors: 3,
      badge: 'B'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
      title: 'Tungis Luxury',
      location: '900 , Creede Wl',
      address: '54913',
      beds: 4,
      baths: 3,
      size: '1200ft',
      floors: 2,
      badge: 'C'
    }
  ];

  // More transaction data for pagination demo
  const transactionHistory = [
    {
      orderId: 'ORD-75234',
      date: '12/19/2025',
      type: 'Residences',
      address: '4604, Phill Lane Kiowa',
      amount: '$45,842',
      status: 'Paid',
      agent: 'Michael A. Miner'
    },
    {
      orderId: 'ORD-54222',
      date: '09/10/2025',
      type: 'Villas',
      address: '127, Boulevard Cockeysville',
      amount: '$76,483',
      status: 'Paid',
      agent: 'Theresa T. Brose'
    },
    {
      orderId: 'ORD-63111',
      date: '11/14/2024',
      type: 'Bungalow',
      address: '900, Creede Wl 54913',
      amount: '$83,644',
      status: 'Paid',
      agent: 'Walter L. Calab'
    },
    {
      orderId: 'ORD-84623',
      date: '08/21/2025',
      type: 'Apartment',
      address: '223, Creede Santa Maria',
      amount: '$94,305',
      status: 'Paid',
      agent: 'Olive Mize'
    },
    {
      orderId: 'ORD-91234',
      date: '07/15/2025',
      type: 'Townhouse',
      address: '789, Oak Street',
      amount: '$58,900',
      status: 'Paid',
      agent: 'John D. Smith'
    },
    {
      orderId: 'ORD-72345',
      date: '06/22/2025',
      type: 'Condo',
      address: '456, Pine Avenue',
      amount: '$67,200',
      status: 'Pending',
      agent: 'Sarah Johnson'
    },
    {
      orderId: 'ORD-83456',
      date: '05/18/2025',
      type: 'Mansion',
      address: '123, Maple Road',
      amount: '$125,000',
      status: 'Paid',
      agent: 'Robert Williams'
    },
    {
      orderId: 'ORD-94567',
      date: '04/12/2025',
      type: 'Duplex',
      address: '321, Elm Street',
      amount: '$89,500',
      status: 'Paid',
      agent: 'Lisa Anderson'
    },
    {
      orderId: 'ORD-10567',
      date: '03/10/2025',
      type: 'Penthouse',
      address: '654, Skyline Blvd',
      amount: '$210,000',
      status: 'Paid',
      agent: 'James Wilson'
    },
    {
      orderId: 'ORD-11678',
      date: '02/05/2025',
      type: 'Studio',
      address: '987, Urban Ave',
      amount: '$35,500',
      status: 'Pending',
      agent: 'Emily Davis'
    },
    {
      orderId: 'ORD-12789',
      date: '01/15/2025',
      type: 'Farmhouse',
      address: '741, Country Rd',
      amount: '$180,000',
      status: 'Paid',
      agent: 'Thomas Brown'
    },
    {
      orderId: 'ORD-13890',
      date: '12/20/2024',
      type: 'Cottage',
      address: '852, Lakeside Dr',
      amount: '$95,000',
      status: 'Paid',
      agent: 'Jessica Miller'
    }
  ];

  const recentTransactions = [
    { name: 'Michael A. Miner', email: 'michaelminer@dayrep.com', amount: '$13,987', txn: 'TXN-341220' },
    { name: 'Theresa T. Brose', email: 'theresabrosea@dayrep.com', amount: '$2,710', txn: 'TXN-836451' },
    { name: 'Michael A. Miner', email: 'michaelminer@dayrep.com', amount: '$13,987', txn: 'TXN-341220' },
    { name: 'Theresa T. Brose', email: 'theresabrosea@dayrep.com', amount: '$2,710', txn: 'TXN-836451' }
  ];

  // Calculate total pages based on current itemsPerPage
  const totalPages = Math.ceil(transactionHistory.length / itemsPerPage);
  
  // Get current transactions based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactionHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
        if (totalPages > 3) pageNumbers.push('...');
      } else if (currentPage >= totalPages - 1) {
        if (totalPages > 3) pageNumbers.push('...');
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 md:p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Property Image */}
          <div className="h-64 bg-gradient-to-r from-red-500 to-[#EE2529] relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=400&fit=crop"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>

            {/* Profile Section */}
            <div className="px-4 md:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
                    alt="David Nummi"
                    className="w-24 h-24 rounded-full border-4 border-[#EE2529]"
                  />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">David Nummi</h1>
                    <p className="text-[#EE2529] font-semibold">EastTribune.nl</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-[#EE2529] text-white rounded-lg hover:bg-[#D32F2F] transition-colors">
                    <FaCommentAlt className="w-4 h-4" />
                    Chat Us
                  </button>
                  <button className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    <FaPhone className="w-4 h-4" />
                    Phone
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <FaEdit className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <FaShareAlt className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8 pt-8 border-t border-slate-200">
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-600 font-medium mb-2">Email Address:</p>
                <p className="text-slate-900 text-sm break-all">davidnumminer@telework.us</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-600 font-medium mb-2">Phone Number:</p>
                <p className="text-slate-900 text-sm">+231 06-75820711</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-600 font-medium mb-2">Location:</p>
                <p className="text-slate-900 text-sm">Schoolstraat 161 5151 HH Drunen</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-600 font-medium mb-2">Status:</p>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">Available</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-600 font-medium mb-3">Social Media:</p>
                <div className="flex justify-center md:justify-start gap-3 flex-wrap">
                  {[
                    { bg: 'bg-blue-100', text: 'text-blue-600', icon: '📘' },
                    { bg: 'bg-pink-100', text: 'text-pink-600', icon: '📷' },
                    { bg: 'bg-sky-100', text: 'text-sky-500', icon: '𝕏' },
                    { bg: 'bg-green-100', text: 'text-green-600', icon: '💬' },
                    { bg: 'bg-orange-100', text: 'text-orange-500', icon: '✉️' }
                  ].map((social, i) => (
                    <button key={i} className={`w-10 h-10 rounded-lg ${social.bg} hover:shadow-md transition-all flex items-center justify-center`}>
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Weekly Activity</h3>
                <span className="text-sm text-slate-600">Jan-Dec 2023 | First Week 37</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4">
              {propertyStats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.count}</p>
                  <p className="text-xs text-slate-500">{stat.subtext}</p>
                  <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interested Properties */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Interested Properties (3)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestedProperties.map((property) => (
                  <div key={property.id} className="flex flex-col gap-3 group">
                    <div className="relative overflow-hidden rounded-xl cursor-pointer">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm z-10">
                        {property.badge}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h4 className="text-white font-bold">{property.title}</h4>
                        <p className="text-white/80 text-sm">{property.location}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg flex-1 hover:shadow-md transition-shadow border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-semibold text-slate-900">{property.title}</p>
                        <span className="text-xs font-bold text-[#EE2529] bg-red-50 px-2 py-1 rounded">For Sale</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <span>📍</span> {property.address}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-3 border-t border-slate-200">
                        <span className="flex items-center gap-1">🛏️ {property.beds} Beds</span>
                        <span className="flex items-center gap-1">🚿 {property.baths} Baths</span>
                        <span className="flex items-center gap-1">📐 {property.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Transactions */}
          <div className="space-y-6">
            {/* Credit Card */}
            <div className="bg-gradient-to-br from-[#EE2529] to-red-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-10 h-8 bg-yellow-400 rounded"></div>
                <div className="w-10 h-8 bg-orange-400 rounded"></div>
              </div>
              <p className="text-sm opacity-80 mb-6">Card Name</p>
              <p className="text-lg font-bold mb-2">XXXX XXXX XXXX 3467</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-80 mb-1">Holder Name</p>
                  <p className="font-semibold">Ray C. Nichols</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 mb-1">Valid Thru</p>
                  <p className="font-semibold">05/26</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div></div>
                <div className="flex gap-2">
                  <div className="w-8 h-6 bg-white/20 rounded-full"></div>
                  <div className="w-8 h-6 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm p-2">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Transactions</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-5 h-5 text-[#EE2529]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{txn.name}</p>
                        <p className="text-xs text-slate-500">{txn.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{txn.amount}</p>
                      <p className="text-xs text-slate-500">{txn.txn}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-center text-[#EE2529] font-semibold hover:bg-red-50 rounded-lg transition-colors">
                View More
              </button>
            </div>

            {/* Own Property Circle Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Own Property</h3>
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ownershipData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ownershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[#EE2529]">27%</p>
                    <p className="text-xs text-slate-600">Own</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 flex items-center gap-4">
                <BsGraphUp className="w-8 h-8 text-rose-500" />
                <div>
                  <p className="text-xs text-rose-600 font-medium">Total Invest On Property</p>
                  <p className="text-lg font-bold text-rose-700">$928,128</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 flex items-center gap-4">
                <BsGraphDown className="w-8 h-8 text-emerald-500" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium">Income</p>
                  <p className="text-lg font-bold text-emerald-700">$613,321.12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto text-sm">
              <span className="text-slate-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, transactionHistory.length)} of {transactionHistory.length} entries
              </span>
              <select className="border border-slate-300 rounded-lg px-3 py-1 text-slate-700 w-full sm:w-auto">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Transaction Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Property Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Properties Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Agent Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900 font-semibold">{transaction.orderId}</td>
                    <td className="py-3 px-4 text-slate-600">{transaction.date}</td>
                    <td className="py-3 px-4 text-slate-600">{transaction.type}</td>
                    <td className="py-3 px-4 text-slate-600">{transaction.address}</td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{transaction.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{transaction.agent}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                        <FaEye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                        <FaEdit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded transition-colors">
                        <FaTrashAlt className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Rows:</span>
                <select 
                  className="text-sm border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
              <button 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-sm">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 flex items-center justify-center ${
                        currentPage === pageNum
                          ? 'bg-[#EE2529] text-white shadow-sm'
                          : 'hover:bg-slate-100 text-slate-700 bg-white border border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>
              
              <button 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;