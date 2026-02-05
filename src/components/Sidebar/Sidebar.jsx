import React, { useState } from 'react';
import {
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiStar,
  FiMessageSquare,
  FiMail,
  FiChevronDown,
  FiChevronRight,
  FiHome,
} from 'react-icons/fi';
import {
  MdDashboard,
  MdAnalytics,
  MdRealEstateAgent,
} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const [expandedMenus, setExpandedMenus] = useState(['Dashboards']);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboards',
      icon: <MdDashboard className="w-6 h-6" />,
      submenus: [
        {
          title: 'Analytics',
          icon: <MdAnalytics className="w-5 h-5" />,
          link: '/dashboard/analytics'
        },
        {
          title: 'Agent',
          icon: <MdRealEstateAgent className="w-5 h-5" />,
          link: '/dashboard/agent'
        }
      ]
    },
    { 
      title: 'Property',
      icon: <FiHome className="w-6 h-6" />,
      submenus: [
         {
          title: 'Property Grid',
          link: '/property/property-grid'
        },
        {
          title: 'Property List',
          link: '/property/property-list'
        },
         {
          title: 'Property Details',
          link: '/property/property-details'
        },
        {
          title: 'Add Property',
          link: '/property/add-property'
        },
       
       
      ]
    },
    { title: 'Agents', icon: <MdRealEstateAgent className="w-6 h-6" />, link: '/agents' },
    { title: 'Customers', icon: <FiUsers className="w-6 h-6" />, link: '/customers' },
    { title: 'Orders', icon: <FiPackage className="w-6 h-6" />, link: '/orders' },
    { title: 'Transactions', icon: <FiCreditCard className="w-6 h-6" />, link: '/transactions' },
    { title: 'Reviews', icon: <FiStar className="w-6 h-6" />, link: '/reviews' },
    { title: 'Messages', icon: <FiMessageSquare className="w-6 h-6" />, link: '/messages' },
    { title: 'Inbox', icon: <FiMail className="w-6 h-6" />, link: '/inbox' }
  ];

  const toggleExpand = (title) => {
    if (expandedMenus.includes(title)) {
      setExpandedMenus(expandedMenus.filter(item => item !== title));
    } else {
      setExpandedMenus([...expandedMenus, title]);
    }
  };

  const isExpanded = (title) => expandedMenus.includes(title);
  
  // Check if a link is active
  const isActive = (link) => {
    return location.pathname === link;
  };

  return (
    <aside className="bg-black shadow-lg min-h-screen">
      <div className={`${collapsed ? 'px-2' : 'px-4'} py-4`}>
        <h2 className={`text-white text-2xl ${collapsed ? 'text-center' : 'text-left'}`}>
          {collapsed ? 'PLA' : 'Pre Lease Admin'}
        </h2>
      </div>
      <nav className="p-2">
        <h2 className={`text-gray-300 mb-4 ${collapsed ? 'hidden' : 'block px-2'}`}>
          MENU
        </h2>
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenus ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-800 w-full ${collapsed ? 'justify-center' : 'justify-between'} text-gray-300 hover:text-white transition-all duration-200`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                      <span>{item.icon}</span>
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <span>
                        {isExpanded(item.title) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                      </span>
                    )}
                  </button>
                  {!collapsed && isExpanded(item.title) && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.submenus.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          to={sub.link}
                          className={`flex items-center p-2 text-sm rounded-lg hover:bg-gray-800 hover:text-white ${
                            isActive(sub.link) 
                              ? 'font-bold text-white' 
                              : 'text-gray-300'
                          }`}
                        >
                          {sub.icon && <span className="mr-3">{sub.icon}</span>}
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.link}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive(item.link) 
                      ? 'font-bold text-white' 
                      : 'text-gray-300'
                  }`}
                  title={collapsed ? item.title : ''}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;