import React from 'react';
import { FiDollarSign, FiHome, FiTrendingUp, FiMapPin } from 'react-icons/fi';

const ListCards = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Incomes',
      value: '$12,7812.09',
      change: '+34.4% vs last month',
      changeType: 'positive',
      icon: <FiDollarSign className="w-5 h-5" />,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Total Properties',
      value: '15,780 Unit',
      change: '-8.5% vs last month',
      changeType: 'negative',
      icon: <FiHome className="w-5 h-5" />,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      title: 'Unit Sold',
      value: '893 Unit',
      change: '+17% vs last month',
      changeType: 'positive',
      icon: <FiTrendingUp className="w-5 h-5" />,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Unit Rent',
      value: '459 Unit',
      change: '-12% vs last month',
      changeType: 'negative',
      icon: <FiMapPin className="w-5 h-5" />,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <div className={stat.iconColor}>
                {stat.icon}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {stat.changeType === 'positive' ? (
                <>
                  <span className="text-green-600 text-sm font-medium">
                    ↑ {stat.change}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-red-600 text-sm font-medium">
                    ↓ {stat.change}
                  </span>
                </>
              )}
            </div>
            <a 
              href="#" 
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1"
            >
              See Details
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListCards;