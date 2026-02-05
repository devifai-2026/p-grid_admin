import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header';
import BreadCrumbs from './components/BreadCrumbs';
import AnalyticsCards from './components/Sidebar/Pages/Dashboard/Analytics/AnalyticsCard';
import SalesAnalytic from './components/Sidebar/Pages/Dashboard/Analytics/SalesAnalytics';
import SocialSource from './components/Sidebar/Pages/Dashboard/Analytics/SocialSource';
import LastTransaction from './components/Sidebar/Pages/Dashboard/Analytics/LastTransaction';
import Agent from './components/Sidebar/Pages/Dashboard/Agent/Agent';
import PropertyGrid from './components/Sidebar/Pages/Property/PropertyGrid/PropertyGrid';
import PropertyList from './components/Sidebar/Pages/Property/PropertyList/PropertyList';
import PropertyDetails from './components/Sidebar/Pages/Property/PropertyDetails/PropertyDetails';
import AddProperty from './components/Sidebar/Pages/Property/AddProperty/AddProperty';
import Login from './components/auth/login';
import SignUp from './components/auth/SignUp';
import ResetEmail from './components/auth/ResetEmail';
import ResetOtp from './components/auth/ResetOtp';
import ConfirmPassword from './components/auth/ConfirmPassword';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with false so login page shows first

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {isAuthenticated ? (
          // Show dashboard when authenticated
          <div className="flex">
            {/* Sidebar */}
            <div 
              className={`${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0`}
              style={{ height: '100vh', overflowY: 'auto' }}
            >
              <Sidebar collapsed={sidebarCollapsed} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col" style={{ height: '100vh' }}>
              {/* Main Header */}
              <div className="flex-shrink-0">
                <Header toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} onLogout={handleLogout} />
              </div>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <BreadCrumbs />
                
                <Routes>
                  <Route path="/dashboard/analytics" element={
                    <>
                      <AnalyticsCards />
                      <div className="space-y-6 mt-6">
                        <SalesAnalytic />
                        <SocialSource />
                        <LastTransaction />
                      </div>
                    </>
                  } />
                  
                  <Route path="/dashboard/agent" element={<Agent />} />
                  <Route path="/property/property-grid" element={<PropertyGrid />} />
                  <Route path="/property/property-list" element={<PropertyList />} />
                  <Route path="/property/property-details" element={<PropertyDetails />} />
                  <Route path="/property/add-property" element={<AddProperty />} />
                  
                  {/* Other Routes */}
                  <Route path="/agents" element={<div>Agents Page</div>} />
                  <Route path="/customers" element={<div>Customers Page</div>} />
                  <Route path="/orders" element={<div>Orders Page</div>} />
                  <Route path="/transactions" element={<div>Transactions Page</div>} />
                  <Route path="/reviews" element={<div>Reviews Page</div>} />
                  <Route path="/messages" element={<div>Messages Page</div>} />
                  <Route path="/inbox" element={<div>Inbox Page</div>} />
                  
                  {/* Redirects */}
                  <Route path="/" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/dashboard" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/property" element={<Navigate to="/property/property-grid" />} />
                  <Route path="/login" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/signup" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/reset-email" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/reset-otp" element={<Navigate to="/dashboard/analytics" />} />
                  <Route path="/confirm-password" element={<Navigate to="/dashboard/analytics" />} />
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
}

export default App;