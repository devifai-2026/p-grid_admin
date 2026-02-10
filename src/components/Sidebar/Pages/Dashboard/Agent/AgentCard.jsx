import React, { useEffect } from 'react';
import { FiTrendingUp, FiPercent } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AgentCard = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  const stats = [
    {
      title: 'Earn of the Month',
      value: '₹3548.09',
      icon: <FaRupeeSign className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600',
      change: null
    },
    {
      title: 'Earn Growth',
      value: '↑44%',
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600',
      change: 'positive'
    },
    {
      title: 'Conversation Rate',
      value: '78.8%',
      icon: <FiPercent className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600',
      change: null
    },
    {
      title: 'Gross Profit Margin',
      value: '34.00%',
      icon: <FiPercent className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600',
      change: null
    }
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">
                  {stat.title}
                </div>
                <div className={`text-2xl font-bold ${stat.change === 'positive' ? 'text-green-600' : 'text-gray-800'}`}>
                  {stat.value}
                </div>
                {stat.change && (
                  <div className="text-xs mt-1">
                    <span className="text-green-500 font-medium">+2.5%</span>
                    <span className="text-gray-400 ml-1">from last month</span>
                  </div>
                )}
              </div>
              
              <div className={`p-2 rounded-lg ${stat.color} transition-transform duration-300 hover:scale-110 flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default AgentCard;