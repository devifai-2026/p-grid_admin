import React, { useState } from "react";
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
  FiLayout,
  FiUser,
  FiBell,
} from "react-icons/fi";
import { MdDashboard, MdAnalytics, MdRealEstateAgent } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Navbar/Preleasegrid logo 1.png";

import { useUserStorage } from "../../helpers/useUserStorage";

const Sidebar = ({ collapsed }) => {
  const { user } = useUserStorage();
  const [expandedMenus, setExpandedMenus] = useState([
    "Dashboards",
    "Property",
    "Customers",
  ]);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboards",
      icon: <MdDashboard className="w-5 h-5" />,
      submenus: [
        {
          title: "Analytics",
          icon: <MdAnalytics className="w-4 h-4" />,
          link: "/dashboard/analytics",
        },
        {
          title: "Agent",
          icon: <MdRealEstateAgent className="w-4 h-4" />,
          link: "/dashboard/agent",
        },
      ],
    },
    {
      title: "Property",
      icon: <FiHome className="w-5 h-5" />,
      submenus: [
        {
          title: "Property Grid",
          link: "/property/property-grid",
        },
        {
          title: "Property Details",
          link: "/property/property-details",
        },
        {
          title: "Add Property",
          link: "/property/add-property",
        },
      ],
    },
    {
      title: "Customers",
      icon: <FiUsers className="w-5 h-5" />,
      submenus: [
        { title: "Grid View", link: "/customers/grid-view" },
        { title: "Customer Details", link: "/customers/customer-details" },
        { title: "Add Customer", link: "/customers/add-customer" },
      ],
    },
    {
      title: "Users",
      icon: <FiUser className="w-5 h-5" />,
      link: "/users",
    },
    ...(user?.role === "Sales Manager" || user?.role === "Sales Executive"
      ? [
          {
            title: "Enquiry",
            icon: <FiMessageSquare className="w-5 h-5" />,
            link: "/enquiry",
          },
        ]
      : []),
    {
      title: "All Notifications",
      icon: <FiBell className="w-5 h-5" />,
      link: "/notifications",
    },
  ];

  const toggleExpand = (title) => {
    if (expandedMenus.includes(title)) {
      setExpandedMenus(expandedMenus.filter((item) => item !== title));
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
    return submenus?.some((sub) => location.pathname === sub.link);
  };

  const isParentActive = (item) => {
    if (item.link) return isActive(item.link);
    return item.submenus && isSubMenuActive(item.submenus);
  };

  return (
    <aside
      className={`sticky top-0 h-screen transition-all duration-300 ease-in-out border-r border-red-100 bg-red-50 text-slate-700 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`h-20 flex items-center ${collapsed ? "justify-center" : "justify-between px-6"} border-b border-red-100`}
      >
        {collapsed ? (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-red-100">
            <span className="text-red-600 font-bold text-xl">P</span>
          </div>
        ) : (
          // <div className="bg-white rounded-xl p-2 w-full flex items-center justify-center border border-red-100 shadow-sm">
          <img
            src={logo}
            alt="Pre Lease Grid"
            className="h-10 w-auto object-contain"
          />
          // </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-2 px-3 pb-24 custom-scrollbar">
        {!collapsed && (
          <div className="px-3 mb-2">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Main Menu
            </p>
          </div>
        )}

        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const active = isParentActive(item);
            const expanded = isExpanded(item.title);

            return (
              <li key={index}>
                {item.submenus ? (
                  <div className="group">
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200
                        ${active ? "bg-red-500 text-white shadow-md hover:bg-red-600" : "text-slate-600 hover:bg-red-100 hover:text-red-700"}
                        ${collapsed ? "justify-center" : "justify-between"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${
                            active
                              ? "text-white"
                              : collapsed
                                ? "text-red-500"
                                : "text-slate-400 group-hover:text-red-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <span
                          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        >
                          <FiChevronDown
                            className={`w-4 h-4 ${active ? "opacity-75 text-white" : "opacity-40 group-hover:text-red-500"}`}
                          />
                        </span>
                      )}
                    </button>

                    {/* Submenus */}
                    {!collapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                      >
                        <ul className="space-y-1 pl-10 pr-2 pb-1 relative">
                          {/* Vertical line for visual hierarchy */}
                          <div className="absolute left-6 top-0 bottom-0 w-px bg-red-200"></div>

                          {item.submenus.map((sub, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={sub.link}
                                className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200
                                    ${
                                      isActive(sub.link)
                                        ? "bg-white text-red-600 font-semibold shadow-sm border border-red-100 transform translate-x-1"
                                        : "text-slate-500 hover:text-red-600 hover:bg-red-100/50 hover:translate-x-1"
                                    }
                                  `}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.link}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-red-100
                      ${active ? "bg-red-500 text-white shadow-md" : "text-slate-600 hover:text-red-700"}
                      ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? item.title : ""}
                  >
                    <span
                      className={`${
                        active
                          ? "text-white"
                          : collapsed
                            ? "text-red-500"
                            : "text-slate-400 group-hover:text-red-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="ml-3 font-medium text-sm">
                        {item.title}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Profile Summary */}
      {!collapsed && (
        <div className="absolute bottom-0 w-full p-4 ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.role || "Role"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
