import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import PrivateRoute from "./helpers/PrivateRoute";

// Page Imports
import AnalyticsPage from "./components/Sidebar/Pages/Dashboard/Analytics/AnalyticsPage";
import Analytics from "./components/Sidebar/Pages/Dashboard/NewAnalytics/Analytics";
import PropertyNotes from "./components/Sidebar/Pages/PropertyNotes/PropertyNotes";
import Agent from "./components/Sidebar/Pages/Dashboard/Agent/Agent";
import PropertyGrid from "./components/Sidebar/Pages/Property/PropertyGrid/PropertyGrid";
import PropertyDetails from "./components/Sidebar/Pages/Property/PropertyDetails/PropertyDetails";
import AddProperty from "./components/Sidebar/Pages/Property/AddProperty/AddProperty";
import GridView from "./components/Sidebar/Pages/Customers/GridView/GridView";
import CustomerDetails from "./components/Sidebar/Pages/Customers/CustomerDetails/CustomerDetails";
import ClientDetails from "./components/Sidebar/Pages/Customers/ClientDetails/ClientDetails";
import AddCustomer from "./components/Sidebar/Pages/Customers/AddCustomer/AddCustomer";
import CustomerGrid from "./components/Sidebar/Pages/Customers/GridView/CustomerGrid";
import Profile from "./components/Sidebar/Pages/Profile/Profile";
import Users from "./components/Sidebar/Pages/Users/Users";
import SalesAgents from "./components/Sidebar/Pages/Users/SalesAgents";
import AllNotifications from "./components/Sidebar/Pages/Notifications/AllNotifications";
import Enquiry from "./components/Sidebar/Pages/Enquiry/Enquiry";
import WorkBoard from "./components/Sidebar/Pages/WorkBoard/WorkBoard";
import ExecutiveWorkBoard from "./components/Sidebar/Pages/WorkBoard/ExecutiveWorkBoard";
import HotProperty from "./components/Sidebar/Pages/Property/HotProperty/HotProperty";

import HelpandSupport from "./components/Sidebar/Pages/HelpandSupport/HelpandSupport";

import ExecutiveAnalytics from "./components/Sidebar/Pages/Dashboard/NewAnalytics/ExecutiveAnalytics";

// Auth Imports
import Login from "./components/auth/login";
import SignUp from "./components/auth/SignUp";
import ResetEmail from "./components/auth/ResetEmail";
import ResetOtp from "./components/auth/ResetOtp";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import SalesBoard from "./components/Sidebar/Pages/SalesBoard/SalesBoard";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const { login, isLoggedIn, user } = useAuth();

  const getRedirectPath = (role) => {
    const r = role?.toLowerCase() || "";
    if (r === "sales manager") return "/dashboard/analytics";
    if (r.includes("client dealer")) return "/enquiry";
    if (
      r.includes("property manager") ||
      r.includes("property dealer") ||
      role === "Sales Executive - Property Manager"
    )
      return "/dashboard/workboard";
    if (r === "admin" || r === "super admin") return "/dashboard/work-board";
    return "/property/property-details";
  };

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to={getRedirectPath(user?.role)} replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-email" element={<ResetEmail />} />
      <Route path="/reset-otp" element={<ResetOtp />} />
      <Route path="/confirm-password" element={<ConfirmPassword />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          {/* <Route path="/dashboard/analytics" element={<AnalyticsPage />} /> */}
          <Route
            path="/dashboard/analytics"
            element={
              user?.role === "Sales Manager" ? (
                <Analytics />
              ) : user?.role === "Sales Executive - Property Manager" ? (
                <ExecutiveAnalytics />
              ) : (
                <Navigate to={getRedirectPath(user?.role)} replace />
              )
            }
          />
          {/* <Route path="/dashboard/agent" element={<Agent />} /> */}
          <Route path="/dashboard/work-board" element={<WorkBoard />} />
          <Route path="/dashboard/agent" element={<SalesAgents />} />
          <Route
            path="/dashboard/agent/property-dealer"
            element={<SalesAgents />}
          />
          <Route
            path="/dashboard/agent/client-dealer"
            element={<SalesAgents />}
          />
          <Route path="/dashboard/workboard" element={<ExecutiveWorkBoard />} />
          <Route path="/dashboard/sales-board" element={<SalesBoard />} />

          <Route path="/dashboard/property-notes" element={<PropertyNotes />} />

          {/* Properties */}
          <Route path="/property/property-grid" element={<PropertyGrid />} />
          <Route path="/property/hot-property" element={<HotProperty />} />
          <Route
            path="/property/property-details/:id"
            element={<PropertyDetails />}
          />
          <Route
            path="/property/property-details"
            element={<PropertyDetails />}
          />
          <Route path="/property/add-property" element={<AddProperty />} />

          {/* Customers */}
          <Route
            path="/customers/owners"
            element={<CustomerGrid roleTitle="Owners" roleName="Owner" />}
          />
          <Route
            path="/customers/brokers"
            element={<CustomerGrid roleTitle="Brokers" roleName="Broker" />}
          />
          <Route
            path="/customers/investors"
            element={<CustomerGrid roleTitle="Investors" roleName="Investor" />}
          />
          <Route
            path="/customers/sales-manager"
            element={
              <CustomerGrid
                roleTitle="Sales Manager"
                roleName="Sales Manager"
              />
            }
          />
          <Route
            path="/customers/sales-executive-client-dealer"
            element={
              <CustomerGrid
                roleTitle="Sales Executive - Client Dealer"
                roleName="Sales Executive - Client Dealer"
              />
            }
          />
          <Route
            path="/customers/sales-executive-property-manager"
            element={
              <CustomerGrid
                roleTitle="Sales Executive - Property Manager"
                roleName="Sales Executive - Property Manager"
              />
            }
          />
          <Route path="/customers/grid-view" element={<GridView />} />
          <Route
            path="/customers/customer-details"
            element={<CustomerDetails />}
          />
          <Route path="/customers/add-customer" element={<AddCustomer />} />
          <Route path="/client-details/:id" element={<ClientDetails />} />
          <Route
            path="/customers"
            element={<Navigate to="/customers/owners" replace />}
          />

          {/* Others */}
          <Route path="/users" element={<Users />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help-and-support" element={<HelpandSupport />} />

          {/* Placeholder Routes */}
          <Route path="/notifications" element={<AllNotifications />} />

          {/* Redirects */}
          <Route
            path="/"
            element={<Navigate to={getRedirectPath(user?.role)} replace />}
          />
          <Route
            path="/dashboard"
            element={<Navigate to={getRedirectPath(user?.role)} replace />}
          />
          <Route
            path="/property"
            element={<Navigate to="/property/property-grid" replace />}
          />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

export default App;

// Admin - > 6666666661
// Client Dealer -> 7777777771
