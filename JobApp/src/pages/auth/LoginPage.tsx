import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
type LoginFormData = z.infer<typeof loginSchema>;
export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    error
  } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  const from = location.state?.from?.pathname || '/';
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());
    try {
      // Simulate API call
      // In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful login
      if (data.email === 'admin@kdlg.go.ug' && data.password === 'password123') {
        dispatch(loginSuccess({
          user: {
            id: '1',
            name: 'Admin User',
            email: data.email,
            role: 'admin'
          },
          token: 'mock-jwt-token'
        }));
      } else {
        dispatch(loginFailure('Invalid email or password'));
      }
    } catch (err) {
      dispatch(loginFailure('Login failed. Please try again.'));
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kapchorwa District Local Government
          </h2>
          <h3 className="mt-2 text-center text-xl font-medium text-gray-900">
            Shortlisting Management System
          </h3>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input id="email" type="email" autoComplete="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" {...register('email')} />
              {errors.email && <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input id="password" type="password" autoComplete="current-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" {...register('password')} />
              {errors.password && <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p>Email: admin@kdlg.go.ug</p>
            <p>Password: password123</p>
          </div>
        </form>
      </div>
    </div>;
};