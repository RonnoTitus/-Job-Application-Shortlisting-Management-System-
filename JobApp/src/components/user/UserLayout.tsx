import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserNavbar } from './UserNavbar';
import { Footer } from '../layout/Footer';
export const UserLayout: React.FC = () => {
  return <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>;
};