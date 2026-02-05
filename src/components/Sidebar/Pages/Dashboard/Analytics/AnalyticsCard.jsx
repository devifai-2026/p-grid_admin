import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const AnalyticsCards = () => {
  const cards = [
    { 
      title: 'No. of Properties', 
      value: '2,854',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Regi. Agents', 
      value: '705',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Customers', 
      value: '9,431',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Revenue', 
      value: '$78.3M',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'SMTW FS', 
      value: '↑7.34%', 
      icon: <FiTrendingUp className="text-green-500 mr-2" />, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      isPercentage: true 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-xl shadow hover:shadow-md transition-shadow`}>
          <h3 className="text-gray-500 text-sm mb-2">{card.title}</h3>
          <div className="flex items-center">
            {card.icon}
            <p className={`text-2xl font-bold ${card.color} ${card.isPercentage ? 'text-green-500' : ''}`}>
              {card.value}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {index === 0 && 'Total listed properties'}
              {index === 1 && 'Registered real estate agents'}
              {index === 2 && 'Active customer accounts'}
              {index === 3 && 'Total revenue generated'}
              {index === 4 && 'Sales growth this week'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;