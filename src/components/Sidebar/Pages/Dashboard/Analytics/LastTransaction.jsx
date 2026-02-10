import React, { useState } from 'react';
import { FiEye, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';

const LastTransaction = () => {
  const transactions = [
    { 
      id: '#201', 
      buyerName: 'Michael A. Miner',
      buyerInitial: 'MA',
      buyerColor: 'bg-blue-100 text-blue-600',
      invoice: 'IN-4563', 
      date: 'Dec 17, 2025', 
      amount: '45,842', 
      method: 'Mastercard', 
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      id: '#202', 
      buyerName: 'Theresa T. Brose',
      buyerInitial: 'TB',
      buyerColor: 'bg-purple-100 text-purple-600',
      invoice: 'IN-4563', 
      date: 'Sep 8, 2025', 
      amount: '78,483', 
      method: 'Visa', 
      status: 'Cancel',
      statusColor: 'bg-red-100 text-red-800'
    },
    { 
      id: '#203', 
      buyerName: 'James L. Erickson',
      buyerInitial: 'JE',
      buyerColor: 'bg-green-100 text-green-600',
      invoice: 'IN-4563', 
      date: 'Nov 12, 2024', 
      amount: '83,644', 
      method: 'Paypal', 
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      id: '#204', 
      buyerName: 'Lily W. Wilson',
      buyerInitial: 'LW',
      buyerColor: 'bg-pink-100 text-pink-600',
      invoice: 'IN-4563', 
      date: 'Aug 19, 2025', 
      amount: '94,305', 
      method: 'Mastercard', 
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    { 
      id: '#205', 
      buyerName: 'Sarah M. Brooks',
      buyerInitial: 'SB',
      buyerColor: 'bg-indigo-100 text-indigo-600',
      invoice: 'IN-4563', 
      date: 'Oct 8, 2025', 
      amount: '42,561', 
      method: 'Visa', 
      status: 'Cancel',
      statusColor: 'bg-red-100 text-red-800'
    },
    { 
      id: '#206', 
      buyerName: 'Joe K. Hall',
      buyerInitial: 'JH',
      buyerColor: 'bg-orange-100 text-orange-600',
      invoice: 'IN-4563', 
      date: 'Jan 15, 2024', 
      amount: '25,671', 
      method: 'Paypal', 
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');
  const [showDropdown, setShowDropdown] = useState(false);

  const timeRanges = ['This Week', 'This Month', 'Last Month', 'This Year', 'Last Year', 'Custom Range'];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    setShowDropdown(false);
    // Here you would typically filter transactions based on the selected time range
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Latest Transaction</h2>
        
        {/* Time Range Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="text-gray-700 text-sm">{timeRange}</span>
            <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  {timeRanges.map((range, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                        timeRange === range 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleTimeRangeSelect(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Purchase ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Buyer Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Purchase Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment Method</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleSelectRow(index)}
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700">{transaction.id}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.buyerColor}`}>
                      <span className="text-sm font-medium">{transaction.buyerInitial}</span>
                    </div>
                    <div>
                      <div className="text-gray-800">{transaction.buyerName}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{transaction.invoice}</td>
                <td className="py-4 px-4 text-gray-600">{transaction.date}</td>
                <td className="py-4 px-4">
                  <span className="text-gray-800">${transaction.amount}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600">{transaction.method}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 text-xs font-medium ${transaction.statusColor}`}>
                      {transaction.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    {/* Eye Icon - View */}
                    <button 
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors duration-200"
                      title="View"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    
                    {/* Pen Icon - Edit */}
                    <button 
                      className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors duration-200"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    
                    {/* Trash Icon - Delete */}
                    <button 
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors duration-200"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastTransaction;