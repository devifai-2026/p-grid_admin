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
      icon: <MdDashboard className="w-5 h-5" />,
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
      icon: <FiHome className="w-5 h-5" />,
      submenus: [
         {
          title: 'Property Grid',
          link: '/property/property-grid'
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
    // { title: 'Agents',
    //   icon: <MdRealEstateAgent className="w-5 h-5" />,
    //         submenus: [
    //           { title: 'Grid View', link: '/agents/grid-view' },
    //           { title: 'Agent Details', link: '/agents/agent-details' },
    //           { title: 'Add Agent', link: '/agents/add-agent' },
    //         ]
    // },
       { title: 'Customers',
      icon: <FiUsers className="w-5 h-5" />,
            submenus: [
              { title: 'Grid View', link: '/customers/grid-view' },
              { title: 'Customer Details', link: '/customers/customer-details' },
              { title: 'Add Customer', link: '/customers/add-customer' },
            ]
    },
    { title: 'Orders', icon: <FiPackage className="w-5 h-5" />, link: '/orders' },
    { title: 'Transactions', icon: <FiCreditCard className="w-5 h-5" />, link: '/transactions' },
    { title: 'Reviews', icon: <FiStar className="w-5 h-5" />, link: '/reviews' },
    { title: 'Messages', icon: <FiMessageSquare className="w-5 h-5" />, link: '/messages' },
    { title: 'Inbox', icon: <FiMail className="w-5 h-5" />, link: '/inbox' }
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

  const isSubMenuActive = (submenus) => {
      return submenus.some(sub => location.pathname === sub.link);
  }

  return (
    <aside className="bg-slate-900 shadow-xl min-h-screen border-r border-slate-800 transition-all duration-300">
      <div className={`${collapsed ? 'px-2' : 'px-6'} py-6 border-b border-slate-800 mb-4`}>
        <h2 className={`text-white font-bold tracking-wide ${collapsed ? 'text-xl text-center' : 'text-2xl text-left'} transition-all duration-300`}>
          {collapsed ? 'PLA' : 'Pre Lease'}
        </h2>
      </div>
      <nav className="p-3">
        <h2 className={`text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 ${collapsed ? 'hidden' : 'block px-3'}`}>
          Menu
        </h2>
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const hasActiveSub = item.submenus && isSubMenuActive(item.submenus);
            return (
            <li key={index}>
              {item.submenus ? (
                <div className="group">
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`flex items-center p-3 rounded-xl w-full ${collapsed ? 'justify-center' : 'justify-between'} 
                    ${hasActiveSub ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'} 
                    transition-all duration-200 cursor-pointer`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                      <span className={`${hasActiveSub ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`}>{item.icon}</span>
                      {!collapsed && <span className="ml-3 font-medium text-sm">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-slate-500">
                        {isExpanded(item.title) ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      </span>
                    )}
                  </button>
                  {!collapsed && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded(item.title) ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className="ml-4 pl-4 border-l border-slate-700/50 space-y-1 my-1">
                        {item.submenus.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sub.link}
                            className={`flex items-center py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                              isActive(sub.link) 
                                ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            {/* {sub.icon && <span className="mr-3 text-opacity-70">{sub.icon}</span>} */}
                            <span>{sub.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.link}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive(item.link) 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                  title={collapsed ? item.title : ''}
                >
                  <span className={`${isActive(item.link) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`}>{item.icon}</span>
                  {!collapsed && <span className="ml-3 font-medium text-sm">{item.title}</span>}
                </Link>
              )}
            </li>
          )})}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;