import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header";
import BreadCrumbs from "../BreadCrumbs";
import { useAuth } from "../../context/AuthContext";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); // Reset collapsed state on mobile
        setShowMobileSidebar(false); // Hide sidebar by default on mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      {!isMobile && (
        <div
          className={`${sidebarCollapsed ? "w-20" : "w-64"} flex-shrink-0 transition-all duration-300 ease-in-out h-full overflow-y-auto border-r border-gray-200`}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
      )}

      {/* Sidebar Mobile Overlay */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}
          {/* Sidebar Drawer */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
              showMobileSidebar ? "translate-x-0" : "-translate-x-full"
            } lg:hidden`}
          >
            <Sidebar collapsed={false} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Main Header */}
        <div className="flex-shrink-0 z-30 bg-white">
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <BreadCrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
