import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BriefcaseIcon } from 'lucide-react';
import { loginUser } from '../../store/slices/userAuthSlice';
import { RootState } from '../../store/store';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
type LoginFormData = z.infer<typeof loginSchema>;
export const UserLogin: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    error
  } = useSelector((state: RootState) => state.userAuth);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  const from = location.state?.from?.pathname || '/user';
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  const onSubmit = async (data: LoginFormData) => {
  // Dispatch login action
  const result = await dispatch(loginUser({
    email: data.email,
    password: data.password
  }) as any);

  // ✅ If login is successful, save the user email locally
  if (result?.payload?.email) {
    localStorage.setItem('userEmail', result.payload.email);
  }
};

  return <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="text-center mb-8">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <BriefcaseIcon size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-1">
          Sign in to your account to continue
        </p>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input id="email" type="email" {...register('email')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          <input id="password" type="password" {...register('password')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.password && <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>}
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/user/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register now
          </Link>
        </p>
      </div>
      <div className="mt-8 border-t pt-6">
        <div className="text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: user@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>;
};