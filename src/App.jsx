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
import Profile from "./components/Sidebar/Pages/Profile/Profile";
import Users from "./components/Sidebar/Pages/Users/Users";

// Auth Imports
import Login from "./components/auth/login";
import SignUp from "./components/auth/SignUp";
import ResetEmail from "./components/auth/ResetEmail";
import ResetOtp from "./components/auth/ResetOtp";
import ConfirmPassword from "./components/auth/ConfirmPassword";

const AppRoutes = () => {
  const { login, isLoggedIn } = useAuth();

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
          <Route path="/dashboard/agent" element={<Agent />} />

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
          <Route path="/customers/grid-view" element={<GridView />} />
          <Route
            path="/customers/customer-details"
            element={<CustomerDetails />}
          />
          <Route path="/customers/add-customer" element={<AddCustomer />} />
          <Route
            path="/customers"
            element={<Navigate to="/customers/grid-view" replace />}
          />

          {/* Others */}
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />

          {/* Placeholder Routes */}
          <Route path="/orders" element={<div>Orders Page</div>} />
          <Route path="/transactions" element={<div>Transactions Page</div>} />
          <Route path="/reviews" element={<div>Reviews Page</div>} />
          <Route path="/messages" element={<div>Messages Page</div>} />
          <Route path="/inbox" element={<div>Inbox Page</div>} />

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
