import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import BreadCrumbs from "./components/BreadCrumbs";
import AnalyticsCards from "./components/Sidebar/Pages/Dashboard/Analytics/AnalyticsCard";
import SalesAnalytic from "./components/Sidebar/Pages/Dashboard/Analytics/SalesAnalytics";
import SocialSource from "./components/Sidebar/Pages/Dashboard/Analytics/SocialSource";
import LastTransaction from "./components/Sidebar/Pages/Dashboard/Analytics/LastTransaction";
import Agent from "./components/Sidebar/Pages/Dashboard/Agent/Agent";
import PropertyGrid from "./components/Sidebar/Pages/Property/PropertyGrid/PropertyGrid";
import PropertyDetails from "./components/Sidebar/Pages/Property/PropertyDetails/PropertyDetails";
import AddProperty from "./components/Sidebar/Pages/Property/AddProperty/AddProperty";
import Login from "./components/auth/login";
import SignUp from "./components/auth/SignUp";
import ResetEmail from "./components/auth/ResetEmail";
import ResetOtp from "./components/auth/ResetOtp";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import GridView from "./components/Sidebar/Pages/Customers/GridView/GridView";
import CustomerDetails from "./components/Sidebar/Pages/Customers/CustomerDetails/CustomerDetails";
import AddCustomer from "./components/Sidebar/Pages/Customers/AddCustomer/AddCustomer";
import Profile from "./components/Sidebar/Pages/Profile/Profile";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    // Check for existing session
    const userStr = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (userStr && isLoggedIn === "true") {
      setIsAuthenticated(true);
    }

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

  const handleLogin = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {isAuthenticated ? (
          // Show dashboard when authenticated
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

                <Routes>
                  {/* Dashboard Routes */}
                  <Route
                    path="/dashboard/analytics"
                    element={
                      <>
                        <AnalyticsCards />
                        <div className="space-y-6 mt-6">
                          <SalesAnalytic />
                          <SocialSource />
                          <LastTransaction />
                        </div>
                      </>
                    }
                  />

                  <Route path="/dashboard/agent" element={<Agent />} />

                  {/* Property Routes */}
                  <Route
                    path="/property/property-grid"
                    element={<PropertyGrid />}
                  />
                  <Route
                    path="/property/property-details"
                    element={<PropertyDetails />}
                  />
                  <Route
                    path="/property/add-property"
                    element={<AddProperty />}
                  />

                  {/* Agent Routes */}
                  {/* <Route path="/agents/grid-view" element={<GridView />} />
                  <Route path="/agents/agent-details" element={<AgentDetails />} />
                  <Route path="/agents/add-agent" element={<AddAgent />} />
                  <Route path="/agents" element={<Navigate to="/agents/grid-view" />} /> */}

                  {/* Customer Routes */}
                  <Route path="/customers/grid-view" element={<GridView />} />
                  <Route
                    path="/customers/customer-details"
                    element={<CustomerDetails />}
                  />
                  <Route
                    path="/customers/add-customer"
                    element={<AddCustomer />}
                  />
                  <Route
                    path="/customers"
                    element={<Navigate to="/customers/grid-view" />}
                  />

                  {/* Other Routes */}
                  <Route path="/orders" element={<div>Orders Page</div>} />
                  <Route
                    path="/transactions"
                    element={<div>Transactions Page</div>}
                  />
                  <Route path="/reviews" element={<div>Reviews Page</div>} />
                  <Route path="/messages" element={<div>Messages Page</div>} />
                  <Route path="/inbox" element={<div>Inbox Page</div>} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Redirects */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/property"
                    element={<Navigate to="/property/property-grid" />}
                  />
                  <Route
                    path="/login"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/signup"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/reset-email"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/reset-otp"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                  <Route
                    path="/confirm-password"
                    element={<Navigate to="/dashboard/analytics" />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          // Show auth pages when not authenticated
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-email" element={<ResetEmail />} />
            <Route path="/reset-otp" element={<ResetOtp />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
