import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map URL segments to display names
  const getDisplayName = (segment) => {
    const nameMap = {
      dashboard: "Dashboard",
      analytics: "Analytics",
      agent: "Agent",
      property: "Property",
      add: "Add",
      details: "Details",
      grid: "Grid",
      list: "List",
      agents: "Agents",
      customers: "Customers",
      orders: "Orders",
      transactions: "Transactions",
      reviews: "Reviews",
      messages: "Messages",
      inbox: "Inbox",
    };

    return (
      nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  // Build the breadcrumb items
  const crumbs = [];
  let path = "";

  // Add Home as first breadcrumb
  crumbs.push({
    label: "Home",
    path: "/",
    isLast: false,
  });

  // Build breadcrumbs from URL segments
  pathnames.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === pathnames.length - 1;

    crumbs.push({
      label: getDisplayName(segment),
      path: path,
      isLast: isLast,
    });
  });

  return (
    <div className="mb-6">
      <nav className="flex items-center text-xs sm:text-sm">
        <div className="flex flex-wrap items-center">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.isLast ? (
                <span className="text-gray-800 font-medium truncate max-w-[150px] sm:max-w-none">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
              {index < crumbs.length - 1 && (
                <FiChevronRight
                  className="mx-1 sm:mx-2 text-gray-400 shrink-0"
                  size={14}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BreadCrumbs;
