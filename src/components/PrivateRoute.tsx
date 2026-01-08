import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

interface PrivateRouteProps {
    children?: React.ReactNode;
    adminOnly?: boolean;
}

const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    // Check both isAdmin and role for backward compatibility
    if (adminOnly && !(userInfo.isAdmin || userInfo.role === 'admin')) {
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
