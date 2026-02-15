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
} from "react-icons/fi";
import { MdDashboard, MdAnalytics, MdRealEstateAgent } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Navbar/Preleasegrid logo 1.png";

const Sidebar = ({ collapsed }) => {
  const [expandedMenus, setExpandedMenus] = useState(["Dashboards"]);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboards",
      icon: <MdDashboard className="w-5 h-5" />,
      submenus: [
        {
          title: "Analytics",
          icon: <MdAnalytics className="w-5 h-5" />,
          link: "/dashboard/analytics",
        },
        {
          title: "Agent",
          icon: <MdRealEstateAgent className="w-5 h-5" />,
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
    // { title: 'Agents',
    //   icon: <MdRealEstateAgent className="w-5 h-5" />,
    //         submenus: [
    //           { title: 'Grid View', link: '/agents/grid-view' },
    //           { title: 'Agent Details', link: '/agents/agent-details' },
    //           { title: 'Add Agent', link: '/agents/add-agent' },
    //         ]
    // },
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
      title: "Orders",
      icon: <FiPackage className="w-5 h-5" />,
      link: "/orders",
    },
    {
      title: "Transactions",
      icon: <FiCreditCard className="w-5 h-5" />,
      link: "/transactions",
    },
    {
      title: "Reviews",
      icon: <FiStar className="w-5 h-5" />,
      link: "/reviews",
    },
    {
      title: "Messages",
      icon: <FiMessageSquare className="w-5 h-5" />,
      link: "/messages",
    },
    { title: "Inbox", icon: <FiMail className="w-5 h-5" />, link: "/inbox" },
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
    return submenus.some((sub) => location.pathname === sub.link);
  };

  return (
    <aside
      className="shadow-xl min-h-screen border-r transition-all duration-300"
      style={{ backgroundColor: "#4c0707ff", borderColor: "#F1F3F5" }}
    >
      <div
        className={`${collapsed ? "px-2" : "px-6"} py-6 border-b mb-4`}
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <h2
          className={`font-bold tracking-wide ${collapsed ? "text-xl text-center" : "text-2xl text-left"} transition-all duration-300`}
          style={{ color: "#FFF" }}
        >
          {collapsed ? (
            "PLA"
          ) : (
            <div className="bg-white rounded-xl p-2 w-full flex items-center justify-start shadow-sm">
              <img
                src={logo}
                alt="Pre Lease Grid"
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
        </h2>
      </div>
      <nav className="p-3">
        <h2
          className={`text-xs font-bold uppercase tracking-wider mb-4 ${collapsed ? "hidden" : "block px-3"}`}
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Menu
        </h2>
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const hasActiveSub =
              item.submenus && isSubMenuActive(item.submenus);
            return (
              <li key={index}>
                {item.submenus ? (
                  <div className="group">
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={`flex items-center p-3 rounded-xl w-full ${collapsed ? "justify-center" : "justify-between"}
                    ${hasActiveSub ? "bg-white/10" : "hover:bg-white/10"}
                    transition-all duration-200 cursor-pointer`}
                      style={{
                        color: hasActiveSub ? "#FFF" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <div
                        className={`flex items-center ${collapsed ? "justify-center" : ""}`}
                      >
                        <span
                          className={`${hasActiveSub ? "text-white" : "text-white/70 group-hover:text-white"} transition-colors`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="ml-3 font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>
                          {isExpanded(item.title) ? (
                            <FiChevronDown size={14} />
                          ) : (
                            <FiChevronRight size={14} />
                          )}
                        </span>
                      )}
                    </button>
                    {!collapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded(item.title) ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                      >
                        <div
                          className="ml-4 pl-4 space-y-1 my-1"
                          style={{
                            borderLeft: "1px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          {item.submenus.map((sub, subIndex) => (
                            <Link
                              key={subIndex}
                              to={sub.link}
                              className={`flex items-center py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                                isActive(sub.link)
                                  ? "bg-white/20 text-white font-medium"
                                  : "hover:bg-white/10"
                              }`}
                              style={
                                !isActive(sub.link)
                                  ? { color: "rgba(255,255,255,0.7)" }
                                  : undefined
                              }
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
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive(item.link)
                        ? "bg-white/20 text-white shadow-md"
                        : "hover:bg-white/10"
                    }`}
                    style={
                      !isActive(item.link)
                        ? { color: "rgba(255,255,255,0.7)" }
                        : undefined
                    }
                    title={collapsed ? item.title : ""}
                  >
                    <span
                      className={`${isActive(item.link) ? "text-white" : "text-white/70 group-hover:text-white"} transition-colors`}
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
    </aside>
  );
};

export default Sidebar;
