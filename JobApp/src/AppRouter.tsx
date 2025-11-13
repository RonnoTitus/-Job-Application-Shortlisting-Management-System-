import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { JobsList } from './pages/jobs/JobsList';
import { JobCreate } from './pages/jobs/JobCreate';
import { JobDetail } from './pages/jobs/JobDetail';
import { ApplicationsList } from './pages/applications/ApplicationsList';
import { ApplicationDetail } from './pages/applications/ApplicationDetail';
import { ShortlistingPage } from './pages/shortlisting/ShortlistingPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
// User-facing imports
import { UserLayout } from './components/user/UserLayout';
import { UserProtectedRoute } from './components/user/UserProtectedRoute';
import { UserDashboard } from './pages/user/UserDashboard';
import { UserLogin } from './pages/user/UserLogin';
import { UserRegister } from './pages/user/UserRegister';
import { UserJobsList } from './pages/user/UserJobsList';
import { UserJobDetail } from './pages/user/UserJobDetail';
import { UserApplicationForm } from './pages/user/UserApplicationForm';
import { UserApplications } from './pages/user/UserApplications';
import { UserApplicationDetail } from './pages/user/UserApplicationDetail';
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        {/* Redirect root to /user */}
        <Route path="/" element={<Navigate to="/user " replace />} />
        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="register" element={<UserRegister />} />
          <Route path="jobs">
            <Route index element={<UserJobsList />} />
            <Route path=":id" element={<UserJobDetail />} />
          </Route>
          <Route path="apply/:id" element={<UserProtectedRoute>
                <UserApplicationForm />
              </UserProtectedRoute>} />
          <Route path="applications" element={<UserProtectedRoute>
                <UserApplications />
              </UserProtectedRoute>} />
          <Route path="applications/:id" element={<UserProtectedRoute>
                <UserApplicationDetail />
              </UserProtectedRoute>} />
        </Route>
       
        {/* Admin Routes */}
        <Route path="/admin/login/" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute>
              <Layout />
            </ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="jobs">
            <Route index element={<JobsList />} />
            <Route path="create" element={<JobCreate />} />
            <Route path=":id" element={<JobDetail />} />
          </Route>
          <Route path="applications">
            <Route index element={<ApplicationsList />} />
            <Route path=":id" element={<ApplicationDetail />} />
          </Route>
          <Route path="shortlisting" element={<ShortlistingPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>;
}