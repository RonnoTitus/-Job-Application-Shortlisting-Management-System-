import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon, BellIcon, LogOutIcon, SearchIcon } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const {
    user
  } = useSelector((state: RootState) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
  };
  return <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 mx-auto flex items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <input type="search" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon size={18} />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <BellIcon size={20} />
          </button>
          <div className="flex items-center">
            <div className="mr-2 text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Staff'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <UserIcon size={20} />
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700" aria-label="Logout">
            <LogOutIcon size={20} />
          </button>
        </div>
      </div>
    </header>;
};