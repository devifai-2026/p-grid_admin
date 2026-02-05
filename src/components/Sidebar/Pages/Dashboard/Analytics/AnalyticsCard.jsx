import React, { useEffect } from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AnalyticsCards = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true, // Animation triggers only once
      offset: 100, // Distance from element before triggering
      delay: 100, // Default delay
    });
  }, []);

  const cards = [
    { 
      title: 'No. of Properties', 
      value: '2,854',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: null,
      isPercentage: false,
      animation: 'fade-up',
      delay: 100
    },
    { 
      title: 'Regi. Agents', 
      value: '705',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: null,
      isPercentage: false,
      animation: 'fade-up',
      delay: 200
    },
    { 
      title: 'Customers', 
      value: '9,431',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: null,
      isPercentage: false,
      animation: 'fade-up',
      delay: 300
    },
    { 
      title: 'Revenue', 
      value: '$78.3M',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: null,
      isPercentage: false,
      animation: 'fade-up',
      delay: 400
    },
    { 
      title: 'SMTW FS', 
      value: '↑7.34%', 
      icon: <FiTrendingUp className="text-green-500 mr-2" />, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      isPercentage: true,
      animation: 'fade-up',
      delay: 500
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index}
          data-aos={card.animation}
          data-aos-delay={card.delay}
          data-aos-duration="600"
          data-aos-easing="ease-out-cubic"
          className={`${card.bgColor} p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
        >
          <h3 
            className="text-gray-500 text-sm mb-2"
            data-aos="fade-right"
            data-aos-delay={card.delay + 200}
            data-aos-duration="500"
          >
            {card.title}
          </h3>
          
          <div className="">
            {card.icon && (
              <div
                data-aos="zoom-in"
                data-aos-delay={card.delay + 300}
                data-aos-duration="400"
              >
                {card.icon}
              </div>
            )}
            <p 
              className={`text-2xl font-bold ${card.color} ${card.isPercentage ? 'text-green-500' : ''}`}
              data-aos="zoom-in"
              data-aos-delay={card.delay + 400}
              data-aos-duration="600"
            >
              {card.value}
            </p>
            
            {card.isPercentage && (
              <span 
                className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full"
                data-aos="zoom-in"
                data-aos-delay={card.delay + 500}
                data-aos-duration="500"
              >
                Growth
              </span>
            )}
          </div>
          
          <div 
            className="mt-4 pt-4 border-t border-gray-100"
            data-aos="fade-up"
            data-aos-delay={card.delay + 600}
            data-aos-duration="500"
          >
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