import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon, MenuIcon, XIcon, BriefcaseIcon, LogOutIcon } from 'lucide-react';
import { userLogout } from '../../store/slices/userAuthSlice';
import { RootState } from '../../store/store';
export const UserNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    user,
    isAuthenticated
  } = useSelector((state: RootState) => state.userAuth);
  const handleLogout = () => {
    dispatch(userLogout());
    navigate('/user/login');
  };
  return <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/user" className="flex items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/8916/8916128.png"
                    alt="Job Portal Icon"
                    className="w-10 h-10 hover:scale-110 transition-transform"
                />
              </div>

          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/user" className="hover:text-blue-200">
              Home
            </Link>
            <Link to="/user/jobs" className="hover:text-blue-200">
              Jobs
            </Link>
            <Link to="/user/applications" className="hover:text-blue-200">
              My Applications
            </Link>
            {isAuthenticated ? <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white">
                    <UserIcon size={16} />
                  </div>
                  <span className="ml-2">{user?.fullName.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
                  <LogOutIcon size={16} className="mr-1" />
                  Logout
                </button>
              </div> : <div className="space-x-2">
                <Link to="/user/login" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-50">
                  Login
                </Link>
                <Link to="/user/register" className="bg-blue-700 px-4 py-1 rounded hover:bg-blue-800">
                  Register
                </Link>
              </div>}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden pb-4 space-y-3">
            <Link to="/user" className="block py-2 hover:bg-blue-700 px-2 rounded">
              Home
            </Link>
            <Link to="/user/jobs" className="block py-2 hover:bg-blue-700 px-2 rounded">
              Jobs
            </Link>
            <Link to="/user/applications" className="block py-2 hover:bg-blue-700 px-2 rounded">
              My Applications
            </Link>
            {isAuthenticated ? <>
                <div className="py-2 px-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white">
                    <UserIcon size={16} />
                  </div>
                  <span className="ml-2">{user?.fullName}</span>
                </div>
                <button onClick={handleLogout} className="block w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                  Logout
                </button>
              </> : <div className="flex flex-col space-y-2">
                <Link to="/user/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 text-center">
                  Login
                </Link>
                <Link to="/user/register" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 text-center">
                  Register
                </Link>
              </div>}
          </div>}
      </div>
    </nav>;
};