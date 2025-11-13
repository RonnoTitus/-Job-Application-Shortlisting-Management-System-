import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
interface UserProtectedRouteProps {
  children: React.ReactNode;
}
export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({
  children
}) => {
  const {
    isAuthenticated
  } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{
      from: location
    }} replace />;
  }
  return <>{children}</>;
};