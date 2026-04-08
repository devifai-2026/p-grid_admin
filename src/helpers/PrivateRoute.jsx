import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  // Also consider using 'loading' check from useAuth if needed, but AuthProvider already handles that by not rendering children until loading is false.

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
