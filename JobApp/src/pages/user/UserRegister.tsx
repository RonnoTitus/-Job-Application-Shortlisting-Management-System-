import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BriefcaseIcon } from 'lucide-react';
import { registerUser } from '../../store/slices/userAuthSlice';
import { RootState } from '../../store/store';
import { toast } from 'sonner';
const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
type RegisterFormData = z.infer<typeof registerSchema>;
export const UserRegister: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });
  if (isAuthenticated) {
    return <Navigate to="/user" replace />;
  }
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      }) as any);
      toast.success('Registration successful!');
      navigate('/user');
    } catch (err) {
      // Error is handled by the Redux slice
    }
  };
  return <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="text-center mb-8">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <BriefcaseIcon size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-1">
          Join Kapchorwa District Local Government Job Portal
        </p>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input id="fullName" type="text" {...register('fullName')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input id="email" type="email" {...register('email')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input id="phone" type="tel" {...register('phone')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="e.g. +256701234567" />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input id="password" type="password" {...register('password')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.password && <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>}
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/user/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>;
};