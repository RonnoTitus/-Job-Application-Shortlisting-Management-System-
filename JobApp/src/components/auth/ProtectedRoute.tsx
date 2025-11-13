import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = []
}) => {
  const {
    isAuthenticated,
    user
  } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{
      from: location
    }} replace />;
  }
  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};