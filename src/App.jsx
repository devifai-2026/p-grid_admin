import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import PrivateRoute from "./helpers/PrivateRoute";

// Page Imports
import AnalyticsPage from "./components/Sidebar/Pages/Dashboard/Analytics/AnalyticsPage";
import Agent from "./components/Sidebar/Pages/Dashboard/Agent/Agent";
import PropertyGrid from "./components/Sidebar/Pages/Property/PropertyGrid/PropertyGrid";
import PropertyDetails from "./components/Sidebar/Pages/Property/PropertyDetails/PropertyDetails";
import AddProperty from "./components/Sidebar/Pages/Property/AddProperty/AddProperty";
import GridView from "./components/Sidebar/Pages/Customers/GridView/GridView";
import CustomerDetails from "./components/Sidebar/Pages/Customers/CustomerDetails/CustomerDetails";
import AddCustomer from "./components/Sidebar/Pages/Customers/AddCustomer/AddCustomer";
import CustomerGrid from "./components/Sidebar/Pages/Customers/GridView/CustomerGrid";
import Profile from "./components/Sidebar/Pages/Profile/Profile";
import Users from "./components/Sidebar/Pages/Users/Users";
import SalesAgents from "./components/Sidebar/Pages/Users/SalesAgents";
import AllNotifications from "./components/Sidebar/Pages/Notifications/AllNotifications";
import Enquiry from "./components/Sidebar/Pages/Enquiry/Enquiry";
import WorkBoard from "./components/Sidebar/Pages/WorkBoard/WorkBoard";

// Auth Imports
import Login from "./components/auth/login";
import SignUp from "./components/auth/SignUp";
import ResetEmail from "./components/auth/ResetEmail";
import ResetOtp from "./components/auth/ResetOtp";
import ConfirmPassword from "./components/auth/ConfirmPassword";

const AppRoutes = () => {
  const { login, isLoggedIn, user } = useAuth();

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard/analytics" replace />
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
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          {/* <Route path="/dashboard/agent" element={<Agent />} /> */}
          <Route path="/dashboard/work-board" element={<WorkBoard />} />
          <Route path="/dashboard/agent" element={<SalesAgents />} />
          <Route path="/dashboard/agent/property-dealer" element={<SalesAgents />} />
          <Route path="/dashboard/agent/client-dealer" element={<SalesAgents />} />

          {/* Properties */}
          <Route path="/property/property-grid" element={<PropertyGrid />} />
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
            element={<CustomerGrid roleTitle="Sales Manager" roleName="Sales Manager" />}
          />
          <Route
            path="/customers/sales-executive-client-dealer"
            element={<CustomerGrid roleTitle="Sales Executive - Client Dealer" roleName="Sales Executive - Client Dealer" />}
          />
          <Route
            path="/customers/sales-executive-property-manager"
            element={<CustomerGrid roleTitle="Sales Executive - Property Manager" roleName="Sales Executive - Property Manager" />}
          />
          <Route path="/customers/grid-view" element={<GridView />} />
          <Route
            path="/customers/customer-details"
            element={<CustomerDetails />}
          />
          <Route path="/customers/add-customer" element={<AddCustomer />} />
          <Route
            path="/customers"
            element={<Navigate to="/customers/owners" replace />}
          />

          {/* Others */}
          <Route path="/users" element={<Users />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/profile" element={<Profile />} />

          {/* Placeholder Routes */}
          <Route path="/notifications" element={<AllNotifications />} />

          {/* Redirects */}
          <Route
            path="/"
            element={<Navigate to="/dashboard/analytics" replace />}
          />
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/analytics" replace />}
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;

// Admin - > 6666666661
// Client Dealer -> 7777777771
