import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, BriefcaseIcon, UsersIcon, CheckSquareIcon, FileTextIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const navItems = [{
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboardIcon size={20} />
  }, {
    name: 'Job Postings',
    path: '/jobs',
    icon: <BriefcaseIcon size={20} />
  }, {
    name: 'Applications',
    path: '/applications',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Shortlisting',
    path: '/shortlisting',
    icon: <CheckSquareIcon size={20} />
  }, {
    name: 'Reports',
    path: '/reports',
    icon: <FileTextIcon size={20} />
  }, {
    name: 'Settings',
    path: '/settings',
    icon: <SettingsIcon size={20} />
  }];
  return <aside className={`bg-white shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b`}>
          {!collapsed && <div>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/8916/8916128.png"
                    alt="Job Portal Icon"
                    className="w-10 h-10 hover:scale-110 transition-transform"
                />
              </div>

            </div>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-full hover:bg-gray-100" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
          </button>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map(item => <li key={item.path}>
                <Link to={item.path} className={`flex items-center py-2 px-4 ${isActive(item.path) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>)}
          </ul>
        </nav>
        <div className={`p-4 border-t ${collapsed ? 'text-center' : ''}`}>
          {!collapsed && <div className="text-xs text-gray-500">
              <p>Kapchorwa District</p>
              <p>Local Government</p>
            </div>}
        </div>
      </div>
    </aside>;
};