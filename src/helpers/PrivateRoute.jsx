import { Navigate, Outlet } from 'react-router-dom';
import { useUserStorage } from './useUserStorage';

const PrivateRoute = () => {
    const { isLoggedIn } = useUserStorage();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
