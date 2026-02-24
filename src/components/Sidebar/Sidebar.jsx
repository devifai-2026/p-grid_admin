import React, { useState } from "react";
import {
  FiUsers,
  FiPackage,
  FiMessageSquare,
  FiMail,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiUser,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiBarChart2,
  FiBriefcase,
  FiEdit3,
} from "react-icons/fi";
import {
  MdDashboard,
  MdAnalytics,
  MdRealEstateAgent,
  MdWorkOutline,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Navbar/Preleasegrid logo 1.png";
import { useUserStorage } from "../../helpers/useUserStorage";
import { useAuth } from "../../context/AuthContext";

// ─── Role-based menu definitions ────────────────────────────────────────────

const buildMenuItems = (role) => {
  const roleLower = (role || "").toLowerCase();

  const isAdmin = role === "Admin" || role === "Super Admin";
  const isSalesManager = role === "Sales Manager";
  const isSalesPropertyDealer =
    role === "Sales Executive - Property Manager" ||
    roleLower.includes("property dealer") ||
    roleLower.includes("property manager");
  const isSalesClientDealer =
    role === "Sales Executive - Client Dealer" ||
    roleLower.includes("client dealer");

  const isInternalStaff =
    isAdmin || isSalesManager || isSalesPropertyDealer || isSalesClientDealer;

  const analyticsSubmenu = isSalesManager
    ? [
        {
          title: "Analytics",
          icon: <MdAnalytics className="w-4 h-4" />,
          link: "/dashboard/analytics",
        },
      ]
    : [];

  // ── Shared sections ──────────────────────────────────────────────
  const customersMenu = {
    title: "Customers",
    icon: <FiUsers className="w-5 h-5" />,
    submenus: [
      { title: "All Owner", link: "/customers/owners" },
      { title: "All Broker / Agent", link: "/customers/brokers" },
      { title: "All Investor", link: "/customers/investors" },
    ],
  };

  const profileItem = {
    title: "My Profile",
    icon: <FiUser className="w-5 h-5" />,
    link: "/profile",
  };

  const notificationItem = {
    title: "All Notifications",
    icon: <FiBell className="w-5 h-5" />,
    link: "/notifications",
  };

  const helpItem = {
    title: "Help & Support",
    icon: <FiHelpCircle className="w-5 h-5" />,
    link: "/enquiry",
  };

  const logoutItem = {
    title: "Logout",
    icon: <FiLogOut className="w-5 h-5" />,
    isLogout: true,
  };

  // ── Sales (Property Dealer) ──────────────────────────────────────
  if (isSalesPropertyDealer) {
    return [
      {
        title: "Dashboard",
        icon: <MdDashboard className="w-5 h-5" />,
        submenus: [
          // ...analyticsSubmenu,
          {
            title: "Sales Board",
            icon: <FiBarChart2 className="w-4 h-4" />,
            link: "/dashboard/sales-board",
          },
          {
            title: "Sales Agent",
            icon: <MdRealEstateAgent className="w-4 h-4" />,
            link: "/dashboard/agent",
          },
        ],
      },
      {
        title: "Property",
        icon: <FiHome className="w-5 h-5" />,
        submenus: [
          { title: "My Property", link: "/property/property-details" },
          { title: "Property Pool", link: "/property/property-grid" },
          { title: "Add Property", link: "/property/add-property" },
        ],
      },
      customersMenu,
      notificationItem,
      profileItem,
      helpItem,
      logoutItem,
    ];
  }

  // ── Sales (Client Dealer) ────────────────────────────────────────
  if (isSalesClientDealer) {
    return [
      {
        title: "Dashboard",
        icon: <MdDashboard className="w-5 h-5" />,
        submenus: [
          // ...analyticsSubmenu,
          {
            title: "Enquiry Board",
            icon: <FiMessageSquare className="w-4 h-4" />,
            link: "/enquiry",
          },
          {
            title: "Sales Agent",
            icon: <MdRealEstateAgent className="w-4 h-4" />,
            link: "/dashboard/agent",
          },
        ],
      },
      {
        title: "Property",
        icon: <FiHome className="w-5 h-5" />,
        submenus: [
          { title: "My Property", link: "/property/property-details" },
          { title: "Property Pool", link: "/property/property-grid" },
          { title: "Add Property", link: "/property/add-property" },
        ],
      },
      customersMenu,
      notificationItem,
      profileItem,
      helpItem,
      logoutItem,
    ];
  }

  // ── Sales Manager ────────────────────────────────────────────────
  if (isSalesManager) {
    return [
      {
        title: "Dashboard",
        icon: <MdDashboard className="w-5 h-5" />,
        submenus: [
          {
            title: "Work Board",
            icon: <MdWorkOutline className="w-4 h-4" />,
            link: "/dashboard/work-board",
          },
          ...analyticsSubmenu,
          {
            title: "Property Notes",
            icon: <FiEdit3 className="w-4 h-4" />,
            link: "/dashboard/property-notes",
          },
          {
            title: "Sales Agent (Property Dealer)",
            icon: <MdRealEstateAgent className="w-4 h-4" />,
            link: "/dashboard/agent/property-dealer",
          },
          {
            title: "Sales Agent (Client Dealer)",
            icon: <MdRealEstateAgent className="w-4 h-4" />,
            link: "/dashboard/agent/client-dealer",
          },
        ],
      },
      {
        title: "Property",
        icon: <FiHome className="w-5 h-5" />,
        submenus: [
          { title: "Hot Property", link: "/property/property-details" },
          { title: "Property Pool", link: "/property/property-grid" },
          { title: "Add Property", link: "/property/add-property" },
        ],
      },
      customersMenu,
      notificationItem,
      profileItem,
      helpItem,
      logoutItem,
    ];
  }

  // ── Admin / Super Admin ──────────────────────────────────────────
  if (isAdmin) {
    return [
      {
        title: "Dashboard",
        icon: <MdDashboard className="w-5 h-5" />,
        submenus: [
          // ...analyticsSubmenu,
          {
            title: "Work Board",
            icon: <MdWorkOutline className="w-4 h-4" />,
            link: "/dashboard/work-board",
          },
          {
            title: "Sales Agent",
            icon: <MdRealEstateAgent className="w-4 h-4" />,
            link: "/dashboard/agent",
          },
          {
            title: "Sales Manager",
            icon: <FiBriefcase className="w-4 h-4" />,
            link: "/users?roleName=Sales%20Manager",
          },
        ],
      },
      {
        title: "Property",
        icon: <FiHome className="w-5 h-5" />,
        submenus: [
          { title: "Hot Property", link: "/property/property-details" },
          { title: "Property Pool", link: "/property/property-grid" },
          { title: "Add Property", link: "/property/add-property" },
        ],
      },
      customersMenu,
      notificationItem,
      profileItem,
      helpItem,
      logoutItem,
    ];
  }

  // ── Default fallback ─────────────────────────────────────────────
  return [
    {
      title: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      submenus: [
        // ...analyticsSubmenu,
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
        { title: "Property Details", link: "/property/property-details" },
        { title: "Property Grid", link: "/property/property-grid" },
        { title: "Add Property", link: "/property/add-property" },
      ],
    },
    customersMenu,
    notificationItem,
    profileItem,
    helpItem,
    logoutItem,
  ];
};

// ─── Sidebar Component ────────────────────────────────────────────────────────

const Sidebar = ({ collapsed }) => {
  const { user } = useUserStorage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = buildMenuItems(user?.role);

  const [expandedMenus, setExpandedMenus] = useState(() =>
    menuItems.filter((item) => item.submenus).map((item) => item.title),
  );

  const toggleExpand = (title) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isExpanded = (title) => expandedMenus.includes(title);

  const isActive = (link) => {
    const currentPath = location.pathname + location.search;
    return decodeURIComponent(currentPath) === decodeURIComponent(link);
  };

  const isSubMenuActive = (submenus) =>
    submenus?.some((sub) => isActive(sub.link));

  const isParentActive = (item) => {
    if (item.isLogout) return false;
    if (item.link) return isActive(item.link);
    return item.submenus && isSubMenuActive(item.submenus);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`sticky top-0 h-screen transition-all duration-300 ease-in-out border-r border-red-100 bg-red-50 text-slate-700 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`h-20 flex items-center flex-shrink-0 ${
          collapsed ? "justify-center" : "justify-between px-6"
        } border-b border-red-100`}
      >
        {collapsed ? (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-red-100">
            <span className="text-red-600 font-bold text-xl">P</span>
          </div>
        ) : (
          <img
            src={logo}
            alt="Pre Lease Grid"
            className="h-10 w-auto object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar">
        {!collapsed && (
          <div className="px-3 mb-3">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Main Menu
            </p>
          </div>
        )}

        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            // ── Logout Button ──────────────────────────────────────
            if (item.isLogout) {
              return (
                <li key={index}>
                  <button
                    onClick={handleLogout}
                    title={collapsed ? item.title : ""}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-100 hover:text-red-700 ${
                      collapsed ? "justify-center" : "gap-3"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-0 font-medium text-sm">
                        {item.title}
                      </span>
                    )}
                  </button>
                </li>
              );
            }

            const active = isParentActive(item);
            const expanded = isExpanded(item.title);

            return (
              <li key={index}>
                {/* ── Parent with submenus ───────────────────────── */}
                {item.submenus ? (
                  <div className="group">
                    <button
                      onClick={() => toggleExpand(item.title)}
                      title={collapsed ? item.title : ""}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200
                        ${
                          active
                            ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                            : "text-slate-600 hover:bg-red-100 hover:text-red-700"
                        }
                        ${collapsed ? "justify-center" : "justify-between"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex-shrink-0 ${
                            active
                              ? "text-white"
                              : "text-red-500 group-hover:text-red-600"
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
                          className={`transition-transform duration-200 ${
                            expanded ? "rotate-0" : "-rotate-90"
                          }`}
                        >
                          {expanded ? (
                            <FiChevronDown className="w-4 h-4" />
                          ) : (
                            <FiChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Submenus */}
                    {!collapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expanded
                            ? "max-h-96 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="ml-4 pl-3 border-l-2 border-red-200 space-y-0.5 py-1">
                          {item.submenus.map((sub, subIndex) => {
                            const subActive = isActive(sub.link);
                            return (
                              <li key={subIndex}>
                                <Link
                                  to={sub.link}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150
                                    ${
                                      subActive
                                        ? "bg-red-500 text-white font-semibold shadow-sm"
                                        : "text-slate-500 hover:bg-red-100 hover:text-red-700"
                                    }
                                  `}
                                >
                                  {sub.icon && (
                                    <span className="flex-shrink-0">
                                      {sub.icon}
                                    </span>
                                  )}
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Leaf link ──────────────────────────────────── */
                  <Link
                    to={item.link}
                    title={collapsed ? item.title : ""}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200
                      ${
                        active
                          ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                          : "text-slate-600 hover:bg-red-100 hover:text-red-700"
                      }
                      ${collapsed ? "justify-center" : "gap-3"}
                    `}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        active ? "text-white" : "text-red-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.title}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Profile pill */}
      <div
        className={`flex-shrink-0 border-t border-red-100 p-3 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <Link
          to="/profile"
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-red-100 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">
              {user?.firstName?.charAt(0)?.toUpperCase() ||
                user?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`.trim()
                  : user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.role || "Role"}
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
